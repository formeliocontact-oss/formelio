// lib/errors/error-handler.ts
import { isAppError, ValidationError } from './error-types';
import { logError } from './error-logger';

export interface ErrorContext {
  userId?: string;
  organizationId?: string;
  route?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorResponse {
  message: string;
  code: string;
  statusCode: number;
  fields?: Record<string, string[]>;
  metadata?: Record<string, unknown>;
}

/**
 * Handler centralisé pour toutes les erreurs de l'application
 * Transforme les erreurs en réponses cohérentes pour l'utilisateur
 */
export class ErrorHandler {
  /**
   * Point d'entrée principal pour gérer une erreur
   */
  static handle(error: unknown, context?: ErrorContext): ErrorResponse {
    // Log l'erreur (Sentry en prod, console en dev)
    logError(error, context);

    // Erreur opérationnelle connue (AppError)
    if (isAppError(error)) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        fields: error instanceof ValidationError ? error.fields : undefined,
        metadata: error.metadata,
      };
    }

    // Erreur Supabase
    if (this.isSupabaseError(error)) {
      return this.handleSupabaseError(error);
    }

    // Erreur réseau (fetch failed)
    if (this.isNetworkError(error)) {
      return this.handleNetworkError();
    }

    // Erreur Zod (validation)
    if (this.isZodError(error)) {
      return this.handleZodError(error);
    }

    // Erreur inconnue - ne pas exposer les détails à l'utilisateur
    console.error('🔴 Unexpected error:', error);
    return {
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }

  /**
   * Gère les erreurs Supabase spécifiques
   */
  private static handleSupabaseError(error: any): ErrorResponse {
    // Mapper les codes PostgreSQL communs
    const postgresErrorMap: Record<string, string> = {
      '23505': 'Cette entrée existe déjà.',
      '23503': 'Élément lié introuvable.',
      '23502': 'Champ obligatoire manquant.',
      '42501': 'Permissions insuffisantes.',
      '42P01': 'Table non trouvée.',
      '08006': 'Connexion à la base de données perdue.',
    };

    // Mapper les codes Supabase/PostgREST
    const supabaseErrorMap: Record<string, string> = {
      PGRST301: 'Authentification requise.',
      PGRST204: 'Aucun résultat trouvé.',
      '23514': 'Valeur non autorisée.',
    };

    const code = error.code || error.error_code;
    const message =
      postgresErrorMap[code] ||
      supabaseErrorMap[code] ||
      error.message ||
      'Erreur de base de données.';

    // RLS policy violation
    if (code === '42501' || message.includes('policy')) {
      return {
        message: 'Accès refusé à cette ressource.',
        code: 'RLS_ERROR',
        statusCode: 403,
      };
    }

    return {
      message,
      code: 'SUPABASE_ERROR',
      statusCode: 500,
      metadata: {
        hint: error.hint,
        details: error.details,
      },
    };
  }

  /**
   * Gère les erreurs réseau
   */
  private static handleNetworkError(): ErrorResponse {
    return {
      message: 'Erreur réseau. Vérifiez votre connexion internet.',
      code: 'NETWORK_ERROR',
      statusCode: 503,
    };
  }

  /**
   * Gère les erreurs de validation Zod
   */
  private static handleZodError(error: any): ErrorResponse {
    const fields: Record<string, string[]> = {};

    error.errors?.forEach((err: any) => {
      const path = err.path.join('.');
      if (!fields[path]) {
        fields[path] = [];
      }
      fields[path].push(err.message);
    });

    return {
      message: 'Données invalides.',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      fields,
    };
  }

  // ============================================================================
  // TYPE GUARDS
  // ============================================================================

  private static isSupabaseError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('code' in error || 'error_code' in error || 'hint' in error)
    );
  }

  private static isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError) {
      return (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch')
      );
    }
    return false;
  }

  private static isZodError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'errors' in error &&
      Array.isArray((error as any).errors)
    );
  }
}

// lib/errors/error-types.ts

/**
 * Classe de base pour toutes les erreurs applicatives
 * Permet de distinguer les erreurs opérationnelles des erreurs système
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
    };
  }
}

// ============================================================================
// ERREURS D'AUTHENTIFICATION
// ============================================================================

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentification requise') {
    super(message, 'AUTH_REQUIRED', 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Accès refusé') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class SessionExpiredError extends AppError {
  constructor() {
    super(
      'Votre session a expiré. Veuillez vous reconnecter.',
      'SESSION_EXPIRED',
      401
    );
  }
}

// ============================================================================
// ERREURS DE VALIDATION
// ============================================================================

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400, true, { fields });
  }
}

export class InvalidInputError extends AppError {
  constructor(field: string, reason: string) {
    super(`${field}: ${reason}`, 'INVALID_INPUT', 400);
  }
}

// ============================================================================
// ERREURS SUPABASE
// ============================================================================

export class SupabaseError extends AppError {
  constructor(
    message: string,
    public originalError?: unknown,
    public query?: string
  ) {
    super(message, 'SUPABASE_ERROR', 500, true, { originalError, query });
  }
}

export class DatabaseConnectionError extends AppError {
  constructor() {
    super(
      'Impossible de se connecter à la base de données. Veuillez réessayer.',
      'DB_CONNECTION_ERROR',
      503
    );
  }
}

export class RowLevelSecurityError extends AppError {
  constructor(resource: string) {
    super(
      `Vous n'avez pas les permissions pour accéder à ${resource}.`,
      'RLS_ERROR',
      403
    );
  }
}

// ============================================================================
// ERREURS DE PAIEMENT
// ============================================================================

export class PaymentError extends AppError {
  constructor(
    message: string,
    public stripeErrorCode?: string,
    public stripeErrorType?: string
  ) {
    super(message, 'PAYMENT_ERROR', 402, true, {
      stripeErrorCode,
      stripeErrorType,
    });
  }
}

export class PaymentDeclinedError extends PaymentError {
  constructor(reason?: string) {
    super(
      reason ? `Paiement refusé: ${reason}` : 'Votre paiement a été refusé.',
      'card_declined',
      'card_error'
    );
  }
}

export class InsufficientFundsError extends PaymentError {
  constructor() {
    super(
      'Fonds insuffisants sur votre carte.',
      'insufficient_funds',
      'card_error'
    );
  }
}

// ============================================================================
// ERREURS DE DOCUMENTS
// ============================================================================

export class DocumentError extends AppError {
  constructor(
    message: string,
    public documentId?: string
  ) {
    super(message, 'DOCUMENT_ERROR', 500, true, { documentId });
  }
}

export class FileUploadError extends DocumentError {
  constructor(filename: string, reason: string) {
    super(`Échec du téléchargement de ${filename}: ${reason}`);
  }
}

export class FileSizeExceededError extends DocumentError {
  constructor(maxSize: number) {
    super(
      `La taille du fichier dépasse la limite autorisée de ${maxSize / 1024 / 1024}MB.`,
      undefined
    );
  }
}

export class UnsupportedFileTypeError extends DocumentError {
  constructor(fileType: string) {
    super(`Type de fichier non supporté: ${fileType}`);
  }
}

// ============================================================================
// ERREURS RÉSEAU
// ============================================================================

export class NetworkError extends AppError {
  constructor(message: string = 'Erreur réseau. Vérifiez votre connexion.') {
    super(message, 'NETWORK_ERROR', 503);
  }
}

export class TimeoutError extends AppError {
  constructor(operation: string) {
    super(`Délai d'attente dépassé pour: ${operation}`, 'TIMEOUT_ERROR', 504);
  }
}

// ============================================================================
// ERREURS MÉTIER
// ============================================================================

export class CaseNotFoundError extends AppError {
  constructor(caseId: string) {
    super(`Dossier non trouvé: ${caseId}`, 'CASE_NOT_FOUND', 404);
  }
}

export class DuplicateCaseError extends AppError {
  constructor(reference: string) {
    super(
      `Un dossier avec la référence ${reference} existe déjà.`,
      'DUPLICATE_CASE',
      409
    );
  }
}

export class OrganizationQuotaExceededError extends AppError {
  constructor(quota: string) {
    super(
      `Votre quota ${quota} est atteint. Contactez-nous pour augmenter votre limite.`,
      'QUOTA_EXCEEDED',
      429
    );
  }
}

// ============================================================================
// HELPERS
// ============================================================================

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isOperationalError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
}

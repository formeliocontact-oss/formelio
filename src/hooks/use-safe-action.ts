// hooks/use-safe-action.ts
'use client';

import { useState, useCallback } from 'react';
import { ErrorHandler } from '@/lib/errors/error-handler';
import { toast } from 'sonner';

interface UseSafeActionOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

/**
 * Hook pour exécuter des actions asynchrones avec gestion d'erreurs automatique
 *
 * @example
 * const { execute, loading, error } = useSafeAction()
 *
 * const handleSubmit = async (data) => {
 *   const result = await execute(createCase, data)
 *   if (result) {
 *     router.push(`/cases/${result.id}`)
 *   }
 * }
 */
export function useSafeAction<T extends (...args: any[]) => Promise<any>>(
  options: UseSafeActionOptions = {}
) {
  const { onSuccess, onError, showToast = true } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      action: T,
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>> | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await action(...args);

        if (onSuccess) {
          onSuccess();
        }

        return result;
      } catch (err) {
        const errorInfo = ErrorHandler.handle(err as Error, {
          action: action.name || 'anonymous_action',
        });

        setError(errorInfo.message);

        if (showToast) {
          toast.error(errorInfo.message, {
            description:
              errorInfo.code !== 'INTERNAL_ERROR'
                ? `Code: ${errorInfo.code}`
                : undefined,
          });
        }

        if (onError) {
          onError(errorInfo.message);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, showToast]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { execute, loading, error, reset };
}

/**
 * React Hooks для работы с API
 * Использует новые контракты и API client
 */

import { useState, useCallback, useEffect } from 'react';
import { isSuccessResponse, ApiError, type ApiResponse } from '@/contracts';

/**
 * Базовый хук для API вызовов
 */
export function useApi<TRequest, TResponse>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const execute = useCallback(async (
    url: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    body?: TRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const apiResponse: ApiResponse<TResponse> = await response.json();

      if (isSuccessResponse(apiResponse)) {
        setData(apiResponse.data);
        return apiResponse.data;
      } else {
        const apiError = ApiError.fromResponse(apiResponse);
        setError(apiError);
        throw apiError;
      }
    } catch (err) {
      const error = err instanceof ApiError 
        ? err 
        : new ApiError('INTERNAL_ERROR', 'Произошла непредвиденная ошибка');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, data, execute, reset };
}

/**
 * Хук для работы с аутентификацией
 */
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем пользователя из кеша
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('currentUser');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          // Ignore
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { AuthAPI } = await import('@/lib/api-client');
    const result = await AuthAPI.login({ email, password });
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    const { AuthAPI } = await import('@/lib/api-client');
    await AuthAPI.logout();
    setUser(null);
  }, []);

  const register = useCallback(async (data: any) => {
    const { AuthAPI } = await import('@/lib/api-client');
    const result = await AuthAPI.register(data);
    setUser(result.user);
    return result;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
}

/**
 * Хук для получения списка площадок
 */
export function useVenues(params?: any) {
  const { loading, error, data, execute } = useApi<never, any>();

  useEffect(() => {
    const loadVenues = async () => {
      const { VenuesAPI } = await import('@/lib/api-client');
      try {
        const result = await VenuesAPI.getVenues(params);
        // Manually set data since we're not using execute
        return result;
      } catch (err) {
        console.error('Error loading venues:', err);
      }
    };

    loadVenues();
  }, [params]);

  return { loading, error, venues: data?.items || [], pagination: data?.pagination, execute };
}

/**
 * Хук для получения одной площадки
 */
export function useVenue(venueId: string | null) {
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!venueId) {
      setLoading(false);
      return;
    }

    const loadVenue = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { VenuesAPI } = await import('@/lib/api-client');
        const result = await VenuesAPI.getVenue(venueId);
        setVenue(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load venue'));
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [venueId]);

  return { venue, loading, error };
}

/**
 * Хук для работы с категориями
 */
export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { ItemCategoriesAPI } = await import('@/lib/api-client');
        const [categoriesResult, hierarchyResult] = await Promise.all([
          ItemCategoriesAPI.getCategories(),
          ItemCategoriesAPI.getHierarchy(),
        ]);
        
        setCategories(categoriesResult.categories);
        setHierarchy(hierarchyResult.hierarchy);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load categories'));
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, hierarchy, loading, error };
}

/**
 * Хук для откликов волонтера
 */
export function useMyResponses() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadResponses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { ResponsesAPI } = await import('@/lib/api-client');
      const result = await ResponsesAPI.getMyResponses();
      setResponses(result.items || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load responses'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  return { responses, loading, error, reload: loadResponses };
}

/**
 * Хук для обязательств бенефициара
 */
export function useMyCommitments() {
  const [commitments, setCommitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCommitments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { CommitmentsAPI } = await import('@/lib/api-client');
      const result = await CommitmentsAPI.getMyCommitments();
      setCommitments(result.items || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load commitments'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommitments();
  }, [loadCommitments]);

  return { commitments, loading, error, reload: loadCommitments };
}

/**
 * Хук для проекции площадки (для организаторов)
 */
export function useVenueProjection(venueId: string | null, functionId?: string) {
  const [projection, setProjection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjection = useCallback(async () => {
    if (!venueId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { ProjectionsAPI } = await import('@/lib/api-client');
      const result = await ProjectionsAPI.getVenueProjection({ venueId, functionId });
      setProjection(result.projection);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load projection'));
    } finally {
      setLoading(false);
    }
  }, [venueId, functionId]);

  useEffect(() => {
    loadProjection();
  }, [loadProjection]);

  return { projection, loading, error, reload: loadProjection };
}

/**
 * Хук для мутаций (создание/обновление/удаление)
 */
export function useMutation<TRequest, TResponse>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(async (
    fn: (data: TRequest) => Promise<TResponse>,
    data: TRequest
  ): Promise<TResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await fn(data);
      return result;
    } catch (err) {
      const error = err instanceof ApiError 
        ? err 
        : new ApiError('INTERNAL_ERROR', 'Произошла непредвиденная ошибка');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}


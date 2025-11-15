/**
 * Утилиты для работы с API контрактами
 */

import type { 
  ApiResponse, 
  ApiSuccessResponse, 
  ApiErrorResponse,
  ErrorCode 
} from './common';

// === Создание ответов ===

/**
 * Создает успешный API ответ
 */
export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Создает ответ с ошибкой
 */
export function createErrorResponse(
  code: ErrorCode | string,
  message: string,
  details?: Record<string, unknown>
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

// === Проверка типов ответов ===

/**
 * Проверяет, является ли ответ успешным
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Проверяет, является ли ответ ошибкой
 */
export function isErrorResponse(
  response: ApiResponse<unknown>
): response is ApiErrorResponse {
  return response.success === false;
}

// === Извлечение данных ===

/**
 * Извлекает данные из успешного ответа или выбрасывает ошибку
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error(`API Error: ${response.error.code} - ${response.error.message}`);
}

/**
 * Извлекает данные из успешного ответа или возвращает значение по умолчанию
 */
export function unwrapResponseOr<T>(
  response: ApiResponse<T>,
  defaultValue: T
): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  return defaultValue;
}

// === Обработка ошибок ===

/**
 * Создает объект ошибки из ApiErrorResponse
 */
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: ApiErrorResponse): ApiError {
    return new ApiError(
      response.error.code,
      response.error.message,
      response.error.details
    );
  }
}

/**
 * Оборачивает промис с ApiResponse и автоматически выбрасывает ошибку если запрос не успешен
 */
export async function unwrapApiCall<T>(
  promise: Promise<ApiResponse<T>>
): Promise<T> {
  const response = await promise;
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw ApiError.fromResponse(response);
}

// === Валидация ===

/**
 * Проверяет, является ли строка валидным UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Проверяет, является ли строка валидной датой в формате ISO 8601
 */
export function isValidTimestamp(str: string): boolean {
  const date = new Date(str);
  return !isNaN(date.getTime()) && date.toISOString() === str;
}

/**
 * Проверяет, являются ли координаты валидными
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// === Преобразование данных ===

/**
 * Преобразует Date в Timestamp (ISO 8601 строку)
 */
export function dateToTimestamp(date: Date): string {
  return date.toISOString();
}

/**
 * Преобразует Timestamp (ISO 8601 строку) в Date
 */
export function timestampToDate(timestamp: string): Date {
  return new Date(timestamp);
}

/**
 * Создает URL query string из объекта параметров
 */
export function createQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)));
    } else if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// === Типобезопасные HTTP методы ===

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface FetchOptions<T = unknown> {
  method: HttpMethod;
  headers?: HeadersInit;
  body?: T;
  signal?: AbortSignal;
}

/**
 * Типобезопасная обертка для fetch
 */
export async function typedFetch<TRequest, TResponse>(
  url: string,
  options: FetchOptions<TRequest>
): Promise<ApiResponse<TResponse>> {
  const { method, headers = {}, body, signal } = options;
  
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };
  
  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
  };
  
  if (body !== undefined && method !== 'GET' && method !== 'DELETE') {
    requestInit.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, requestInit);
    const data = await response.json();
    
    if (!response.ok) {
      // Если сервер не вернул ApiErrorResponse, создаем его
      if (!data.success && data.error) {
        return data as ApiResponse<TResponse>;
      }
      
      return createErrorResponse(
        'INTERNAL_ERROR',
        `HTTP ${response.status}: ${response.statusText}`,
        { status: response.status, statusText: response.statusText }
      ) as ApiResponse<TResponse>;
    }
    
    return data as ApiResponse<TResponse>;
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error occurred'
    ) as ApiResponse<TResponse>;
  }
}

// === API Client базовый класс ===

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
  onError?: (error: ApiErrorResponse) => void;
}

export class ApiClient {
  constructor(private options: ApiClientOptions) {}

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.options.getToken) {
      const token = await this.options.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<TResponse>(
    path: string,
    params?: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<ApiResponse<TResponse>> {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const url = `${this.options.baseUrl}${path}${queryString}`;
    
    const response = await typedFetch<never, TResponse>(url, {
      method: 'GET',
      headers: await this.getHeaders(),
      signal,
    });

    if (isErrorResponse(response) && this.options.onError) {
      this.options.onError(response);
    }

    return response;
  }

  async post<TRequest, TResponse>(
    path: string,
    body: TRequest,
    signal?: AbortSignal
  ): Promise<ApiResponse<TResponse>> {
    const url = `${this.options.baseUrl}${path}`;
    
    const response = await typedFetch<TRequest, TResponse>(url, {
      method: 'POST',
      headers: await this.getHeaders(),
      body,
      signal,
    });

    if (isErrorResponse(response) && this.options.onError) {
      this.options.onError(response);
    }

    return response;
  }

  async patch<TRequest, TResponse>(
    path: string,
    body: TRequest,
    signal?: AbortSignal
  ): Promise<ApiResponse<TResponse>> {
    const url = `${this.options.baseUrl}${path}`;
    
    const response = await typedFetch<TRequest, TResponse>(url, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body,
      signal,
    });

    if (isErrorResponse(response) && this.options.onError) {
      this.options.onError(response);
    }

    return response;
  }

  async delete<TResponse>(
    path: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<TResponse>> {
    const url = `${this.options.baseUrl}${path}`;
    
    const response = await typedFetch<never, TResponse>(url, {
      method: 'DELETE',
      headers: await this.getHeaders(),
      signal,
    });

    if (isErrorResponse(response) && this.options.onError) {
      this.options.onError(response);
    }

    return response;
  }
}

// === Пример использования ===

/*
// Создание клиента
const apiClient = new ApiClient({
  baseUrl: 'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token'),
  onError: (error) => {
    console.error('API Error:', error.error.message);
  }
});

// Использование
import type { LoginRequest, LoginResponse } from './auth';

const response = await apiClient.post<LoginRequest, LoginResponse>(
  '/auth/login',
  {
    email: 'user@example.com',
    password: 'password123'
  }
);

if (isSuccessResponse(response)) {
  console.log('User:', response.data.user);
  console.log('Token:', response.data.accessToken);
} else {
  console.error('Login failed:', response.error.message);
}
*/


/**
 * Экспорт всех контрактов
 */

// Общие типы
export * from './common';

// Аутентификация
export * from './auth';

// Площадки
export * from './venue';

// Функции площадок
export * from './venue-function';

// Отклики и обязательства
export * from './response';

// Категории предметов
export * from './item-category';

// === Сводная типизация всех endpoints ===

import type { AuthEndpoints } from './auth';
import type { VenueEndpoints } from './venue';
import type { VenueFunctionEndpoints } from './venue-function';
import type { ResponseEndpoints } from './response';
import type { ItemCategoryEndpoints } from './item-category';

export type ApiEndpoints = 
  & AuthEndpoints 
  & VenueEndpoints 
  & VenueFunctionEndpoints 
  & ResponseEndpoints 
  & ItemCategoryEndpoints;

// === Helper types для работы с API ===

export type EndpointMethod = keyof ApiEndpoints;

export type RequestOf<T extends EndpointMethod> = ApiEndpoints[T]['request'];

export type ResponseOf<T extends EndpointMethod> = ApiEndpoints[T]['response'];

// === Утилиты для типобезопасных вызовов ===

export type ExtractEndpoint<
  Method extends string,
  Path extends string
> = `${Method} ${Path}` extends EndpointMethod 
  ? `${Method} ${Path}` 
  : never;

// Пример использования:
// type LoginEndpoint = ExtractEndpoint<'POST', '/auth/login'>;
// type LoginRequest = RequestOf<LoginEndpoint>;
// type LoginResponse = ResponseOf<LoginEndpoint>;


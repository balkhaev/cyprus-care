# Руководство по миграции на новые контракты

## 📋 Что изменилось

### Старая структура
```
types/
  ├── api-contracts.ts  ❌ (устарел)
  ├── venue.ts
  ├── item-category.ts
  └── response.ts

lib/
  ├── api.ts            ❌ (устарел)
  └── auth.ts           ❌ (устарел)
```

### Новая структура
```
contracts/                ✅ (новое)
  ├── common.ts          # Базовые типы
  ├── auth.ts            # Аутентификация
  ├── venue.ts           # Площадки
  ├── venue-function.ts  # Функции
  ├── response.ts        # Отклики/обязательства
  ├── item-category.ts   # Категории
  ├── utils.ts           # Утилиты
  ├── examples.ts        # Примеры
  └── index.ts           # Экспорт

lib/
  └── api-client.ts      ✅ (новое)

hooks/
  └── use-api.ts         ✅ (новое)
```

## 🚀 Пошаговая миграция

### Шаг 1: Обновить импорты

#### Было:
```typescript
import type { Venue } from '@/types/venue';
import type { User } from '@/lib/auth';
import { apiRequest } from '@/lib/api';
```

#### Стало:
```typescript
import type { Venue, User } from '@/contracts';
import { apiClient, AuthAPI, VenuesAPI } from '@/lib/api-client';
```

### Шаг 2: Использовать новый API client

#### Было:
```typescript
const response = await fetch('/api/venues', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(venueData),
});

const data = await response.json();
if (response.ok) {
  console.log('Venue created:', data);
}
```

#### Стало:
```typescript
import { VenuesAPI, isSuccessResponse } from '@/lib/api-client';

try {
  const result = await VenuesAPI.createVenue(venueData);
  console.log('Venue created:', result.venue);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Error:', error.code, error.message);
  }
}
```

### Шаг 3: Использовать React Hooks

#### Было:
```typescript
const [venues, setVenues] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/venues')
    .then(res => res.json())
    .then(data => {
      setVenues(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, []);
```

#### Стало:
```typescript
import { useVenues } from '@/hooks/use-api';

const { venues, loading, error } = useVenues({ page: 1, limit: 10 });
```

## 📝 Примеры миграции

### Аутентификация

#### Было:
```typescript
// lib/auth.ts
export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/api/me/`, {
    headers: { 'Authorization': `Token ${token}` },
  });

  if (res.ok) {
    const user = await res.json();
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
}
```

#### Стало:
```typescript
import { AuthAPI } from '@/lib/api-client';

// В компоненте
const user = await AuthAPI.getCurrentUser();

// Или используя хук
import { useAuth } from '@/hooks/use-api';

const { user, loading, login, logout } = useAuth();
```

### Создание площадки

#### Было:
```typescript
import { createVenue } from '@/lib/api/venues';

const newVenue = await createVenue({
  ...venueData,
  organizerId: user.id,
});
```

#### Стало:
```typescript
import { VenuesAPI } from '@/lib/api-client';
import type { CreateVenueRequest } from '@/contracts';

const request: CreateVenueRequest = {
  title: 'Пункт помощи',
  description: 'Описание',
  type: 'distribution_hub',
  location: {
    lat: 34.6756,
    lng: 33.0431,
    address: 'ул. Ленина 123',
  },
  operatingHours: [],
};

const result = await VenuesAPI.createVenue(request);
console.log('Created venue:', result.venue);
```

### Получение списка площадок

#### Было:
```typescript
import { fetchVenues } from '@/lib/api/venues';

const venues = await fetchVenues();
```

#### Стало:
```typescript
import { VenuesAPI } from '@/lib/api-client';
import type { GetVenuesRequest } from '@/contracts';

const params: GetVenuesRequest = {
  page: 1,
  limit: 10,
  type: 'distribution_hub',
  status: 'active',
};

const result = await VenuesAPI.getVenues(params);
console.log('Venues:', result.items);
console.log('Pagination:', result.pagination);
```

### Отклик волонтера

#### Было:
```typescript
const response = await fetch('/api/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    venueId,
    functionId,
    categoryId,
    quantityOffered: 50,
    message: 'У меня есть 50 упаковок',
  }),
});
```

#### Стало:
```typescript
import { ResponsesAPI } from '@/lib/api-client';
import type { CreateVolunteerResponseRequest } from '@/contracts';

const request: CreateVolunteerResponseRequest = {
  venueId,
  functionId,
  responseType: 'item',
  categoryId,
  quantityOffered: 50,
  message: 'У меня есть 50 упаковок',
};

const result = await ResponsesAPI.createResponse(request);
console.log('Response created:', result.response);
```

## 🔧 Обновление компонентов

### Простой компонент со списком

```typescript
'use client';

import { useVenues } from '@/hooks/use-api';
import { Spinner } from '@/components/ui/spinner';

export function VenuesList() {
  const { venues, loading, error } = useVenues({ 
    page: 1, 
    limit: 10 
  });

  if (loading) return <Spinner />;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {venues.map(venue => (
        <div key={venue.id}>
          <h3>{venue.title}</h3>
          <p>{venue.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Компонент с формой

```typescript
'use client';

import { useState } from 'react';
import { VenuesAPI } from '@/lib/api-client';
import { useMutation } from '@/hooks/use-api';
import type { CreateVenueRequest } from '@/contracts';

export function CreateVenueForm() {
  const { mutate, loading, error } = useMutation<CreateVenueRequest, any>();
  const [formData, setFormData] = useState<CreateVenueRequest>({
    title: '',
    description: '',
    type: 'distribution_hub',
    location: { lat: 0, lng: 0, address: '' },
    operatingHours: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await mutate(
      VenuesAPI.createVenue,
      formData
    );
    
    if (result) {
      console.log('Venue created:', result);
      // Redirect or update UI
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Создание...' : 'Создать площадку'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

## 🎯 Ключевые преимущества

### 1. Типобезопасность

```typescript
// ❌ Старое: ошибки только в рантайме
const data = { title: 123 }; // Неверный тип
await createVenue(data); // Ошибка только при выполнении

// ✅ Новое: ошибки на этапе компиляции
const data: CreateVenueRequest = { 
  title: 123 // TypeScript Error: Type 'number' is not assignable to type 'string'
};
```

### 2. Единый формат ответов

```typescript
// Все ответы имеют единый формат
type ApiResponse<T> = 
  | { success: true; data: T; timestamp: string }
  | { success: false; error: {...}; timestamp: string }

// Проверка типа на уровне компиляции
if (isSuccessResponse(response)) {
  console.log(response.data); // TypeScript знает точный тип
}
```

### 3. Централизованная обработка ошибок

```typescript
// Автоматическая обработка ошибок авторизации
const apiClient = new ApiClient({
  baseUrl: '/api',
  getToken: () => localStorage.getItem('token'),
  onError: (error) => {
    if (error.error.code === 'UNAUTHORIZED') {
      // Автоматический редирект на /login
      window.location.href = '/login';
    }
  },
});
```

### 4. Mock режим для разработки

```typescript
// .env.local
NEXT_PUBLIC_USE_MOCK=true

// Все API вызовы автоматически используют моковые данные
const venues = await VenuesAPI.getVenues(); // Возвращает mock данные
```

## 📚 Полная документация

Полная документация доступна в файле [contracts/CONTRACTS.md](/contracts/CONTRACTS.md)

## 🗺️ План миграции проекта

### Фаза 1: Подготовка ✅
- [x] Создать контракты
- [x] Создать API client
- [x] Создать React hooks
- [x] Написать документацию

### Фаза 2: Миграция компонентов 🔄
- [ ] Обновить компоненты аутентификации
- [ ] Обновить компоненты площадок
- [ ] Обновить профили пользователей
- [ ] Обновить формы создания/редактирования

### Фаза 3: Очистка 📦
- [ ] Удалить старые файлы:
  - `types/api-contracts.ts`
  - `lib/api.ts` (старая версия)
  - `lib/auth.ts` (старая версия)
- [ ] Обновить все импорты
- [ ] Проверить и удалить неиспользуемые зависимости

### Фаза 4: Тестирование ✅
- [ ] Проверить все API вызовы
- [ ] Проверить обработку ошибок
- [ ] Проверить типобезопасность
- [ ] Протестировать в production режиме

## 💡 Советы по миграции

### 1. Миграция по модулям
Мигрируйте один модуль за раз:
- День 1: Аутентификация
- День 2: Площадки
- День 3: Функции площадок
- День 4: Отклики и обязательства

### 2. Используйте поиск и замену
```bash
# Найти все импорты из старых файлов
grep -r "from '@/types/api-contracts'" .

# Найти все вызовы старого API
grep -r "apiRequest" .
```

### 3. Проверяйте типы
```bash
# Проверить типы после миграции
npm run type-check
```

### 4. Тестируйте постепенно
Не мигрируйте все сразу. Старый и новый код могут работать параллельно.

## 🆘 Частые проблемы

### Проблема 1: Импорты не находятся

**Решение:**
```typescript
// Проверьте алиасы в tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Проблема 2: Типы не совпадают

**Решение:**
```typescript
// Используйте type assertion только если уверены
const venue = oldVenue as Venue;

// Или создайте функцию-адаптер
function adaptOldVenue(old: OldVenue): Venue {
  return {
    ...old,
    // преобразования
  };
}
```

### Проблема 3: Mock режим не работает

**Решение:**
```bash
# Проверьте переменную окружения
echo $NEXT_PUBLIC_USE_MOCK

# Перезапустите dev сервер
npm run dev
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте [документацию](/contracts/CONTRACTS.md)
2. Посмотрите [примеры](/contracts/examples.ts)
3. Проверьте типы: `npm run type-check`

---

**Успешной миграции! 🚀**


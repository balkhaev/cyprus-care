# API Контракты и Клиент - Краткое Руководство

## 🎯 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_USE_MOCK=true  # для разработки без бэкенда
```

### 3. Базовый пример

```typescript
import { VenuesAPI } from '@/lib/api-client';

// Получить список площадок
const result = await VenuesAPI.getVenues({ page: 1, limit: 10 });
console.log('Venues:', result.items);
```

## 📚 Документация

- **[CONTRACTS.md](/contracts/CONTRACTS.md)** - Полная документация контрактов (150+ страниц)
- **[MIGRATION.md](/MIGRATION.md)** - Руководство по миграции со старого API
- **[contracts/README.md](/contracts/README.md)** - Краткое описание контрактов

## 🗂️ Структура проекта

```
care/
├── contracts/              # API контракты (типы)
│   ├── common.ts          # Базовые типы
│   ├── auth.ts            # Аутентификация
│   ├── venue.ts           # Площадки
│   ├── venue-function.ts  # Функции площадок
│   ├── response.ts        # Отклики/обязательства
│   ├── item-category.ts   # Категории предметов
│   ├── utils.ts           # Утилиты для работы с API
│   └── examples.ts        # Примеры использования
├── lib/
│   └── api-client.ts      # API клиент (использует контракты)
├── hooks/
│   └── use-api.ts         # React hooks для API
└── MIGRATION.md           # Руководство по миграции
```

## 🔧 Основные API

### Аутентификация

```typescript
import { AuthAPI, useAuth } from '@/lib/api-client';

// Вход
const { user, accessToken } = await AuthAPI.login({
  email: 'user@example.com',
  password: 'password123',
});

// Или с хуком
const { user, login, logout } = useAuth();
await login('user@example.com', 'password123');
```

### Площадки

```typescript
import { VenuesAPI, useVenues } from '@/lib/api-client';

// Получить список
const { items, pagination } = await VenuesAPI.getVenues({
  page: 1,
  limit: 10,
  type: 'distribution_hub',
});

// Или с хуком
const { venues, loading, error } = useVenues({ page: 1, limit: 10 });
```

### Отклики волонтера

```typescript
import { ResponsesAPI } from '@/lib/api-client';

const { response } = await ResponsesAPI.createResponse({
  venueId: 'venue-123',
  functionId: 'function-456',
  responseType: 'item',
  categoryId: 'medicine-uuid',
  quantityOffered: 50,
  message: 'У меня есть 50 упаковок',
});
```

## 🎨 React Hooks

### useVenues - Список площадок

```typescript
import { useVenues } from '@/hooks/use-api';

function VenuesList() {
  const { venues, loading, error, pagination } = useVenues({
    page: 1,
    limit: 10,
  });

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {venues.map(venue => (
        <div key={venue.id}>{venue.title}</div>
      ))}
    </div>
  );
}
```

### useAuth - Аутентификация

```typescript
import { useAuth } from '@/hooks/use-api';

function LoginForm() {
  const { user, login, logout, loading } = useAuth();

  if (user) {
    return (
      <div>
        <p>Привет, {user.name}!</p>
        <button onClick={logout}>Выйти</button>
      </div>
    );
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      login(email, password);
    }}>
      {/* форма входа */}
    </form>
  );
}
```

### useMutation - Создание/обновление

```typescript
import { useMutation } from '@/hooks/use-api';
import { VenuesAPI } from '@/lib/api-client';

function CreateVenueForm() {
  const { mutate, loading, error } = useMutation();

  const handleSubmit = async (data) => {
    const result = await mutate(VenuesAPI.createVenue, data);
    if (result) {
      console.log('Venue created:', result.venue);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* поля формы */}
      <button type="submit" disabled={loading}>
        {loading ? 'Создание...' : 'Создать'}
      </button>
      {error && <div>{error.message}</div>}
    </form>
  );
}
```

## 🧪 Mock режим

Для разработки без бэкенда используйте mock режим:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true
```

Все API вызовы будут возвращать моковые данные из `lib/mock-data/`.

## ✅ Проверка типов

```bash
# Проверить типы один раз
npm run type-check

# Проверять типы при каждом изменении
npm run type-check:watch
```

## 📋 Чеклист миграции

### Этап 1: Подготовка ✅
- [x] Создать контракты
- [x] Создать API client
- [x] Создать React hooks
- [x] Написать документацию

### Этап 2: Миграция (в процессе)
- [ ] Обновить компоненты аутентификации
- [ ] Обновить компоненты площадок
- [ ] Обновить профили пользователей
- [ ] Обновить формы

### Этап 3: Очистка
- [ ] Удалить старые файлы (`types/api-contracts.ts`, `lib/api.ts`)
- [ ] Проверить все импорты
- [ ] Удалить неиспользуемый код

## 🔗 Ссылки

- [Полная документация контрактов](./contracts/CONTRACTS.md)
- [Руководство по миграции](./MIGRATION.md)
- [Примеры использования](./contracts/examples.ts)

## 💡 Советы

1. **Используйте TypeScript** - все контракты имеют строгую типизацию
2. **Используйте хуки** - `useVenues`, `useAuth`, `useMutation` и т.д.
3. **Проверяйте типы** - запускайте `npm run type-check` перед коммитом
4. **Mock режим** - разрабатывайте без бэкенда, включив `NEXT_PUBLIC_USE_MOCK=true`

## 🆘 Проблемы?

1. Проверьте [MIGRATION.md](./MIGRATION.md) для частых проблем
2. Посмотрите [примеры](./contracts/examples.ts)
3. Проверьте типы: `npm run type-check`

---

**Happy coding! 🚀**


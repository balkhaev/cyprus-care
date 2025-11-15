# Mediterranean Relief UI - Quick Start Guide

## 🚀 Быстрый старт для разработчиков

### 1. Импортируйте готовые компоненты

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
```

### 2. Используйте готовые классы

```tsx
import { quickClasses } from '@/lib/ui-builder';

// Hero section
<div className={quickClasses.hero}>
  <h1 className={quickClasses.heroTitle}>Заголовок</h1>
  <p className={quickClasses.heroDescription}>Описание</p>
</div>

// Grid layouts
<div className={quickClasses.grid3}>
  {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
</div>
```

### 3. Готовые паттерны кнопок

```tsx
// Primary action (оранжевая - срочность)
<Button size="lg">Хочу помочь</Button>

// Secondary action (синяя - доверие)
<Button size="lg" variant="secondary">
  Подробнее
</Button>

// Accent (зеленая - надежда)
<Button variant="accent">Завершено</Button>

// Destructive (красная - срочно)
<Button variant="destructive">Отменить помощь</Button>

// Outline
<Button variant="outline">Отмена</Button>
```

### 4. Карточки информации

```tsx
<Card>
  <CardHeader>
    {/* Иконка в цветном боксе */}
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
      <Heart className="h-6 w-6 text-primary" />
    </div>
    <CardTitle>Заголовок карточки</CardTitle>
    <CardDescription>Описание</CardDescription>
  </CardHeader>
  <CardContent>Дополнительный контент</CardContent>
</Card>
```

### 5. Формы (elderly-friendly)

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Имя и фамилия</Label>
    <Input
      id="name"
      placeholder="Введите ваше имя"
      className="text-lg" // Увеличенный шрифт для пожилых
    />
  </div>

  <Button size="lg" className="w-full">
    Отправить
  </Button>
</form>
```

### 6. Алерты и оповещения

```tsx
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Предупреждение (оранжевое)
<Alert variant="warning">
  <AlertCircle className="h-5 w-5" />
  <AlertTitle>Внимание</AlertTitle>
  <AlertDescription>
    В регионе объявлена повышенная пожарная опасность
  </AlertDescription>
</Alert>

// Успех (зеленое)
<Alert variant="success">
  <CheckCircle className="h-5 w-5" />
  <AlertTitle>Спасибо!</AlertTitle>
  <AlertDescription>
    Ваша заявка принята
  </AlertDescription>
</Alert>

// Ошибка (красное)
<Alert variant="destructive">
  <AlertCircle className="h-5 w-5" />
  <AlertTitle>Ошибка</AlertTitle>
  <AlertDescription>
    Не удалось отправить данные
  </AlertDescription>
</Alert>
```

### 7. Badges

```tsx
<Badge>По умолчанию</Badge>
<Badge variant="secondary">Вторичный</Badge>
<Badge variant="accent">Успех</Badge>
<Badge variant="destructive">Срочно</Badge>
<Badge variant="outline">Обводка</Badge>
```

### 8. Grid Layouts

```tsx
// 2 колонки
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>...</Card>
  <Card>...</Card>
</div>

// 3 колонки
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// 4 колонки (для статистики)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### 9. Icon Boxes

```tsx
// Primary (оранжевый)
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
  <Heart className="h-6 w-6 text-primary" />
</div>

// Secondary (синий)
<div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
  <MapPin className="h-6 w-6 text-secondary" />
</div>

// Accent (зеленый)
<div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
  <CheckCircle className="h-6 w-6 text-accent" />
</div>
```

### 10. Карты

```tsx
import { mapMarkerColors, createCustomMarker, mapTheme } from "@/lib/map-theme"

// Оранжевые маркеры для пунктов сбора
const collectionMarker = createCustomMarker("collection")

// Синие маркеры для пунктов распределения
const distributionMarker = createCustomMarker("distribution")

// Зеленые маркеры для сервисов
const serviceMarker = createCustomMarker("service")

// Красные маркеры для экстренных случаев
const emergencyMarker = createCustomMarker("emergency")
```

## 🎨 Цветовые токены

### Tailwind классы

```tsx
// Backgrounds
className = "bg-primary" // Оранжевый
className = "bg-secondary" // Синий
className = "bg-accent" // Зеленый
className = "bg-destructive" // Красный
className = "bg-background" // Теплый белый

// Text colors
className = "text-primary"
className = "text-secondary"
className = "text-accent"
className = "text-destructive"

// Borders
className = "border-primary"
className = "border-secondary"
className = "border-accent"
className = "border-destructive"
```

## 📏 Размеры

### Кнопки

```tsx
<Button size="sm">Small</Button>        // h-10 (40px)
<Button size="default">Default</Button> // h-12 (48px)
<Button size="lg">Large</Button>        // h-16 (64px)
<Button size="xl">Extra Large</Button>  // h-20 (80px)
```

### Шрифты

```tsx
className = "text-base" // 16px - минимум для accessibility
className = "text-lg" // 18px - рекомендуется для пожилых
className = "text-xl" // 20px - кнопки, важный текст
className = "text-2xl" // 24px - h3
className = "text-3xl" // 30px - h2
className = "text-4xl" // 36px - h1
```

## ✅ Checklist для новой страницы

- [ ] Используется шрифт Inter (автоматически из layout.tsx)
- [ ] Минимальный размер шрифта 16px (text-base)
- [ ] Кнопки размером минимум h-12 (48px)
- [ ] Видимые focus states на интерактивных элементах
- [ ] Высокий контраст текста (text-foreground на bg-background)
- [ ] Округлые углы (rounded-xl для кнопок/инпутов, rounded-2xl для карточек)
- [ ] Тени на карточках (shadow-lg)
- [ ] Hover эффекты на интерактивных элементах
- [ ] Responsive grid layouts (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- [ ] Увеличенные отступы (p-6) для карточек

## 🚫 Чего избегать

❌ Маленькие кнопки (< 44px)  
❌ Мелкий текст (< 16px) для основного контента  
❌ Низкий контраст цветов  
❌ Слишком близкие интерактивные элементы  
❌ Отсутствие focus states  
❌ Темные цвета на темном фоне  
❌ Светлые цвета на светлом фоне

## 💡 Pro Tips

1. **Для пожилых пользователей**

   - Используйте text-lg вместо text-base
   - Кнопки size="lg" или size="xl"
   - Увеличенные отступы между элементами

2. **Для мобильных устройств**

   - Минимум 48x48px для touch targets
   - Используйте w-full для кнопок на мобилках
   - Grid: grid-cols-1 на мобилках

3. **Для доступности**

   - Всегда используйте Label с Input
   - aria-label для иконочных кнопок
   - Видимый focus (outline-2 outline-primary)

4. **Для производительности**
   - Используйте готовые компоненты из /components/ui
   - Не создавайте inline styles
   - Используйте Tailwind классы

## 📚 Ссылки

- Полная документация: [THEME.md](../THEME.md)
- Демо: `/theme-demo`
- UI Builder: `/lib/ui-builder.ts`
- Tailwind Config: `/lib/tailwind-config.ts`
- Map Theme: `/lib/map-theme.ts`

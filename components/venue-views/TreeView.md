# TreeView Component

Компонент для отображения древовидной структуры элементов в Collection Point.

## Описание

`TreeView` преобразует плоский список элементов с `categoryPath` (например, `['Medicine', 'Painkillers', 'Nurofen']`) в иерархическую древовидную структуру с возможностью раскрытия и сворачивания узлов.

## Особенности

- **Автоматическое построение дерева**: Компонент автоматически группирует элементы по их `categoryPath`
- **Интерактивность**: Каждый узел можно раскрыть/свернуть кликом
- **Кастомизируемый рендеринг**: Поддержка кастомного рендеринга листовых элементов через prop `renderItem`
- **Подсчет элементов**: Автоматический подсчет дочерних элементов для каждого узла
- **Визуальная иерархия**: Отступы и иконки для наглядного отображения уровней вложенности

## Использование

```tsx
import { TreeView } from '@/components/venue-views/TreeView';

<TreeView
  items={func.items}
  functionId={func.id}
  responses={responses.filter(r => r.responseType === 'item')}
  getNeedStatus={getNeedStatus}
  onStatusChange={(categoryId, status) => handleStatusChange(func.id, categoryId, status)}
  onToggleDetails={(key) => toggleFunction(func.id + '-' + key)}
  isDetailsExpanded={(key) => expandedFunctions.has(func.id + '-' + key)}
  renderItem={(item, level, itemResponses, currentStatus) => (
    <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg mb-2">
      {/* Кастомный рендеринг элемента */}
    </div>
  )}
/>
```

## Props

### TreeView

| Prop | Тип | Описание |
|------|-----|----------|
| `items` | `ItemWithQuantity[]` | Массив элементов для отображения |
| `functionId` | `string` | ID функции venue |
| `responses` | `VolunteerResponse[]` | Ответы волонтеров |
| `getNeedStatus` | `(functionId: string, categoryId: string) => { status: NeedStatus } \| undefined` | Функция получения статуса потребности |
| `onStatusChange` | `(categoryId: string, status: NeedStatus) => void` | Callback при изменении статуса |
| `onToggleDetails` | `(key: string) => void` | Callback при раскрытии/сворачивании деталей |
| `isDetailsExpanded` | `(key: string) => boolean` | Функция проверки раскрытия деталей |
| `renderItem` | `(item, level, responses, currentStatus) => React.ReactNode` | Функция рендеринга листового элемента |

## Структура данных

Компонент ожидает элементы в формате:

```typescript
interface ItemWithQuantity {
  categoryId: string;
  categoryPath: string[]; // ['Medicine', 'Painkillers', 'Nurofen']
  quantity: QuantityLevel;
}
```

Из `categoryPath` автоматически строится дерево:

```
Medicine (3)
  ├─ Painkillers (2)
  │   ├─ Nurofen
  │   └─ Aspirin
  └─ Antibiotics (1)
      └─ Amoxicillin
```

## Примеры

### Простое использование

```tsx
const items = [
  { categoryId: '1', categoryPath: ['Food', 'Fruits', 'Apple'], quantity: 'a_lot' },
  { categoryId: '2', categoryPath: ['Food', 'Fruits', 'Banana'], quantity: 'some' },
  { categoryId: '3', categoryPath: ['Food', 'Vegetables', 'Carrot'], quantity: 'few' }
];

<TreeView
  items={items}
  functionId="func-1"
  responses={[]}
  getNeedStatus={() => undefined}
  onStatusChange={() => {}}
  onToggleDetails={() => {}}
  isDetailsExpanded={() => false}
  renderItem={(item) => <div>{item.categoryPath[item.categoryPath.length - 1]}</div>}
/>
```

### С кастомным рендерингом

```tsx
<TreeView
  items={items}
  functionId="func-1"
  responses={responses}
  getNeedStatus={getNeedStatus}
  onStatusChange={handleStatusChange}
  onToggleDetails={toggleDetails}
  isDetailsExpanded={isExpanded}
  renderItem={(item, level, itemResponses, currentStatus) => {
    const relevantResponses = itemResponses.filter(r => r.categoryId === item.categoryId);
    
    return (
      <div className="p-3 bg-zinc-50 rounded-lg">
        <h4>{item.categoryPath[item.categoryPath.length - 1]}</h4>
        <p>Quantity: {item.quantity}</p>
        <p>Responses: {relevantResponses.length}</p>
        {currentStatus && <Badge>{currentStatus.status}</Badge>}
      </div>
    );
  }}
/>
```

## Стилизация

Компонент использует Tailwind CSS классы для стилизации. Основные классы:

- Отступы для уровней: `pl-0`, `pl-4`, `pl-8`, `pl-12` и т.д.
- Hover эффекты: `hover:bg-zinc-100 dark:hover:bg-zinc-800`
- Цвета иконок: `text-zinc-500 dark:text-zinc-400`

## Интеграция

Компонент интегрирован в `OrganizerVenueView.tsx` для отображения элементов Collection Point в древовидной структуре вместо плоского списка.

### До (плоский список):

```
Medicine → Painkillers → Nurofen
Medicine → Painkillers → Aspirin  
Medicine → Antibiotics → Amoxicillin
```

### После (дерево):

```
▼ Medicine (3)
  ▼ Painkillers (2)
    • Nurofen
    • Aspirin
  ▶ Antibiotics (1)
```

## Производительность

- Построение дерева выполняется при каждом рендере, но для типичных объемов данных (до 100-200 элементов) это не создает проблем
- Для оптимизации больших деревьев можно добавить `useMemo` для функции `buildTree`
- Состояние раскрытия/сворачивания управляется локально для каждого узла

## Доступность

- Интерактивные элементы имеют cursor:pointer
- Визуальная обратная связь при hover
- Иконки раскрытия/сворачивания для индикации состояния


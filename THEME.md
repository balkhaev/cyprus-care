# Mediterranean Relief UI Theme

## 🎨 Description

**Mediterranean Relief UI** is a design system for the Cyprus Care platform, specifically developed for coordinating relief efforts during crisis situations (fires, emergencies).

### Philosophy

The theme combines:
- **Urgency** (orange) - fire, need to act
- **Trust** (blue) - calm, reliability
- **Hope** (green) - nature, recovery

## 🎯 Target Audience

- All age groups
- Special focus on elderly users
- Maximum accessibility
- Ease of use in stressful situations

## 🎨 Color Palette

### Primary: Deep Orange (#E36414)
- **Usage**: Primary actions, urgency indicators
- **Symbolism**: Fire, Cypriot sunsets, need to act
- **Accessibility**: WCAG AA compliant

### Secondary: Safe Blue (#1E88E5)
- **Usage**: Secondary actions, elements of trust
- **Symbolism**: Water, calm, Mediterranean Sea
- **Accessibility**: WCAG AA compliant

### Accent: Olive Green (#4CAF50)
- **Usage**: Successful actions, states of hope
- **Symbolism**: Nature, Cypriot olive groves, recovery
- **Accessibility**: WCAG AA compliant

### Destructive: Fire Red (#D32F2F)
- **Usage**: Errors, urgent warnings
- **Symbolism**: Danger, need for immediate attention
- **Accessibility**: WCAG AA compliant

### Background: Soft Warm White (#F9F5F1)
- **Usage**: Page backgrounds
- **Symbolism**: Warmth, friendliness, calm
- **Advantages**: Reduces eye strain, especially for elderly users

## 📝 Typography

### Font: Inter
- **Weights**: Regular (400), Semibold (600)
- **Languages**: Latin, Latin Extended, Cyrillic
- **Why Inter?**
  - Excellent readability on all devices
  - Modern, professional appearance
  - Scales well
  - Available in Google Fonts

### Sizes
- **Base**: 16px (minimum for accessibility)
- **Increased**: 18px (for elderly users)
- **Buttons**: 16-20px (large and readable)
- **Headings**: 24px - 48px (h3 - h1)

### Line Height
- Increased line spacing (leading-relaxed)
- Improves readability for all ages

## 🎛️ Components

### Buttons
```tsx
<Button size="lg">I Want to Help</Button>
<Button variant="secondary">Learn More</Button>
<Button variant="outline">Cancel</Button>
```

**Characteristics:**
- Large sizes (h-12, h-16, h-20)
- Rounded corners (rounded-xl)
- Clear shadows (shadow-md, shadow-lg)
- Press animation (active:scale-95)
- Minimum 44x44px for touch targets

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Characteristics:**
- Rounded corners (rounded-2xl)
- White background with light orange border
- Large padding (p-6)
- Shadows (shadow-lg)
- Hover effect (shadow-xl)

### Inputs
```tsx
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter name" />
</div>
```

**Characteristics:**
- Large height (h-12)
- Rounded corners (rounded-xl)
- Double border (border-2)
- Clear focus (ring-2 ring-primary)
- Convenient for elderly users

### Alerts
```tsx
<Alert variant="warning">
  <AlertCircle className="h-5 w-5" />
  <AlertTitle>Attention</AlertTitle>
  <AlertDescription>Important information</AlertDescription>
</Alert>
```

**Variants:**
- `default` - general information
- `warning` - warning (orange)
- `destructive` - error (red)
- `success` - success (green)

### Badges
```tsx
<Badge>Active</Badge>
<Badge variant="destructive">Urgent</Badge>
<Badge variant="accent">Completed</Badge>
```

## 🗺️ Map Styles

### Markers
- **Orange**: Collection points
- **Blue**: Distribution points
- **Green**: Aid services
- **Red**: Emergency assistance

### Implementation
```ts
import { mapMarkerColors, createCustomMarker } from '@/lib/map-theme';

const marker = createCustomMarker('collection'); // orange marker
```

## ♿ Accessibility

### Contrast
- All color combinations comply with WCAG AA
- High contrast for elderly users

### Focus
- Visible focus rings (outline-2, outline-primary)
- Offset from element (outline-offset-2)
- On all interactive elements

### Touch Targets
- Minimum 44x44px for all buttons
- Large hit areas
- Convenient for fingers of any size

### Typography
- Minimum font size 16px
- Increased line spacing
- Clear heading hierarchy

## 🎭 Emotional Tone

1. **Calm and Help** (blue, white)
   - Reduce panic
   - Instill trust

2. **Urgency and Action** (orange)
   - Motivate to act
   - Show importance

3. **Nature and Recovery** (green)
   - Give hope
   - Symbolize the future

## 📱 Responsive Design

### Mobile First
- All components optimized for mobile
- Large touch targets
- Convenient one-hand navigation

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎬 Demo

Visit `/theme-demo` to see all components in action.

## 📊 Advantages for Hackathon

### For Judges
1. **Professionalism**: Looks like a finished product
2. **Uniqueness**: Mediterranean palette stands out
3. **Thoughtfulness**: Every color has meaning
4. **Accessibility**: Shows care for users

### Narrative
> "We developed Cyprus Care with a focus on accessibility and elderly users.
> The Mediterranean Relief UI theme uses large buttons, high contrast,
> warm calming colors and simple information architecture.
> In a crisis situation, simplicity saves lives."

## 🚀 Usage

### Import Components
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
```

### Use Tailwind Colors
```tsx
className="bg-primary text-primary-foreground"
className="bg-secondary text-secondary-foreground"
className="bg-accent text-accent-foreground"
className="bg-destructive text-white"
```

### Use Utilities
```tsx
className="rounded-xl shadow-lg p-6"
className="text-lg leading-relaxed"
```

## 📚 Additional Resources

- `/lib/theme-guide.ts` - Complete theme guide
- `/lib/map-theme.ts` - Map configuration
- `/app/theme-demo/page.tsx` - Component demonstration
- `/app/globals.css` - Theme CSS variables

---

**Cyprus Care** - help at the right time, in the right place 🇨🇾

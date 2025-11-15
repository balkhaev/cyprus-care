# Mediterranean Relief UI - Quick Start Guide

## 🚀 Quick Start for Developers

### 1. Import Ready-Made Components

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
```

### 2. Use Ready-Made Classes

```tsx
import { quickClasses } from '@/lib/ui-builder';

// Hero section
<div className={quickClasses.hero}>
  <h1 className={quickClasses.heroTitle}>Heading</h1>
  <p className={quickClasses.heroDescription}>Description</p>
</div>

// Grid layouts
<div className={quickClasses.grid3}>
  {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
</div>
```

### 3. Ready Button Patterns

```tsx
// Primary action (orange - urgency)
<Button size="lg">I Want to Help</Button>

// Secondary action (blue - trust)
<Button size="lg" variant="secondary">
  Learn More
</Button>

// Accent (green - hope)
<Button variant="accent">Completed</Button>

// Destructive (red - urgent)
<Button variant="destructive">Cancel Help</Button>

// Outline
<Button variant="outline">Cancel</Button>
```

### 4. Information Cards

```tsx
<Card>
  <CardHeader>
    {/* Icon in colored box */}
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
      <Heart className="h-6 w-6 text-primary" />
    </div>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Additional content</CardContent>
</Card>
```

### 5. Forms (elderly-friendly)

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Full Name</Label>
    <Input
      id="name"
      placeholder="Enter your name"
      className="text-lg" // Increased font size for elderly
    />
  </div>

  <Button size="lg" className="w-full">
    Submit
  </Button>
</form>
```

### 6. Alerts and Notifications

```tsx
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Warning (orange)
<Alert variant="warning">
  <AlertCircle className="h-5 w-5" />
  <AlertTitle>Attention</AlertTitle>
  <AlertDescription>
    High fire danger declared in the region
  </AlertDescription>
</Alert>

// Success (green)
<Alert variant="success">
  <CheckCircle className="h-5 w-5" />
  <AlertTitle>Thank You!</AlertTitle>
  <AlertDescription>
    Your application has been received
  </AlertDescription>
</Alert>

// Error (red)
<Alert variant="destructive">
  <AlertCircle className="h-5 w-5" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to send data
  </AlertDescription>
</Alert>
```

### 7. Badges

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="accent">Success</Badge>
<Badge variant="destructive">Urgent</Badge>
<Badge variant="outline">Outline</Badge>
```

### 8. Grid Layouts

```tsx
// 2 columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>...</Card>
  <Card>...</Card>
</div>

// 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// 4 columns (for statistics)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### 9. Icon Boxes

```tsx
// Primary (orange)
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
  <Heart className="h-6 w-6 text-primary" />
</div>

// Secondary (blue)
<div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
  <MapPin className="h-6 w-6 text-secondary" />
</div>

// Accent (green)
<div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
  <CheckCircle className="h-6 w-6 text-accent" />
</div>
```

### 10. Maps

```tsx
import { mapMarkerColors, createCustomMarker, mapTheme } from "@/lib/map-theme"

// Orange markers for collection points
const collectionMarker = createCustomMarker("collection")

// Blue markers for distribution points
const distributionMarker = createCustomMarker("distribution")

// Green markers for services
const serviceMarker = createCustomMarker("service")

// Red markers for emergencies
const emergencyMarker = createCustomMarker("emergency")
```

## 🎨 Color Tokens

### Tailwind Classes

```tsx
// Backgrounds
className = "bg-primary" // Orange
className = "bg-secondary" // Blue
className = "bg-accent" // Green
className = "bg-destructive" // Red
className = "bg-background" // Warm white

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

## 📏 Sizes

### Buttons

```tsx
<Button size="sm">Small</Button>        // h-10 (40px)
<Button size="default">Default</Button> // h-12 (48px)
<Button size="lg">Large</Button>        // h-16 (64px)
<Button size="xl">Extra Large</Button>  // h-20 (80px)
```

### Fonts

```tsx
className = "text-base" // 16px - minimum for accessibility
className = "text-lg" // 18px - recommended for elderly
className = "text-xl" // 20px - buttons, important text
className = "text-2xl" // 24px - h3
className = "text-3xl" // 30px - h2
className = "text-4xl" // 36px - h1
```

## ✅ Checklist for New Page

- [ ] Uses Inter font (automatically from layout.tsx)
- [ ] Minimum font size 16px (text-base)
- [ ] Buttons minimum h-12 (48px)
- [ ] Visible focus states on interactive elements
- [ ] High contrast text (text-foreground on bg-background)
- [ ] Rounded corners (rounded-xl for buttons/inputs, rounded-2xl for cards)
- [ ] Shadows on cards (shadow-lg)
- [ ] Hover effects on interactive elements
- [ ] Responsive grid layouts (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- [ ] Increased padding (p-6) for cards

## 🚫 What to Avoid

❌ Small buttons (< 44px)  
❌ Small text (< 16px) for main content  
❌ Low color contrast  
❌ Too close interactive elements  
❌ Absence of focus states  
❌ Dark colors on dark background  
❌ Light colors on light background

## 💡 Pro Tips

1. **For Elderly Users**

   - Use text-lg instead of text-base
   - Buttons size="lg" or size="xl"
   - Increased spacing between elements

2. **For Mobile Devices**

   - Minimum 48x48px for touch targets
   - Use w-full for buttons on mobile
   - Grid: grid-cols-1 on mobile

3. **For Accessibility**

   - Always use Label with Input
   - aria-label for icon buttons
   - Visible focus (outline-2 outline-primary)

4. **For Performance**
   - Use ready-made components from /components/ui
   - Don't create inline styles
   - Use Tailwind classes

## 📚 Links

- Full documentation: [THEME.md](../THEME.md)
- Demo: `/theme-demo`
- UI Builder: `/lib/ui-builder.ts`
- Tailwind Config: `/lib/tailwind-config.ts`
- Map Theme: `/lib/map-theme.ts`

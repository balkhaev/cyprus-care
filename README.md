# Cyprus Care 🇨🇾

**Crisis Relief Coordination Platform**

A web application for coordinating volunteers and assistance during emergencies in Cyprus (fires, natural disasters, elderly care).

## 🎨 Mediterranean Relief UI

The project uses a specially designed **Mediterranean Relief UI** design system - a warm, trustworthy, and accessible theme inspired by the Cypriot Mediterranean.

### Color Palette

- 🧡 **Deep Orange** (#d77040) - urgency, fire, Cypriot sunsets (less saturated)
- 💙 **Safe Blue** (#4a8fc9) - trust, calm, sea (softer tone)
- 💚 **Olive Green** (#65b365) - hope, nature, recovery (muted)
- ❤️ **Fire Red** (#c95555) - urgent alerts (less intense)

### UI Features

- ✅ Large buttons and inputs (convenient for elderly users)
- ✅ High contrast (WCAG AA compliant)
- ✅ Inter font (excellent readability)
- ✅ Increased touch targets (44x44px+)
- ✅ Clear focus states for accessibility

**📖 Complete Guide**: see [THEME.md](./THEME.md)  
**🎨 Theme Demo**: run the project and open `/theme-demo`

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Backend API URL - set to your Django backend URL
# Default: http://localhost:8000 (for local Django development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Debug Panel - set to 'true' to enable debug menu (for development)
NEXT_PUBLIC_SHOW_DEBUG_PANEL=false
```

**Note**: If `NEXT_PUBLIC_API_URL` is not set, it defaults to `http://localhost:8000`. Make sure your Django backend is running on this port, or update the URL accordingly.

### Run in Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Theme Demo

After starting, visit:

- [http://localhost:3000/theme-demo](http://localhost:3000/theme-demo) - demonstration of all UI components

## 📁 Project Structure

```
care/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── map/               # Relief map
│   ├── venues/            # Collection/distribution points
│   ├── organizer/         # Organizer panel
│   └── theme-demo/        # UI theme demo
├── components/
│   ├── ui/                # UI components (Button, Card, Input, etc.)
│   ├── LeafletMap.tsx     # Map component
│   └── LocationPickerMap.tsx
├── lib/
│   ├── utils.ts           # Utilities
│   ├── theme-utils.ts     # Theme utility classes and helpers
│   ├── theme-guide.ts     # Theme guide
│   └── map-theme.ts       # Map settings
└── types/
    └── venue.ts           # TypeScript types
```

## 🎯 Key Features

- 🗺️ **Interactive map** with collection/distribution points
- 👥 **Volunteer coordination** and task distribution
- 📍 **Relief points** with detailed information
- 🔔 **Alert system** for emergencies
- ♿ **Accessibility** for all age groups

## 🎨 Using the Theme

### Importing Components

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
```

### Using Theme Utilities

The project provides ready-made utility classes through `lib/theme-utils.ts`:

```tsx
import {
  backgroundClasses,
  textClasses,
  headerClasses,
  getIconContainerClasses,
  interactiveClasses,
} from "@/lib/theme-utils"

// Use background classes
<div className={backgroundClasses.page}>...</div>

// Use text classes
<h1 className={textClasses.heading}>Title</h1>
<p className={textClasses.secondary}>Description</p>

// Create icon container with color
<div className={getIconContainerClasses('primary', 'md')}>
  <Icon />
</div>

// Add hover effects
<button className={interactiveClasses.hoverPrimary}>
  Click me
</button>
```

### Usage Examples

```tsx
// Large call-to-action button
<Button size="lg">I Want to Help</Button>

// Information card
<Card>
  <CardHeader>
    <CardTitle>Collection Point</CardTitle>
  </CardHeader>
  <CardContent>
    Address: 1 Example Street
  </CardContent>
</Card>

// Urgent alert
<Alert variant="warning">
  <AlertTitle>Attention!</AlertTitle>
  <AlertDescription>
    Fire hazard declared in the region
  </AlertDescription>
</Alert>
```

## 🐳 Docker

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

The application will be available at http://localhost:3000

### Manual Docker Image Build

```bash
# Build image
docker build -t care-app .

# Run container
docker run -p 3000:3000 care-app
```

### Production Deployment

```bash
# Build production image
docker build -t care-app:latest .

# Run in background
docker-compose up -d
```

## 🛠️ Technologies

- **Next.js 16** - React framework
- **TypeScript** - type safety
- **Tailwind CSS 4** - styling
- **Leaflet** - interactive maps
- **Lucide React** - icons
- **Inter Font** - typography

## 🎓 For the Hackathon

### Presenting the Theme to Judges

> "We developed Cyprus Care with a focus on accessibility and elderly users.
> The **Mediterranean Relief UI** theme features:
>
> - Large buttons and high contrast for elderly user convenience
> - Warm, calming colors that reduce panic in crisis situations
> - Simple and clear information architecture
>
> **In a crisis, simplicity saves lives.**"

### Unique Advantages

1. **Mediterranean palette** - stands out among competitors
2. **Accessibility first** - shows care for all users
3. **Thoughtful color semantics** - each color has meaning
4. **Production ready** - looks like a finished product

## 📄 License

Project for Cyprus Hackathon 2025

---

**Made with ❤️ for Cyprus**

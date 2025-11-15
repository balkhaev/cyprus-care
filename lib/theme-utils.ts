/**
 * Mediterranean Relief UI - Theme Utilities
 *
 * Utilities for consistent application of the Mediterranean Relief UI theme
 * throughout the application
 */

import { cn } from "./utils"

/**
 * Mediterranean Relief UI theme colors
 */
export const themeColors = {
  primary: {
    hex: "#E36414",
    name: "Deep Orange",
    usage: "Primary actions, urgency, fire",
  },
  secondary: {
    hex: "#1E88E5",
    name: "Safe Blue",
    usage: "Secondary actions, trust, calm",
  },
  accent: {
    hex: "#4CAF50",
    name: "Olive Green",
    usage: "Success, hope, recovery",
  },
  destructive: {
    hex: "#D32F2F",
    name: "Fire Red",
    usage: "Errors, urgent alerts",
  },
  background: {
    hex: "#F9F5F1",
    name: "Soft Warm White",
    usage: "Page background",
  },
} as const

/**
 * Ready-made classes for background elements with Mediterranean Relief UI theme
 */
export const backgroundClasses = {
  /** Main page background - warm white */
  page: "bg-background",

  /** Card background - pure white */
  card: "bg-card",

  /** Soft background with warm tone */
  soft: "bg-bgsoft",

  /** Gradients with theme colors */
  gradientPrimarySecondary:
    "bg-gradient-to-br from-primary/10 via-background to-secondary/10",
  gradientPrimary: "bg-gradient-to-br from-primary/5 to-secondary/5",
} as const

/**
 * Text classes with proper contrast
 */
export const textClasses = {
  /** Primary text */
  primary: "text-foreground",

  /** Secondary text */
  secondary: "text-muted-foreground",

  /** Accent text (orange) */
  accent: "text-primary",

  /** Blue text */
  blue: "text-secondary",

  /** Green text */
  green: "text-accent",

  /** Headings */
  heading: "text-foreground font-semibold tracking-tight",
} as const

/**
 * Border classes for elements
 */
export const borderClasses = {
  /** Base border */
  default: "border-border",

  /** Border with orange tint (for cards) */
  card: "border border-orange-100/50",

  /** Border on hover */
  hoverPrimary: "hover:border-primary",

  /** Border on hover (blue) */
  hoverSecondary: "hover:border-secondary",

  /** Border on hover (green) */
  hoverAccent: "hover:border-accent",
} as const

/**
 * Interactive state classes
 */
export const interactiveClasses = {
  /** Hover with orange background */
  hoverPrimary: "hover:bg-primary/10 hover:text-primary transition-colors",

  /** Hover with blue background */
  hoverSecondary:
    "hover:bg-secondary/10 hover:text-secondary transition-colors",

  /** Hover with green background */
  hoverAccent: "hover:bg-accent/10 hover:text-accent transition-colors",

  /** Hover for cards */
  hoverCard: "hover:shadow-xl transition-shadow",

  /** Focus state for accessibility */
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
} as const

/**
 * Icon container classes with colored backgrounds
 */
export const iconContainerClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const

/**
 * Ready-made combinations for header/navbar
 */
export const headerClasses = {
  container: "bg-card/95 backdrop-blur-sm border-b border-border shadow-sm",
  title: cn(textClasses.heading, "text-xl"),
  link: "text-muted-foreground hover:text-primary transition-colors",
  linkActive: "text-primary font-semibold",
} as const

/**
 * Ready-made combinations for cards
 */
export const cardClasses = {
  /** Base card with shadow and border */
  base: "bg-card rounded-2xl shadow-lg border border-orange-100/50 hover:shadow-xl transition-shadow",

  /** Card without hover effect */
  static: "bg-card rounded-2xl shadow-lg border border-orange-100/50",

  /** Internal padding */
  padding: "p-6",

  /** Card header */
  header: "flex flex-col space-y-1.5 p-6",

  /** Card content */
  content: "p-6 pt-0",

  /** Card footer */
  footer: "flex items-center p-6 pt-0",
} as const

/**
 * Utility function for creating icon container classes
 */
export function getIconContainerClasses(
  variant: keyof typeof iconContainerClasses = "neutral",
  size: "sm" | "md" | "lg" = "md"
): string {
  const sizeClasses = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5",
  }

  return cn(
    "rounded-lg inline-flex items-center justify-center",
    iconContainerClasses[variant],
    sizeClasses[size]
  )
}

/**
 * Utility function for creating header classes
 */
export function getHeaderClasses(): {
  container: string
  title: string
  link: string
  linkActive: string
} {
  return headerClasses
}

/**
 * Utility function for creating hover effect based on variant
 */
export function getHoverClasses(
  variant: "primary" | "secondary" | "accent" | "card" = "primary"
): string {
  const map = {
    primary: interactiveClasses.hoverPrimary,
    secondary: interactiveClasses.hoverSecondary,
    accent: interactiveClasses.hoverAccent,
    card: interactiveClasses.hoverCard,
  }

  return map[variant]
}

/**
 * Classes for loading/empty states
 */
export const stateClasses = {
  loading:
    "animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary",
  loadingText: cn(textClasses.heading, "text-lg"),
  emptyIcon:
    "inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted",
  emptyIconInner: "h-8 w-8 text-muted-foreground",
  emptyTitle: cn(textClasses.heading, "text-xl mb-2"),
  emptyDescription: cn(textClasses.secondary, "mb-6"),
} as const

/**
 * Classes for badge components
 */
export const badgeClasses = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  destructive: "bg-destructive text-white",
  outline: "border-2 border-primary text-primary",
} as const

/**
 * Modern Product UI - Theme Utilities
 *
 * Professional design system utilities for consistent UI
 */

import { cn } from "./utils"

/**
 * Spacing system - consistent spacing throughout the app
 */
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
} as const

/**
 * Modern shadow system - subtle elevation
 */
export const shadows = {
  none: "shadow-none",
  sm: "shadow-sm",
  base: "shadow",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
} as const

/**
 * Mediterranean Relief UI theme colors - subtle tones
 */
export const themeColors = {
  primary: {
    hex: "#d77040",
    name: "Deep Orange",
    usage: "Primary actions, urgency, fire",
  },
  secondary: {
    hex: "#4a8fc9",
    name: "Safe Blue",
    usage: "Secondary actions, trust, calm",
  },
  accent: {
    hex: "#65b365",
    name: "Olive Green",
    usage: "Success, hope, recovery",
  },
  destructive: {
    hex: "#c95555",
    name: "Fire Red",
    usage: "Errors, urgent alerts",
  },
} as const

/**
 * Background classes
 */
export const backgroundClasses = {
  /** Main page background - clean white */
  page: "bg-background",

  /** Card background - pure white */
  card: "bg-card",

  /** Soft muted background */
  soft: "bg-muted/30",

  /** Subtle gradients */
  gradientSubtle: "bg-gradient-to-br from-muted/20 to-background",
  
  /** Primary to secondary gradient */
  gradientPrimarySecondary: "bg-gradient-to-br from-primary/10 to-secondary/10",
} as const

/**
 * Text classes with clear hierarchy
 */
export const textClasses = {
  /** Primary text - standard body text */
  primary: "text-foreground",

  /** Secondary text - less emphasis */
  secondary: "text-muted-foreground",

  /** Tertiary text - minimal emphasis */
  tertiary: "text-muted-foreground/60",

  /** Headings - bold and prominent */
  heading: "text-foreground font-semibold tracking-tight",

  /** Large display text */
  display: "text-foreground font-bold tracking-tight",

  /** Small text - captions, labels */
  small: "text-sm text-muted-foreground",

  /** Extra small text */
  xs: "text-xs text-muted-foreground/80",
} as const

/**
 * Border classes - subtle and clean
 */
export const borderClasses = {
  /** Base border */
  default: "border-border",

  /** Subtle border */
  subtle: "border border-border/50",

  /** Strong border */
  strong: "border-2 border-border",

  /** Primary color border */
  primary: "border border-primary/20",

  /** Border on hover */
  hoverPrimary: "hover:border-primary/40",
  
  /** Secondary border on hover */
  hoverSecondary: "hover:border-secondary/40",
  
  /** Accent border on hover */
  hoverAccent: "hover:border-accent/40",
} as const

/**
 * Interactive state classes - smooth transitions
 */
export const interactiveClasses = {
  /** Subtle hover effect */
  hover: "hover:bg-muted/50 transition-colors duration-200",

  /** Primary hover */
  hoverPrimary:
    "hover:bg-primary/5 hover:text-primary transition-colors duration-200",

  /** Secondary hover */
  hoverSecondary:
    "hover:bg-secondary/5 hover:text-secondary transition-colors duration-200",

  /** Accent hover */
  hoverAccent:
    "hover:bg-accent/5 hover:text-accent transition-colors duration-200",

  /** Card hover with shadow */
  hoverCard: "hover:shadow-md transition-shadow duration-200",

  /** Scale on hover */
  hoverScale: "hover:scale-[1.02] transition-transform duration-200",

  /** Focus ring for accessibility */
  focus:
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary/20",
} as const

/**
 * Icon container classes - subtle backgrounds
 */
export const iconContainerClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const

/**
 * Header/navbar styles - clean and minimal
 */
export const headerClasses = {
  container:
    "sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm",
  title: cn(textClasses.heading, "text-lg"),
  link: "text-muted-foreground hover:text-foreground transition-colors duration-200",
  linkActive: "text-primary font-medium",
} as const

/**
 * Card styles - modern and clean
 */
export const cardClasses = {
  /** Base card with subtle shadow */
  base: "bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200",

  /** Card without hover */
  static: "bg-card rounded-lg border border-border shadow-sm",

  /** Elevated card */
  elevated: "bg-card rounded-lg border border-border shadow-md",

  /** Internal padding */
  padding: "p-4 sm:p-6",

  /** Compact padding */
  paddingCompact: "p-3 sm:p-4",

  /** Card header */
  header: "flex flex-col space-y-1.5 pb-4",

  /** Card content */
  content: "pt-0",

  /** Card footer */
  footer: "flex items-center pt-4 border-t border-border/50",
} as const

/**
 * Utility function for creating icon container classes
 */
export function getIconContainerClasses(
  variant: keyof typeof iconContainerClasses = "neutral",
  size: "xs" | "sm" | "md" | "lg" = "md"
): string {
  const sizeClasses = {
    xs: "w-6 h-6 p-1",
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5",
  }

  return cn(
    "rounded-md inline-flex items-center justify-center shrink-0",
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
 * Loading and empty state classes
 */
export const stateClasses = {
  loading:
    "animate-spin rounded-full h-12 w-12 border-2 border-border border-t-primary",
  loadingText: cn(textClasses.secondary, "text-sm"),
  emptyIcon:
    "inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50",
  emptyIconInner: "h-6 w-6 text-muted-foreground",
  emptyTitle: cn(textClasses.heading, "text-lg mb-1"),
  emptyDescription: cn(textClasses.secondary, "text-sm mb-4"),
} as const

/**
 * Badge styles - subtle and clean
 */
export const badgeClasses = {
  primary: "bg-primary/10 text-primary border border-primary/20",
  secondary: "bg-secondary/10 text-secondary border border-secondary/20",
  accent: "bg-accent/10 text-accent border border-accent/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/20",
  outline: "border border-border text-foreground",
  neutral: "bg-muted text-muted-foreground",
} as const

/**
 * Status indicator colors
 */
export const statusColors = {
  active: "text-accent",
  pending: "text-warning",
  completed: "text-primary",
  cancelled: "text-muted-foreground",
  error: "text-destructive",
} as const

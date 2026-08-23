import { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-brand-canvas border border-border text-foreground rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        feature: "bg-brand-surface-card text-brand-ink rounded-2xl border border-transparent",
        dark: "bg-brand-surface-dark text-brand-on-dark rounded-2xl border border-transparent",
        "dark-elevated": "bg-brand-surface-dark-elevated text-brand-on-dark rounded-2xl border border-transparent",
        coral: "bg-brand-primary text-primary-foreground rounded-2xl border border-transparent",
      },
      size: {
        default: "[--card-spacing:--spacing(6)] p-6 sm:p-8",
        sm: "[--card-spacing:--spacing(4)] p-4 sm:p-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface CardProps extends ComponentProps<"div">, VariantProps<typeof cardVariants> {}

function Card({
  className,
  variant,
  size,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size || "default"}
      data-variant={variant || "default"}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-2xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-lg leading-snug font-bold text-gray-900 group-data-[variant=dark]/card:text-brand-on-dark group-data-[variant=dark-elevated]/card:text-brand-on-dark group-data-[size=sm]/card:text-base dark:text-white",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-xs sm:text-sm text-brand-muted group-data-[variant=dark]/card:text-brand-on-dark-soft group-data-[variant=dark-elevated]/card:text-brand-on-dark-soft dark:text-zinc-400",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-2xl border-t border-border bg-muted/20 p-(--card-spacing) group-data-[variant=dark]/card:border-brand-surface-dark-soft group-data-[variant=dark-elevated]/card:border-brand-surface-dark-soft",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

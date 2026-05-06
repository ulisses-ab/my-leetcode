import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { playClick } from "@/lib/sounds"
import { useSoundStore } from "@/stores/useSoundStore"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans uppercase tracking-wide text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bb-accent border-2 active:translate-x-0 active:translate-y-0 active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "border-bb-accent bg-bb-accent/12 text-bb-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:[box-shadow:4px_4px_0_0_var(--bb-shadow)] hover:text-bb-accent",
        destructive:
          "border-bb-error bg-bb-error/15 text-bb-error hover:-translate-x-0.5 hover:-translate-y-0.5 hover:[box-shadow:4px_4px_0_0_var(--bb-shadow)] hover:bg-bb-error/25",
        outline:
          "border-bb-border/60 bg-bb-surface/72 text-bb-ink hover:border-bb-accent hover:text-bb-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:[box-shadow:4px_4px_0_0_var(--bb-shadow)]",
        secondary:
          "border-bb-border/40 bg-bb-surface-2 text-bb-ink hover:border-bb-accent hover:text-bb-accent",
        ghost:
          "border-transparent bg-transparent text-bb-muted-strong hover:text-bb-accent hover:border-bb-border/50",
        link: "border-transparent text-bb-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 px-6 text-base has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!disabled && useSoundStore.getState().enabled) playClick();
    onClick?.(e);
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }

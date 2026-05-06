import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-bb-accent bg-bb-accent/15 text-bb-accent",
        secondary:
          "border-bb-border/50 bg-bb-surface text-bb-muted-strong",
        destructive:
          "border-bb-accent bg-bb-accent text-bb-selection-ink",
        outline: "border-bb-border/50 text-bb-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

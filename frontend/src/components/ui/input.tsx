import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-bb-muted/70 selection:bg-bb-accent selection:text-bb-selection-ink h-10 w-full min-w-0 border-2 border-bb-border/55 bg-bb-surface/72 px-3 py-1 font-sans text-sm text-bb-ink transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-bb-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bb-accent",
        "aria-invalid:border-bb-accent",
        className
      )}
      {...props}
    />
  )
}

export { Input }

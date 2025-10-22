import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/index"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent-dark)] shadow-sm",
        secondary:
          "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-dark)] shadow-sm",
        destructive:
          "bg-[var(--color-error)] text-white hover:bg-[#d73a49] shadow-sm",
        outline: "border-2 border-[var(--color-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-pale)]",
        success:
          "bg-[var(--color-success)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm",
        info:
          "bg-[var(--color-info)] text-white hover:bg-[var(--color-secondary-dark)] shadow-sm",
        warning:
          "bg-[var(--color-warning)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent-dark)] shadow-sm",
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

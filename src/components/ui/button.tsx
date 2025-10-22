import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/index"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary)] hover:-translate-y-0.5 shadow-md hover:shadow-lg",
        destructive:
          "bg-gradient-to-r from-[var(--color-error)] to-[#d73a49] text-white hover:from-[#d73a49] hover:to-[var(--color-error)] hover:-translate-y-0.5 shadow-md hover:shadow-lg",
        outline:
          "border-2 border-[var(--color-primary)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)] hover:border-[var(--color-primary-dark)]",
        secondary:
          "bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white hover:from-[var(--color-secondary-dark)] hover:to-[var(--color-secondary)] hover:-translate-y-0.5 shadow-md hover:shadow-lg",
        ghost: "hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary-dark)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-full",
        sm: "h-9 rounded-full px-3 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

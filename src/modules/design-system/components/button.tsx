import * as React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'relative group/button inline-flex items-center justify-center whitespace-nowrap transition-colors ease duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:shadow-focus focus-visible:outline-0',
  {
    variants: {
      variant: {
        default:
          'font-semibold text-primary-reverse bg-primary-reverse hover:bg-primary-reverse-hover active:bg-primary-reverse-active',
        outline:
          'font-semibold text-primary bg-transparent border border-primary hover:bg-primary-hover active:bg-primary-active',
        shiny:
          'font-semibold text-white to-black from-black/80 dark:text-black bg-gradient-to-r dark:from-white/80 dark:to-white',
        ghost:
          'font-semibold text-secondary bg-transparent hover:bg-primary hover:text-primary active:bg-primary-active',
      },
      size: {
        default: 'h-8 px-4 rounded-md text-sm ',
        large: 'h-12 px-6 rounded-md text-base',
        icon: 'h-8 w-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        <Slottable>{props.children}</Slottable>
        {variant === 'shiny' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[length:200%_100%] opacity-0 group-hover/button:animate-button-shine group-hover/button:[animation-delay:.2s] dark:bg-[linear-gradient(110deg,transparent,35%,rgba(255,255,255,.7),75%,transparent)]"
          />
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

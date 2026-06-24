import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/10 hover:opacity-90",
        outline: "border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900/40",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
        ghost: "text-neutral-400 hover:text-white hover:bg-neutral-900/60",
        destructive: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
        link: "text-indigo-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        xs: "h-7 px-2.5 py-1 text-[10px] rounded-lg [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8.5 px-3 py-1.5 rounded-lg",
        lg: "h-11 px-5 py-3 rounded-2xl text-sm",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8.5 rounded-lg",
        "icon-lg": "size-11 rounded-2xl",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

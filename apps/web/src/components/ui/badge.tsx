import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        solana:
          "border-cyan-200 dark:border-cyan-800/80 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
        ethereum:
          "border-violet-200 dark:border-violet-800/80 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400",
        legendary:
          "border-amber-400/50 dark:border-amber-500/50 bg-amber-500/10 text-amber-500 dark:text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
        epic:
          "border-purple-400/50 dark:border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400",
        rare:
          "border-indigo-400/50 dark:border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        common:
          "border-slate-300 dark:border-slate-700 bg-slate-500/10 text-slate-600 dark:text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

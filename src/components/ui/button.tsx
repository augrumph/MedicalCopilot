import * as React from"react"
import { Slot} from"@radix-ui/react-slot"
import { cva, type VariantProps} from"class-variance-authority"
import { motion} from"framer-motion"

import { cn} from"@/lib/utils"
import { useAnimations} from"@/hooks/useAnimations"

const buttonVariants = cva(
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
 {
 variants: {
 variant: {
 default:"bg-primary text-primary-foreground hover:bg-[#162f42] hover:shadow-lg hover:shadow-primary/25",
 destructive:
"bg-destructive text-white focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:bg-[#c71f1f] hover:shadow-md hover:shadow-destructive/20",
 outline:
"border bg-background shadow-xs dark:bg-input/30 dark:border-input hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm",
 secondary:
"bg-secondary text-secondary-foreground hover:bg-[#364f63] hover:shadow-md hover:shadow-secondary/20",
 ghost:
" hover:bg-gray-100/80",
 link:"text-primary underline-offset-4 hover:underline",
},
 size: {
 default:"h-9 px-4 py-2 has-[>svg]:px-3",
 sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
 lg:"h-10 rounded-md px-6 has-[>svg]:px-4",
 icon:"size-9",
"icon-sm":"size-8",
"icon-lg":"size-10",
},
},
 defaultVariants: {
 variant:"default",
 size:"default",
},
}
)

function Button({
 className,
 variant,
 size,
 asChild = false,
 ...props
}: React.ComponentProps<"button"> &
 VariantProps<typeof buttonVariants> & {
 asChild?: boolean
}) {
 const { hoverAnimation, tapAnimation, shouldAnimate} = useAnimations()
 const Comp = asChild ? Slot : motion.button

 // Animation props (only when not asChild and shouldAnimate)
 const animationProps = !asChild && shouldAnimate ? {
 whileHover: variant ==="link"? {} : hoverAnimation,
 whileTap: variant ==="link"? {} : tapAnimation,
 transition: { type:"spring" as const, stiffness: 400, damping: 25}
 } : {}

 return (
 <Comp
 data-slot="button"
 className={cn(buttonVariants({ variant, size, className}))}
 {...(animationProps as any)}
 {...(props as any)}
 />
 )
}

export { Button, buttonVariants}

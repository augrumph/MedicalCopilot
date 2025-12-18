import * as React from"react"
import { cva, type VariantProps} from"class-variance-authority"
import { motion} from"framer-motion"

import { cn} from"@/lib/utils"
import { useAnimations} from"@/hooks/useAnimations"

const badgeVariants = cva(
"inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
 {
 variants: {
 variant: {
 default:
"border-transparent bg-primary text-primary-foreground shadow",
 secondary:
"border-transparent bg-secondary text-secondary-foreground",
 destructive:
"border-transparent bg-destructive text-destructive-foreground shadow",
 outline:"text-foreground",
},
},
 defaultVariants: {
 variant:"default",
},
}
)

export interface BadgeProps
 extends React.HTMLAttributes<HTMLDivElement>,
 VariantProps<typeof badgeVariants> {
 clickable?: boolean
}

function Badge({ className, variant, clickable = false, ...props}: BadgeProps) {
 const { shouldAnimate} = useAnimations()

 // If clickable and animations enabled, use motion.div
 if (clickable && shouldAnimate) {
 const { onClick, ...motionProps} = props;
 return (
 <motion.div
 whileHover={{ scale: 1.05}}
 whileTap={{ scale: 0.95}}
 transition={{ duration: 0.15}}
 className={cn(
 badgeVariants({ variant}),
"cursor-pointer hover:brightness-110 hover:shadow-sm",
 className
 )}
 onClick={onClick}
 {...motionProps as any}
 />
 )
 }

 // Regular badge
 return (
 <div
 className={cn(
 badgeVariants({ variant}),
 clickable &&"cursor-pointer hover:brightness-110 hover:shadow-sm",
 className
 )}
 {...props}
 />
 )
}

export { Badge, badgeVariants}

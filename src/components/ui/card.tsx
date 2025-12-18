import * as React from"react"
import { motion} from"framer-motion"

import { cn} from"@/lib/utils"
import { useAnimations} from"@/hooks/useAnimations"

interface CardProps extends React.ComponentProps<"div"> {
 interactive?: boolean
 onCardClick?: () => void
}

function Card({ className, interactive = false, onCardClick, ...props}: CardProps) {
 const { cardHoverAnimation, shouldAnimate} = useAnimations()

 // If interactive, use motion.div with animations
 if (interactive && shouldAnimate) {
 return (
 <motion.div
 data-slot="card"
 className={cn(
"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm transition-colors duration-200 cursor-pointer hover:border-primary/20",
 className
 )}
 whileHover={cardHoverAnimation as any}
 whileTap={{ scale: 0.995}}
 transition={{ type:"spring" as const, stiffness: 300, damping: 20}}
 onClick={onCardClick}
 {...(props as any)}
 />
 )
 }

 // Static card or no animations
 return (
 <div
 data-slot="card"
 className={cn(
"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm transition-shadow duration-200",
 interactive &&"cursor-pointer hover:border-primary/20",
 !interactive &&"hover:shadow-md",
 className
 )}
 onClick={interactive ? onCardClick : undefined}
 {...props}
 />
 )
}

function CardHeader({ className, ...props}: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-header"
 className={cn(
"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
 className
 )}
 {...props}
 />
 )
}

function CardTitle({ className, ...props}: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-title"
 className={cn("leading-none font-semibold", className)}
 {...props}
 />
 )
}

function CardDescription({ className, ...props}: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-description"
 className={cn("text-muted-foreground text-sm", className)}
 {...props}
 />
 )
}

function CardAction({ className, ...props}: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-action"
 className={cn(
"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
 className
 )}
 {...props}
 />
 )
}

function CardContent({ className, ...props}: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-content"
 className={cn("px-6", className)}
 {...props}
 />
 )
}

function CardFooter({ className, ...props}: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="card-footer"
 className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
 {...props}
 />
 )
}

export {
 Card,
 CardHeader,
 CardFooter,
 CardTitle,
 CardAction,
 CardDescription,
 CardContent,
}

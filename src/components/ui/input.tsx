import * as React from"react"

import { cn} from"@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
 ({ className, type, ...props}, ref) => {
 return (
 <input
 type={type}
 className={cn(
"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-gray-300 hover:shadow-sm aria-[invalid=true]:hover:border-destructive/60 transition-[border-color,box-shadow] duration-150",
 className
 )}
 ref={ref}
 {...props}
 />
 )
}
)
Input.displayName ="Input"

export { Input}

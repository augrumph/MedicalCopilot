import { memo, useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutoSaveIndicatorProps {
  isSaving?: boolean
  lastSaved?: Date | null
  className?: string
}

export const AutoSaveIndicator = memo(function AutoSaveIndicator({
  isSaving = false,
  lastSaved = null,
  className
}: AutoSaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true)
      const timer = setTimeout(() => setShowSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, lastSaved])

  if (isSaving) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-gray-500", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Salvando...</span>
      </div>
    )
  }

  if (showSaved && lastSaved) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-green-600", className)}>
        <Check className="h-4 w-4" />
        <span>Salvo</span>
      </div>
    )
  }

  return null
})

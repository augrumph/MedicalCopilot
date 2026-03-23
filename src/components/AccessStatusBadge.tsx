import { memo, useState } from 'react';
import { Clock, Zap, ShoppingCart } from 'lucide-react';
import { useAccessStatus } from '@/hooks/useAccessStatus';
import { cn } from '@/lib/utils';
import { BuyAccessModal } from '@/components/BuyAccessModal';

function formatTime(minutes: number): string {
    if (minutes <= 0) return '0min';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}

/**
 * Shows the doctor's current access status in the sidebar:
 * - Active: green pill with countdown
 * - Available (unused credits): purple pill with count
 * - No access: red/gray pill with buy prompt
 */
export const AccessStatusBadge = memo(function AccessStatusBadge() {
    const { data, isLoading } = useAccessStatus();
    const [buyOpen, setBuyOpen] = useState(false);

    if (isLoading || !data) return null;

    const { hasActiveAccess, availableCount, minutesRemaining } = data;

    // Active shift in progress — show countdown
    if (hasActiveAccess && minutesRemaining !== null) {
        const isLow = minutesRemaining < 60;
        return (
            <div
                className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold',
                    isLow
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                )}
            >
                <Clock className="h-3 w-3 shrink-0" />
                <span>{formatTime(minutesRemaining)}</span>
            </div>
        );
    }

    // Has credits available but no active shift
    if (availableCount > 0) {
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-[#512B81] border border-purple-200">
                <Zap className="h-3 w-3 shrink-0" />
                <span>{availableCount} plantão{availableCount > 1 ? 'ões' : ''}</span>
            </div>
        );
    }

    // No access at all
    return (
        <>
            <button
                onClick={() => setBuyOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer hover:bg-[#512B81] hover:text-white hover:border-[#512B81] transition-colors"
            >
                <ShoppingCart className="h-3 w-3 shrink-0" />
                <span>Comprar plantão</span>
            </button>
            <BuyAccessModal open={buyOpen} onClose={() => setBuyOpen(false)} />
        </>
    );
});

import React from 'react';
import { cn } from '@/lib/utils';

type VitalVariant = 'normal' | 'warning' | 'danger';

function getVitalVariant(label: string, value: string): VitalVariant {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 'normal';
    switch (label) {
        case 'PA': {
            const sys = parseFloat(value.split('/')[0]);
            if (isNaN(sys)) return 'normal';
            if (sys < 90 || sys > 180) return 'danger';
            if (sys < 100 || sys > 160) return 'warning';
            return 'normal';
        }
        case 'FC':
            if (num < 40 || num > 150) return 'danger';
            if (num < 50 || num > 120) return 'warning';
            return 'normal';
        case 'SpO₂':
            if (num < 90) return 'danger';
            if (num < 95) return 'warning';
            return 'normal';
        case 'Temp':
            if (num < 35 || num > 39) return 'danger';
            if (num > 37.8) return 'warning';
            return 'normal';
        case 'FR':
            if (num < 8 || num > 30) return 'danger';
            if (num < 12 || num > 25) return 'warning';
            return 'normal';
        case 'Glic':
            if (num < 60 || num > 400) return 'danger';
            if (num < 70 || num > 250) return 'warning';
            return 'normal';
        default:
            return 'normal';
    }
}

const styles: Record<VitalVariant, { bg: string; text: string; dot: string; iconColor: string; unitColor: string }> = {
    normal: { bg: 'bg-gray-100 border border-gray-200', text: 'text-gray-900', dot: 'bg-emerald-500', iconColor: 'text-gray-400', unitColor: 'text-gray-400' },
    warning: { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500', iconColor: 'text-amber-500', unitColor: 'text-amber-400' },
    danger: { bg: 'bg-red-50 border border-red-200', text: 'text-red-700', dot: 'bg-red-500 animate-pulse', iconColor: 'text-red-500', unitColor: 'text-red-400' },
};

interface VitalBadgeProps {
    label: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
}

export function VitalBadge({ label, value, unit, icon }: VitalBadgeProps) {
    const variant = getVitalVariant(label, value);
    const s = styles[variant];
    return (
        <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg', s.bg)}>
            <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', s.dot)} />
            <span className={cn('text-[10px]', s.iconColor)}>{icon}</span>
            <span className={cn('text-xs font-bold tabular-nums', s.text)}>{value}</span>
            <span className={cn('text-[10px]', s.unitColor)}>{unit}</span>
        </div>
    );
}


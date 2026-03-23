import { useQuery } from '@tanstack/react-query';

export interface AccessStatus {
    hasActiveAccess: boolean;
    availableCount: number;
    expiresAt: string | null;
    minutesRemaining: number | null;
    activeAccess: {
        id: string;
        status: string;
        activatedAt: string | null;
        expiresAt: string | null;
        durationHours: number;
    } | null;
}

const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

async function fetchAccessStatus(): Promise<AccessStatus> {
    const res = await fetch(`${API}/api/access/status`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch access status');
    const json = await res.json();
    return json.data as AccessStatus;
}

/**
 * Polls the access status every 60s so the countdown stays fresh.
 * Returns null if the user is not authenticated.
 */
export function useAccessStatus() {
    return useQuery<AccessStatus>({
        queryKey: ['access-status'],
        queryFn: fetchAccessStatus,
        refetchInterval: 60_000,
        staleTime: 30_000,
        retry: 2,
    });
}

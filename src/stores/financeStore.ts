import { create } from 'zustand';
import { toast } from 'sonner';

export type ShiftStatus = 'pago' | 'aguardando' | 'atrasado' | 'glosa';

export interface Shift {
    id: string;
    date: string;
    location: string;
    grossValue: number;
    paymentForecastDays: number;
    status: ShiftStatus;
    notes?: string;
    isGlosa?: boolean;
    glosaReason?: string;
    contactSponsor?: string;
}

interface FinanceState {
    shifts: Shift[];
    monthlyGoal: number;
    isLoading: boolean;
    error: string | null;

    fetchData: () => Promise<void>;
    setMonthlyGoal: (goal: number) => Promise<void>;
    addShift: (shift: Omit<Shift, 'id' | 'isGlosa'>) => Promise<void>;
    updateShiftStatus: (id: string, status: ShiftStatus, additionalData?: Partial<Shift>) => Promise<void>;
    deleteShift: (id: string) => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

export const useFinanceStore = create<FinanceState>((set, get) => ({
    shifts: [],
    monthlyGoal: 0,
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch both shifts and settings concurrently
            const [shiftsRes, settingsRes] = await Promise.all([
                fetch(`${BACKEND_URL}/api/finance/shifts`, { credentials: 'include' }),
                fetch(`${BACKEND_URL}/api/finance/settings`, { credentials: 'include' })
            ]);

            if (!shiftsRes.ok || !settingsRes.ok) throw new Error('Failed to fetch data');

            const shiftsResult = await shiftsRes.json();
            const settingsResult = await settingsRes.json();

            const shifts = shiftsResult.data || (Array.isArray(shiftsResult) ? shiftsResult : []);
            const settings = settingsResult.data || settingsResult;

            set({ shifts, monthlyGoal: settings.monthlyGoal || 0, isLoading: false });
        } catch (err) {
            const errorMessage = (err as any).name === 'TypeError' && (err as any).message === 'Failed to fetch' 
                ? 'Servidor backend offline (Connection Refused)' 
                : (err as Error).message;
            set({ error: errorMessage, isLoading: false });
            toast.error(`Erro ao carregar plantões: ${errorMessage}`);
        }
    },

    setMonthlyGoal: async (goal: number) => {
        // Optimistic UI
        const previousGoal = get().monthlyGoal;
        set({ monthlyGoal: goal });

        try {
            const res = await fetch(`${BACKEND_URL}/api/finance/settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthlyGoal: goal }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed');
        } catch (error) {
            set({ monthlyGoal: previousGoal });
            toast.error('Erro ao salvar meta no banco de dados');
        }
    },

    addShift: async (shift) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/finance/shifts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shift),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed');
            const result = await res.json();
            const newShift = result.data || result;
            set((state) => ({ shifts: [newShift, ...state.shifts] }));
        } catch (error) {
            toast.error('Erro ao registrar plantão. Servidor indisponível.');
        }
    },

    updateShiftStatus: async (id, status, additionalData) => {
        const previousShifts = get().shifts;

        // Optimistic UI update
        set((state) => ({
            shifts: state.shifts.map(s => s.id === id ? { ...s, status, ...additionalData } : s)
        }));

        try {
            const res = await fetch(`${BACKEND_URL}/api/finance/shifts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, ...additionalData }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed');
        } catch (error) {
            // Rollback
            set({ shifts: previousShifts });
            toast.error('Erro ao atualizar status.');
        }
    },

    deleteShift: async (id) => {
        const previousShifts = get().shifts;

        // Optimistic deletion
        set((state) => ({
            shifts: state.shifts.filter(s => s.id !== id)
        }));

        try {
            const res = await fetch(`${BACKEND_URL}/api/finance/shifts/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Plantão deletado com sucesso');
        } catch (error) {
            // Rollback
            set({ shifts: previousShifts });
            toast.error('Erro ao excluir plantão.');
        }
    }
}));

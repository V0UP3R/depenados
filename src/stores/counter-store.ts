import { create } from 'zustand';

interface CounterState {
  brigas: number;
  acidentes: number;
  pts: number;
  isLoading: boolean;
  fetchCounters: () => Promise<void>;
  incrementCounter: (type: 'brigas' | 'acidentes' | 'pts') => Promise<void>;
  decrementCounter: (type: 'brigas' | 'acidentes' | 'pts') => Promise<void>;
}

export const useCounterStore = create<CounterState>((set) => ({
  brigas: 0,
  acidentes: 0,
  pts: 0,
  isLoading: false,

  fetchCounters: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/counters');
      if (response.ok) {
        const data = await response.json();
        set({
          brigas: data.brigas,
          acidentes: data.acidentes,
          pts: data.pts,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  incrementCounter: async (type) => {
    try {
      const response = await fetch('/api/counters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action: 'increment' }),
      });
      if (response.ok) {
        const data = await response.json();
        set({
          brigas: data.brigas,
          acidentes: data.acidentes,
          pts: data.pts,
        });
      }
    } catch (error) {
      console.error('Erro ao incrementar contador:', error);
    }
  },

  decrementCounter: async (type) => {
    try {
      const response = await fetch('/api/counters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action: 'decrement' }),
      });
      if (response.ok) {
        const data = await response.json();
        set({
          brigas: data.brigas,
          acidentes: data.acidentes,
          pts: data.pts,
        });
      }
    } catch (error) {
      console.error('Erro ao decrementar contador:', error);
    }
  },
}));

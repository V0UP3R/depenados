import { create } from 'zustand';
import type { Event, EventStatus } from '@/types/story';

interface EventState {
  events: Event[];
  isLoading: boolean;
  fetchEvents: (options?: { status?: EventStatus; upcoming?: boolean }) => Promise<void>;
  createEvent: (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Event | null>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  getUpcomingEvents: () => Event[];
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,

  fetchEvents: async (options = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (options.status) params.set('status', options.status);
      if (options.upcoming) params.set('upcoming', 'true');

      const url = `/api/events${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        set({ events: data });
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createEvent: async (data) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const event = await response.json();
        set((state) => ({ events: [...state.events, event] }));
        return event;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return null;
    }
  },

  updateEvent: async (id, data) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const event = await response.json();
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? event : e)),
        }));
        return event;
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return null;
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      return false;
    }
  },

  getUpcomingEvents: () => {
    const { events } = get();
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now && ['upcoming', 'ongoing'].includes(e.status))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  },
}));

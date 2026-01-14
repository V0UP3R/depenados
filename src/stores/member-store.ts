import { create } from 'zustand';
import type { Member } from '@/types/story';

interface MemberState {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  fetchMemberById: (id: string) => Promise<Member | null>;
  createMember: (data: Partial<Member>) => Promise<Member | null>;
  updateMember: (id: string, data: Partial<Member>) => Promise<boolean>;
  deleteMember: (id: string) => Promise<boolean>;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,

  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/members');
      if (!response.ok) throw new Error('Erro ao buscar membros');
      const members = await response.json();
      set({ members, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao buscar membros', isLoading: false });
    }
  },

  fetchMemberById: async (id: string) => {
    try {
      const response = await fetch(`/api/members/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  createMember: async (data) => {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar membro');
      }

      const newMember = await response.json();
      set((state) => ({ members: [...state.members, newMember] }));
      return newMember;
    } catch (error) {
      console.error('Erro ao criar membro:', error);
      return null;
    }
  },

  updateMember: async (id, data) => {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) return false;

      const updatedMember = await response.json();
      set((state) => ({
        members: state.members.map((m) =>
          m.id === id ? { ...m, ...updatedMember } : m
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },

  deleteMember: async (id) => {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) return false;

      set((state) => ({
        members: state.members.filter((m) => m.id !== id),
      }));
      return true;
    } catch {
      return false;
    }
  },
}));

import { create } from 'zustand';
import type { Story, StoryFilter, MediaItem } from '@/types/story';

interface StoryStore {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  filter: StoryFilter;

  setFilter: (filter: StoryFilter) => void;
  getFilteredStories: () => Story[];
  fetchStories: (options?: { featured?: boolean; search?: string }) => Promise<void>;
  fetchStoryById: (id: string) => Promise<Story | null>;
  createStory: (data: Partial<Story> & { media?: MediaItem[] }) => Promise<Story | null>;
  updateStory: (id: string, data: Partial<Story>) => Promise<Story | null>;
  deleteStory: (id: string) => Promise<boolean>;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  stories: [],
  isLoading: false,
  error: null,
  filter: 'all',

  setFilter: (filter) => set({ filter }),

  getFilteredStories: () => {
    const { stories, filter } = get();
    switch (filter) {
      case 'featured':
        return stories.filter((s) => s.featured);
      case 'recent':
        return [...stories].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return stories;
    }
  },

  fetchStories: async (options) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options?.featured) params.set('featured', 'true');
      if (options?.search) params.set('search', options.search);

      const url = `/api/stories${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Erro ao buscar histórias');

      const data = await response.json();

      const stories = data.map((story: Story & { tags?: string }) => ({
        ...story,
        tags: typeof story.tags === 'string' ? JSON.parse(story.tags) : story.tags || [],
      }));

      set({ stories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchStoryById: async (id) => {
    try {
      const response = await fetch(`/api/stories/${id}`);
      if (!response.ok) return null;

      const story = await response.json();
      return {
        ...story,
        tags: typeof story.tags === 'string' ? JSON.parse(story.tags) : story.tags || [],
      };
    } catch {
      return null;
    }
  },

  createStory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao criar história');

      const story = await response.json();
      const parsedStory = {
        ...story,
        tags: typeof story.tags === 'string' ? JSON.parse(story.tags) : story.tags || [],
      };

      set((state) => ({
        stories: [parsedStory, ...state.stories],
        isLoading: false,
      }));

      return parsedStory;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  updateStory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao atualizar história');

      const story = await response.json();
      const parsedStory = {
        ...story,
        tags: typeof story.tags === 'string' ? JSON.parse(story.tags) : story.tags || [],
      };

      set((state) => ({
        stories: state.stories.map((s) => (s.id === id ? parsedStory : s)),
        isLoading: false,
      }));

      return parsedStory;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  deleteStory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar história');

      set((state) => ({
        stories: state.stories.filter((s) => s.id !== id),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },
}));

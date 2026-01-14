export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  media: MediaItem[];
  coverImage?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  featured: boolean;
  eventId?: string;
  event?: Event;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  date: string;
  coverImage?: string;
  createdBy: string;
  status: EventStatus;
  stories?: Story[];
  _count?: { stories: number };
  createdAt: string;
  updatedAt: string;
}

export interface StoryFormData {
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  tags?: string;
  featured?: boolean;
}

export type StoryFilter = 'all' | 'featured' | 'recent';

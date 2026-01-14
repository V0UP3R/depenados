export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
}

export interface Member {
  id: string;
  name: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  role?: string;
  joinedAt: string;
  storiesCount?: number;
  eventsCount?: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  media: MediaItem[];
  coverImage?: string;
  author: string;
  authorId?: string;
  authorMember?: Member;
  participants?: Member[];
  participantIds?: string[];
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
  creatorId?: string;
  creator?: Member;
  participants?: Member[];
  participantIds?: string[];
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

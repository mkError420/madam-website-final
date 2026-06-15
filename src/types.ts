/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  duration: string;
  audioUrl: string; // URL or synthesized wave audio frequency pattern
  lyrics?: string;
  plays?: string;
}

export interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  youtubeMusic?: string;
  bandcamp?: string;
  soundcloud?: string;
}

export interface Album {
  id: string;
  title: string;
  releaseYear: number;
  type: 'album' | 'EP' | 'single';
  coverUrl: string;
  description: string;
  tracks: Track[];
  streaming: StreamingLinks;
}

export interface Video {
  id: string;
  title: string;
  type: 'music-video' | 'live-session' | 'behind-the-scenes';
  embedId: string; // clean mock embed video id or canvas render simulation
  thumbnailUrl: string;
  duration: string;
  releaseYear: number;
  description: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: 'stage' | 'studio' | 'editorial' | 'backstage';
  aspectRatio: 'landscape' | 'portrait' | 'square';
}

export interface TourEvent {
  id: string;
  date: string; // ISO date string or formatted (e.g. "2026-07-24")
  venue: string;
  city: string;
  country: string;
  status: 'available' | 'sold-out' | 'past';
  ticketUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
}

export interface RSVP {
  id: string;
  eventId: string;
  eventName: string;
  name: string;
  email: string;
  ticketsCount: number;
  date: string;
}

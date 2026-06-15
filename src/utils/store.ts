/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TourEvent, ContactMessage, Subscriber, RSVP } from '../types';
import { TOUR_DATES, ALBUMS as INITIAL_ALBUMS } from '../data';

const SUBSCRIBERS_KEY = 'aria_vance_subscribers';
const CONTACTS_KEY = 'aria_vance_contacts';
const EVENTS_KEY = 'aria_vance_events';
const RSVPS_KEY = 'aria_vance_rsvps';
const ALBUMS_KEY = 'aria_vance_albums';
const CATEGORIES_KEY = 'aria_vance_audio_categories';

// Initialize with healthy, elegant default data
const DEFAULT_SUBSCRIBERS: Subscriber[] = [
  { id: 'sub_1', email: 'fan.club@musicblog.com', date: '2026-05-12T14:22:00.000Z' },
  { id: 'sub_2', email: 'producer.dan@recstudio.org', date: '2026-06-01T09:10:00.000Z' }
];

const DEFAULT_CONTACTS: ContactMessage[] = [
  {
    id: 'msg_1',
    name: 'Julianne Moore',
    email: 'julianne@brooklynmusic.org',
    subject: 'Booking Inquiry: Brooklyn Autumn Gala',
    message: 'Greetings Aria! We absolutely fell in love with your acoustic performance of Timber Hearth. We are hosting our annual Brooklyn Arts Autumn Gala on September 24th and would love to discuss booking you for an acoustic set. Please let us know your availability.',
    date: '2026-06-11T16:45:00.000Z',
    read: false
  },
  {
    id: 'msg_2',
    name: 'Marcus Vance',
    email: 'marcus@moderngroves.com',
    subject: 'Loving Rhodes & Rust!',
    message: 'Aria, the new direction with the Fender Rhodes grooves on Rhodes & Rust is gorgeous. The vocal choirs are pure bliss! Keep shining, you have a beautiful soul.',
    date: '2026-06-14T23:12:00.000Z',
    read: true
  }
];

const DEFAULT_RSVPS: RSVP[] = [
  {
    id: 'rsvp_1',
    eventId: 'tour_1',
    eventName: 'Bowery Ballroom',
    name: 'Siddharth Roy',
    email: 'siddharth@jazzbeat.com',
    ticketsCount: 2,
    date: '2026-06-12T11:00:00.000Z'
  }
];

export const getSubscribers = (): Subscriber[] => {
  const data = localStorage.getItem(SUBSCRIBERS_KEY);
  if (!data) {
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(DEFAULT_SUBSCRIBERS));
    return DEFAULT_SUBSCRIBERS;
  }
  return JSON.parse(data);
};

export const addSubscriber = (email: string): { success: boolean; message: string } => {
  const subs = getSubscribers();
  const lower = email.trim().toLowerCase();
  
  if (subs.some(s => s.email.toLowerCase() === lower)) {
    return { success: false, message: "This email is already subscribed to Aria's newsletter." };
  }

  const newSub: Subscriber = {
    id: `sub_${Date.now()}`,
    email: lower,
    date: new Date().toISOString()
  };

  subs.unshift(newSub);
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subs));
  return { success: true, message: "Thank you for subscribing! You have been added to the newsletter." };
};

export const getContacts = (): ContactMessage[] => {
  const data = localStorage.getItem(CONTACTS_KEY);
  if (!data) {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(DEFAULT_CONTACTS));
    return DEFAULT_CONTACTS;
  }
  return JSON.parse(data);
};

export const addContactMessage = (name: string, email: string, subject: string, message: string): ContactMessage => {
  const msgs = getContacts();
  const newMsg: ContactMessage = {
    id: `msg_${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    date: new Date().toISOString(),
    read: false
  };

  msgs.unshift(newMsg);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(msgs));
  return newMsg;
};

export const toggleContactRead = (id: string): ContactMessage[] => {
  const msgs = getContacts();
  const updated = msgs.map(m => m.id === id ? { ...m, read: !m.read } : m);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteContactMessage = (id: string): ContactMessage[] => {
  const msgs = getContacts();
  const updated = msgs.filter(m => m.id !== id);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
  return updated;
};

export const getEvents = (): TourEvent[] => {
  const data = localStorage.getItem(EVENTS_KEY);
  if (!data) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(TOUR_DATES));
    return TOUR_DATES;
  }
  return JSON.parse(data);
};

export const addEvent = (eventData: Omit<TourEvent, 'id'>): TourEvent => {
  const events = getEvents();
  const newEvent: TourEvent = {
    ...eventData,
    id: `tour_${Date.now()}`
  };
  
  // Sort chronologically
  const updated = [...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
  return newEvent;
};

export const updateEventStatus = (id: string, status: TourEvent['status']): TourEvent[] => {
  const events = getEvents();
  const updated = events.map(e => e.id === id ? { ...e, status } : e);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteEvent = (id: string): TourEvent[] => {
  const events = getEvents();
  const updated = events.filter(e => e.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
  return updated;
};

export const getRSVPs = (): RSVP[] => {
  const data = localStorage.getItem(RSVPS_KEY);
  if (!data) {
    localStorage.setItem(RSVPS_KEY, JSON.stringify(DEFAULT_RSVPS));
    return DEFAULT_RSVPS;
  }
  return JSON.parse(data);
};

export const addRSVP = (eventId: string, eventName: string, name: string, email: string, ticketsCount: number): RSVP => {
  const rsvps = getRSVPs();
  const newRsvp: RSVP = {
    id: `rsvp_${Date.now()}`,
    eventId,
    eventName,
    name: name.trim(),
    email: email.trim(),
    ticketsCount,
    date: new Date().toISOString()
  };

  rsvps.unshift(newRsvp);
  localStorage.setItem(RSVPS_KEY, JSON.stringify(rsvps));
  return newRsvp;
};

const DEFAULT_CATEGORIES = ['All', 'Studio Albums', 'Live Sessions', 'EPs & Singles'];

export const getAudioCategories = (): string[] => {
  const data = localStorage.getItem(CATEGORIES_KEY);
  if (!data) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(data);
};

export const addAudioCategory = (category: string): string[] => {
  const cats = getAudioCategories();
  if (!cats.includes(category)) {
    cats.push(category);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  }
  return cats;
};

export const deleteAudioCategory = (category: string): string[] => {
  const cats = getAudioCategories();
  const updated = cats.filter(c => c !== category);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
};

export const getAlbums = (): any[] => {
  const data = localStorage.getItem(ALBUMS_KEY);
  if (!data) {
    const initialized = INITIAL_ALBUMS.map((alb, index) => ({
      ...alb,
      category: index === 0 ? 'Studio Albums' : index === 1 ? 'Live Sessions' : 'EPs & Singles'
    }));
    localStorage.setItem(ALBUMS_KEY, JSON.stringify(initialized));
    return initialized;
  }
  return JSON.parse(data);
};

export const updateAlbumCategory = (id: string, category: string): any[] => {
  const albums = getAlbums();
  const updated = albums.map(a => a.id === id ? { ...a, category } : a);
  localStorage.setItem(ALBUMS_KEY, JSON.stringify(updated));
  return updated;
};

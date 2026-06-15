/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Disc, Heart, Mail, Compass, HelpCircle, AlertCircle, ArrowUp } from 'lucide-react';

// Imports of core sub-views
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import AudioView from './components/AudioView';
import VideoView from './components/VideoView';
import GalleryView from './components/GalleryView';
import ContactView from './components/ContactView';
import DashboardView from './components/DashboardView';

// Imports of database synchronization methods
import {
  getSubscribers,
  addSubscriber,
  getContacts,
  addContactMessage,
  toggleContactRead,
  deleteContactMessage,
  getEvents,
  addEvent,
  updateEventStatus,
  deleteEvent,
  getRSVPs,
  addRSVP,
} from './utils/store';

// Imports of real-time audio synthesis
import { playSynth, stopSynth, getPlayingTrackId } from './utils/synth';

import { Subscriber, ContactMessage, TourEvent, RSVP } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [showAdminBadge, setShowAdminBadge] = useState<boolean>(true);
  
  // Back-to-top button state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load database structures on startup
  useEffect(() => {
    setSubscribers(getSubscribers());
    setContacts(getContacts());
    setEvents(getEvents());
    setRsvps(getRSVPs());
  }, []);

  // SEO Optimal Metadata Updates - Updates titles/descriptions dynamically for rapid client-side indexing
  useEffect(() => {
    const formattedTab = currentTab === 'audios' ? 'Streaming Audio' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1);
    document.title = `${formattedTab} | Aria Vance - Minimalist Singer Portfolio`;

    // Dynamic META description emulations
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Explore Aria Vance's professional music portfolio page focusing on ${currentTab}. Stream live synthesized ambient tracks and browse photography gallery.`);
    }
  }, [currentTab]);

  // Track window scroll coordinates for smooth floating arrow buttons
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stop synthesizer plays on complete component unmount
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  // 1. Audio controls
  const handlePlayTrack = (trackId: string) => {
    playSynth(trackId);
    setActiveTrackId(trackId);
  };

  const handlePauseTrack = () => {
    stopSynth();
    setActiveTrackId(null);
  };

  // 2. Newsletter subscribers control
  const handleSubscribeNewsletter = async (email: string): Promise<{ success: boolean; message: string }> => {
    const res = addSubscriber(email);
    if (res.success) {
      setSubscribers(getSubscribers());
    }
    return res;
  };

  // 3. Contacts log control
  const handleSendMessage = (name: string, email: string, subject: string, message: string): ContactMessage => {
    const newMsg = addContactMessage(name, email, subject, message);
    setContacts(getContacts());
    setShowAdminBadge(true); // Alert visual cue that a new message exists
    return newMsg;
  };

  const handleToggleContactRead = (id: string) => {
    setContacts(toggleContactRead(id));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(deleteContactMessage(id));
  };

  // 4. Dynamic Tour event creation
  const handleAddEvent = (eventData: Omit<TourEvent, 'id'>): TourEvent => {
    const newEvent = addEvent(eventData);
    setEvents(getEvents());
    return newEvent;
  };

  const handleUpdateEventStatus = (id: string, status: TourEvent['status']) => {
    setEvents(updateEventStatus(id, status));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(deleteEvent(id));
  };

  // 5. Seat Booking RSVPs
  const handleAddRSVP = (eventId: string, eventName: string, name: string, email: string, ticketsCount: number): RSVP => {
    const newRsvp = addRSVP(eventId, eventName, name, email, ticketsCount);
    setRsvps(getRSVPs());
    return newRsvp;
  };

  // Clear badged notifications once admin views back-office dashboard
  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'dashboard') {
      setShowAdminBadge(false);
    }
  };

  // Router viewport mapping helper
  const renderView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleNavigateTab}
            activeTrackId={activeTrackId}
            onPlayTrack={handlePlayTrack}
            onPauseTrack={handlePauseTrack}
            onSubscribeNewsletter={handleSubscribeNewsletter}
          />
        );
      case 'about':
        return <AboutView />;
      case 'audios':
        return (
          <AudioView
            activeTrackId={activeTrackId}
            onPlayTrack={handlePlayTrack}
            onPauseTrack={handlePauseTrack}
          />
        );
      case 'videos':
        return <VideoView />;
      case 'gallery':
        return <GalleryView />;
      case 'contact':
        return (
          <ContactView
            onSendMessage={handleSendMessage}
            onSubscribeNewsletter={handleSubscribeNewsletter}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            subscribers={subscribers}
            contacts={contacts}
            events={events}
            rsvps={rsvps}
            onAddEvent={handleAddEvent}
            onUpdateEventStatus={handleUpdateEventStatus}
            onDeleteEvent={handleDeleteEvent}
            onToggleContactRead={handleToggleContactRead}
            onDeleteContact={handleDeleteContact}
          />
        );
      default:
        return (
          <div className="p-20 text-center text-neutral-500 font-mono">
            View Error. Retrying connection...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Dynamic Header Navbar navigation */}
      <Navigation 
        currentTab={currentTab} 
        onChangeTab={handleNavigateTab} 
        showAdminBadge={showAdminBadge}
      />

      {/* Main Dynamic Multi-view wrapper with animated route transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Elegant Standard Typography Footer */}
      <footer className="bg-[#030303] border-t border-white/5 py-12 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Logo / Genre */}
          <div className="md:col-span-4 text-center md:text-left space-y-2">
            <h3 className="font-sans font-medium text-white tracking-widest uppercase text-base">Aria Vance</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              Acoustic Indie-Soul & Alternative Grooves
            </p>
          </div>

          {/* Quick legal details */}
          <div className="md:col-span-4 text-center text-xs text-white/40 font-light space-y-1">
            <p>© {new Date().getFullYear()} Aria Vance Music. Created in Brooklyn, NY.</p>
            <p className="font-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">
              ALL RIGHTS RESERVED • REGISTERED RECORD MAKER
            </p>
          </div>

          {/* Nav quick redirects */}
          <div className="md:col-span-4 flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-xs font-mono text-white/50">
            <button onClick={() => handleNavigateTab('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <span className="text-white/10">|</span>
            <button onClick={() => handleNavigateTab('contact')} className="hover:text-white transition-colors cursor-pointer">Contact</button>
            <span className="text-white/10">|</span>
            <button onClick={() => handleNavigateTab('dashboard')} className="hover:text-white font-semibold transition-colors cursor-pointer">Admin Dashboard</button>
          </div>

        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 bg-black border border-white/15 text-white hover:border-white hover:bg-white/5 rounded-none z-40 transition-all cursor-pointer active:scale-95"
            title="Scroll to Top"
          >
            <ArrowUp className="h-4 w-4 stroke-[2]" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}

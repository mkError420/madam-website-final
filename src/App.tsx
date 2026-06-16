/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  getRSVPs,
  addRSVP,
  getAlbums,
  getAudioCategories,
  addAudioCategory,
  deleteAudioCategory,
  updateAlbumCategory,
  getVideos,
  addVideo,
  deleteVideo,
  getGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
  addAlbum,
  deleteAlbum,
  addTrackToAlbum,
  deleteTrackFromAlbum,
} from './utils/store';

import { Subscriber, ContactMessage, TourEvent, RSVP, Video, GalleryItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [audioCategories, setAudioCategories] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [showAdminBadge, setShowAdminBadge] = useState<boolean>(true);
  
  // Audio Player State
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Back-to-top button state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load database structures on startup
  useEffect(() => {
    setSubscribers(getSubscribers());
    setContacts(getContacts());
    setRsvps(getRSVPs());
    setAlbums(getAlbums());
    setAudioCategories(getAudioCategories());
    setVideos(getVideos());
    setGalleryItems(getGalleryItems());
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
    const audio = audioRef.current;
    const handleEnded = () => {
      setIsPlaying(false);
      // Optional: play next track
    };
    audio?.addEventListener('ended', handleEnded);
    return () => {
      audio?.removeEventListener('ended', handleEnded);
    };
  }, []);

  // 1. Audio controls
  const getPlayerAnalyser = () => analyserRef.current;

  const handlePlayTrack = (trackId: string) => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(context.destination);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }

    if (trackId === activeTrackId) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      const allTracks = albums.flatMap(a => a.tracks || []);
      const trackToPlay = allTracks.find(t => t.id === trackId);
      if (trackToPlay && trackToPlay.audioUrl && trackToPlay.audioUrl !== '#') {
        audioRef.current.src = trackToPlay.audioUrl;
        setActiveTrackId(trackId);
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    }
  };

  const handlePauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (vol: number) => {
    if (audioRef.current) audioRef.current.volume = vol;
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
            albums={albums}
            videos={videos}
            onNavigate={handleNavigateTab}
            activeTrackId={activeTrackId}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
            onPauseTrack={handlePauseTrack}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onSubscribeNewsletter={handleSubscribeNewsletter}
          />
        );
      case 'about':
        return <AboutView />;
      case 'audios':
        return (
          <AudioView
            albums={albums}
            categories={audioCategories}
            activeTrackId={activeTrackId}
            isPlaying={isPlaying}
            onPlayTrack={handlePlayTrack}
            onPauseTrack={handlePauseTrack}
            getPlayerAnalyser={getPlayerAnalyser}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
          />
        );
      case 'videos':
        return <VideoView videos={videos} />;
      case 'gallery':
        return <GalleryView galleryItems={galleryItems} />;
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
            rsvps={rsvps}
            albums={albums}
            audioCategories={audioCategories}
            videos={videos}
            galleryItems={galleryItems}
            onToggleContactRead={handleToggleContactRead}
            onDeleteContact={handleDeleteContact}
            onAddAudioCategory={(cat) => setAudioCategories(addAudioCategory(cat))}
            onDeleteAudioCategory={(cat) => setAudioCategories(deleteAudioCategory(cat))}
            onUpdateAlbumCategory={(id, cat) => setAlbums(updateAlbumCategory(id, cat))}
            onAddAlbum={(data) => setAlbums(addAlbum(data))}
            onDeleteAlbum={(id) => setAlbums(deleteAlbum(id))}
            onAddTrack={(aId, data) => setAlbums(addTrackToAlbum(aId, data))}
            onDeleteTrack={(aId, tId) => setAlbums(deleteTrackFromAlbum(aId, tId))}
            onAddVideo={(data) => setVideos(addVideo(data))}
            onDeleteVideo={(id) => setVideos(deleteVideo(id))}
            onAddGalleryItem={(data) => setGalleryItems(addGalleryItem(data))}
            onDeleteGalleryItem={(id) => setGalleryItems(deleteGalleryItem(id))}
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
      <audio 
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedData={(e) => setDuration(e.currentTarget.duration)}
        onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        crossOrigin="anonymous"
      />
      
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

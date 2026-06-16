/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Calendar, Music, Sparkles, Mail, Play, Pause, Disc, PlayCircle, X, Volume2, ShieldAlert, Volume, Volume1, VolumeX } from 'lucide-react';
import { ARTIST_INFO } from '../data';
import { TourEvent, Video as VideoType } from '../types';
import { motion, AnimatePresence, useScroll, useVelocity, useTransform, useSpring } from 'motion/react';

interface HomeViewProps {
  albums: any[];
  videos: VideoType[];
  onNavigate: (tab: string) => void;
  activeTrackId: string | null;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  onPauseTrack: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onSubscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function HomeView({
  albums,
  videos,
  onNavigate,
  activeTrackId,
  isPlaying,
  onPlayTrack,
  onPauseTrack,
  currentTime,
  duration,
  volume,
  onSeek,
  onVolumeChange,
  onSubscribeNewsletter
}: HomeViewProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  // Video playback simulation states
  const [activeVideo, setActiveVideo] = useState<VideoType | null>(null);
  const [isPlayingSim, setIsPlayingSim] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(25);

  // 3D Plane Scroll Velocity Logic
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map scroll velocity to subtle 3D rotations and skews
  const velocityRotate = useTransform(smoothVelocity, [-2000, 2000], [-8, 8]);
  const velocitySkew = useTransform(smoothVelocity, [-2000, 2000], [-3, 3]);

  const handleOpenVideo = (video: VideoType) => {
    setActiveVideo(video);
    setIsPlayingSim(true);
    setPlaybackProgress(Math.floor(Math.random() * 20));
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    setIsPlayingSim(false);
  };

  // Featured Album is typically the latest: Solitude Sessions
  const featuredAlbum = albums.length > 0 ? albums[0] : null;
  const featuredTrack = featuredAlbum && featuredAlbum.tracks && featuredAlbum.tracks.length > 0 ? featuredAlbum.tracks[0] : null;

  // Gather top tracks from her albums dynamically for the Audios section
  const featuredTracks = albums.flatMap(album => 
    (album.tracks || []).map((track: any) => ({
      ...track,
      albumTitle: album.title,
      albumId: album.id,
      coverUrl: album.coverUrl
    }))
  ).slice(0, 4);

  const handleSubmitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await onSubscribeNewsletter(email);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected issue occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isPlayingFeatured = isPlaying && featuredTrack ? activeTrackId === featuredTrack.id : false;

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden" id="hero-section">
        {/* Ambient Dark Overlay and Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-neutral-950/90 to-neutral-950 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1600" 
            alt="Aria Vance Stage Studio" 
            className="w-full h-full object-cover scale-105 object-center brightness-75 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating Colorful Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] z-0 pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] z-0 pointer-events-none" />

        {/* Hero Text */}
        <div className="relative z-20 text-center max-w-4xl px-4 select-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.25em] text-white/80 uppercase px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-white/55" />
              <span>Quiet Echoes. Honest Grooves.</span>
            </span>

            <h1 className="font-sans font-light text-5xl sm:text-8xl tracking-tight text-white uppercase leading-none">
              Aria <span className="italic font-serif font-light lowercase text-indigo-400">Vance</span>
            </h1>

            <p className="font-sans text-white/60 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              {ARTIST_INFO.bioIntro}
            </p>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-play-music-btn"
                onClick={() => onNavigate('audios')}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-sans font-medium text-xs tracking-widest uppercase hover:bg-indigo-500 border border-indigo-500 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center space-x-2 group shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                <Music className="h-4 w-4" />
                <span>Hear the Discography</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Fine bottom scroll indicator line */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-2 opacity-50">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-neutral-500">Scroll</span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </section>

      {/* 2. Featured Album Release (Interactive Promo) */}
      <AnimatePresence mode="wait">
      {featuredAlbum && featuredTrack && (
      <motion.section 
        key="featured-promo"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 [perspective:1200px]" id="featured-album-promo">
        <motion.div 
          whileHover={{ rotateY: 2, rotateX: -2, translateZ: 20 }}
          style={{ rotateX: velocityRotate, skewY: velocitySkew, transformPerspective: 1200 }}
          className="bg-[#050505] border border-indigo-500/20 rounded-none p-8 sm:p-12 backdrop-blur-sm relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu transition-transform duration-500 ease-out"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Album Cover Art */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-sm w-full aspect-square rounded-none overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] filter brightness-90 hover:brightness-100 transition-all duration-500 border border-white/5">
                <img
                  src={featuredAlbum.coverUrl}
                  alt={featuredAlbum.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FAFAFA] border border-white/10 px-4 py-2 bg-black/85 rounded-none">
                    EP Release 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Release Details & Direct Player */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Latest Release</span>
                <h2 className="font-sans font-light text-3xl sm:text-4xl text-white tracking-widest uppercase group-hover:text-indigo-300 transition-colors">
                  {featuredAlbum.title}
                </h2>
                <p className="text-xs text-white/30 font-mono tracking-widest uppercase">
                  12 Songs • Full Length LP • Mastered in Analog
                </p>
              </div>

              <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light tracking-wide">
                {featuredAlbum.description}
              </p>

              {/* Direct Quick Audition Panel */}
              <div className="border border-white/10 bg-black/50 rounded-none p-5 flex items-center justify-between" id="quick-play-widget">
                <div className="flex items-center space-x-4">
                  <button
                    id="featured-track-toggle"
                    onClick={() => isPlayingFeatured ? onPauseTrack() : onPlayTrack(featuredTrack.id)}
                    className="p-4 rounded-full border border-white/20 text-white hover:border-white hover:bg-white/5 cursor-pointer active:scale-95 transition-all"
                  >
                    {isPlayingFeatured ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-indigo-400 text-indigo-400 ml-0.5" />}
                  </button>
                  <div className="text-left">
                    <p className="text-white text-xs font-semibold tracking-widest uppercase">{featuredTrack.title}</p>
                    <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider mt-0.5">Aria Vance • Solitude Sessions</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center space-x-1">
                  {isPlayingFeatured ? (
                    <div className="flex items-end space-x-0.5 h-6">
                      <span className="w-[2px] bg-indigo-400 rounded-full animate-[bounce_1s_infinite_100ms]" style={{ height: '30%' }} />
                      <span className="w-[2px] bg-indigo-400 rounded-full animate-[bounce_1s_infinite_400ms]" style={{ height: '80%' }} />
                      <span className="w-[2px] bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ height: '50%' }} />
                      <span className="w-[2px] bg-indigo-400 rounded-full animate-[bounce_1s_infinite_650ms]" style={{ height: '90%' }} />
                    </div>
                  ) : (
                    <Disc className="h-4 w-4 text-white/20 animate-[spin_5s_linear_infinite]" />
                  )}
                  <span className="font-mono text-[10px] text-white/40 tracking-wider ml-3">{featuredTrack.duration}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                <span className="text-white/30 uppercase tracking-widest">Stream on</span>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline transition-colors uppercase tracking-widest text-[10px]">Spotify</a>
                <span className="text-white/10">•</span>
                <a href="https://apple.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline transition-colors uppercase tracking-widest text-[10px]">Apple Music</a>
                <span className="text-white/10">•</span>
                <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline transition-colors uppercase tracking-widest text-[10px]">Bandcamp</a>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.section>
      )}
      </AnimatePresence>

      {/* 2b. Dynamics: Audios Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in" id="home-featured-audios">
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2 text-left">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Auditory Works</span>
              <h2 className="font-sans text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
                Audios
              </h2>
            </div>
            <button
              id="view-all-audios-btn"
              onClick={() => onNavigate('audios')}
              className="font-mono text-xs text-white/60 hover:text-white uppercase tracking-widest flex items-center space-x-2 group cursor-pointer"
            >
              <span>Explore Discography</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 text-white/40" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Audio selection widget list */}
            <div className="space-y-4 text-left" id="home-audios-list">
              <AnimatePresence>
                {featuredTracks.length === 0 ? (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/40 text-xs font-mono py-8">No audio tracks available yet.</motion.p>
                ) : featuredTracks.map((track) => {
                  const isSelected = isPlaying && activeTrackId === track.id;
                  return (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      id={`home-track-row-${track.id}`}
                      style={{ rotateX: velocityRotate, skewY: velocitySkew, transformPerspective: 1000 }}
                      className={`flex items-center justify-between p-4 border border-white/5 bg-black/25 hover:bg-indigo-900/10 transition-all duration-300 group/row ${
                        isSelected ? 'border-white/15 bg-white/5' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4 min-w-0 transition-transform group-hover/row:translate-x-1">
                        <div className="relative group/cover w-12 h-12 flex-shrink-0 bg-black overflow-hidden border border-white/10">
                          <img
                            src={track.coverUrl}
                            alt={track.albumTitle}
                            className="w-full h-full object-cover grayscale"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-all">
                            <button
                              onClick={() => (isPlaying && activeTrackId === track.id) ? onPauseTrack() : onPlayTrack(track.id)}
                              className="p-1 rounded-full bg-white text-black cursor-pointer"
                            >
                              {isSelected ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current ml-0.5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="min-w-0">
                          <p className={`text-sm font-medium tracking-wide uppercase truncate ${activeTrackId === track.id ? 'text-white' : 'text-white/85'}`}>
                            {track.title}
                          </p>
                          <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider mt-0.5 truncate">
                            {track.albumTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <span className="text-[10px] text-white/30 font-mono tracking-wider hidden sm:inline-block">
                          {track.plays} plays
                        </span>
                        <span className="text-white/10 font-mono text-xs hidden sm:inline-block">|</span>
                        <span className="text-[10px] text-white/40 font-mono tracking-wider w-8 text-right">
                          {track.duration}
                        </span>
                        
                        <button
                          id={`home-track-play-${track.id}`}
                          onClick={() => (isPlaying && activeTrackId === track.id) ? onPauseTrack() : onPlayTrack(track.id)}
                          className={`p-2.5 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                            isSelected ? 'bg-white text-black border border-white' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {isSelected ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current ml-0.5" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Poetic Quote & Stylized Vinyl Art display */}
            <motion.div 
              style={{ rotateX: velocityRotate, skewY: velocitySkew, transformPerspective: 1000 }}
              className="bg-[#050505] border border-white/5 rounded-none p-8 flex flex-col justify-between text-left relative overflow-hidden" 
              id="home-audio-promo-art"
            >
              <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full border border-indigo-500/10 animate-[spin_40s_linear_infinite] flex items-center justify-center pointer-events-none opacity-30">
                <Disc className="h-32 w-32 text-indigo-400/50" />
              </div>

              <div className="z-10 space-y-8">
                <div className="space-y-4 max-w-sm select-none">
                  <Music className="h-5 w-5 text-indigo-400/50" />
                  <p className="text-white/60 text-sm italic font-serif leading-relaxed">
                    "Music resides in the spaces we leave empty. These tracks are stories shaped over quiet nights, warm fires, and copper strings."
                  </p>
                  <div className="h-[1px] w-8 bg-white/20" />
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                    — Aria’s studio diary note
                  </p>
                </div>

                {/* Interactive Player Section */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] text-white/40">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onInput={(e) => onSeek(Number(e.currentTarget.value))}
                      disabled={!activeTrackId}
                      className="flex-grow h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 disabled:cursor-not-allowed"
                    />
                    <span className="font-mono text-[10px] text-white/40">{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => onVolumeChange(volume > 0 ? 0 : 0.5)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                        {volume === 0 ? <VolumeX className="h-4 w-4"/> : volume < 0.5 ? <Volume1 className="h-4 w-4"/> : <Volume2 className="h-4 w-4"/>}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                        className="w-16 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                      {activeTrackId ? (isPlaying ? 'Streaming Signal' : 'Paused') : 'System Idle'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-auto flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Synthesizer engine active</span>
                </div>
                <span>Analog Stereo Mapping</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2c. Dynamics: Videos Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in" id="home-featured-videos">
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2 text-left">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Visual Adaptations</span>
              <h2 className="font-sans text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
                Videos
              </h2>
            </div>
            <button
              id="view-all-videos-btn"
              onClick={() => onNavigate('videos')}
              className="font-mono text-xs text-white/60 hover:text-white uppercase tracking-widest flex items-center space-x-2 group cursor-pointer"
            >
              <span>Explore Visuals</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 text-white/40" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="home-videos-grid">
            {videos.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-white/40 font-mono text-xs">
                 No visual content released yet.
              </div>
            ) : videos.slice(0, 3).map((video) => (
              <div
                key={video.id}
                id={`home-video-${video.id}`}
                className="group bg-[#050505] border border-white/5 hover:border-white/10 rounded-none overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                {/* Video Thumbnail cover */}
                <div className="relative aspect-video overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Play circle trigger overlay */}
                  <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/20 transition-all flex items-center justify-center">
                    <button
                      id={`play-home-v-${video.id}`}
                      onClick={() => handleOpenVideo(video)}
                      className="p-3.5 rounded-full bg-indigo-600 text-white scale-90 group-hover:scale-105 opacity-95 group-hover:opacity-100 shadow-xl transition-all cursor-pointer"
                    >
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </button>
                  </div>

                  <span className="absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-wider bg-black/90 px-2 py-0.5 text-white/65 rounded-none border border-white/5">
                    {video.duration}
                  </span>
                </div>

                {/* Metadata content */}
                <div className="p-5 text-left flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-white/40 font-mono text-[9px] uppercase tracking-wider">
                      {video.type.replace('-', ' ')}
                    </p>
                    <h3 className="text-white text-sm font-light font-sans tracking-wider leading-snug uppercase">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest">
                    <span>Year: {video.releaseYear}</span>
                    <span>HD 1080P</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Biography Sneak Peek */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-bio-sneak">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative max-w-md mx-auto aspect-[3/4] rounded-none overflow-hidden transition-all duration-700 border border-white/10 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
                alt="Aria Vance Portrait Shot"
                className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-none bg-black/85 border border-white/10 backdrop-blur-md">
                <p className="font-mono text-white/90 text-xs uppercase tracking-widest font-semibold">Aria Vance</p>
                <p className="text-white/40 text-[10px] font-mono tracking-wider mt-1.5">SINGER | SONGWRITER | ARRANGER</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">The Story</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
              About Aria Vance
            </h2>
            <div className="h-[1px] w-12 bg-white/20" />
            
            <p className="text-white/70 text-base sm:text-lg leading-relaxed font-light tracking-wide">
              {ARTIST_INFO.bioIntro}
            </p>

            <p className="text-white/50 text-sm leading-relaxed font-light tracking-wide">
              {ARTIST_INFO.bioFull[1]}
            </p>

            <div className="pt-4">
              <button
                id="home-about-readmore"
                onClick={() => onNavigate('about')}
                className="px-6 py-3 border border-white/10 hover:border-white/30 text-white font-sans text-[10px] tracking-widest uppercase transition-colors rounded-none cursor-pointer inline-flex items-center space-x-2"
              >
                <span>Read Full Biography</span>
                <ArrowRight className="h-3 w-3 text-white/40" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Integrated Newsletter Form Bottom */}
      <section className="bg-black/20 border-t border-white/5 py-16" id="home-newsletter">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="flex justify-center">
            <div className="p-4 rounded-full border border-white/10 bg-black">
              <Mail className="h-6 w-6 text-white/60" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="font-sans text-2xl sm:text-3xl text-white uppercase tracking-widest font-light">Join the Inner Circle</h2>
            <p className="text-white/60 text-sm max-w-md mx-auto font-light leading-relaxed tracking-wide">
              Receive early pre-release access to tracks, secret ticket presale invites, and hand-written updates sent directly from Aria’s desk.
            </p>
          </div>

          <form onSubmit={handleSubmitNewsletter} className="max-w-md mx-auto" id="home-email-signup-form">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading}
                className="flex-grow px-4 py-3 rounded-none bg-neutral-950 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors text-left"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-neutral-950 font-sans text-[10px] tracking-widest uppercase font-semibold hover:bg-neutral-200 transition-colors duration-200 rounded-none cursor-pointer disabled:opacity-50 inline-flex items-center justify-center space-x-2"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>

            {/* Status alerts */}
            {status.type !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-none text-xs font-mono text-center ${
                  status.type === 'success' 
                    ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10' 
                    : 'bg-red-950/20 text-red-200 border border-red-500/10'
                }`}
              >
                {status.message}
              </motion.div>
            )}
          </form>
        </div>
      </section>

      {/* 100% Compliant Simulated Video Player Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            id="video-player-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-black border border-white/10 rounded-none overflow-hidden w-full max-w-4xl shadow-2xl relative"
            >
              
              {/* Header bar controls */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black">
                <div className="text-left">
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-[0.25em]">{activeVideo.type.replace('-', ' ')}</p>
                  <h4 className="text-white text-sm font-semibold tracking-wider uppercase truncate max-w-md sm:max-w-xl">{activeVideo.title}</h4>
                </div>
                <button
                  id="lightbox-close-btn"
                  onClick={handleCloseVideo}
                  className="p-2 border border-white/10 hover:border-white rounded-none text-white/50 hover:text-white transition-colors cursor-pointer bg-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Interactive simulated player screen */}
              <div className="relative aspect-video bg-neutral-950/80 group">
                <img
                  src={activeVideo.thumbnailUrl}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover brightness-30"
                  referrerPolicy="no-referrer"
                />

                {/* Animated music visual waves overlays inside screens */}
                {isPlayingSim && (
                  <div className="absolute inset-0 flex items-center justify-center space-x-1 bg-black/30 pointer-events-none">
                    <span className="w-1 bg-white/40 rounded-full animate-[bounce_1s_infinite_100ms]" style={{ height: '20%' }} />
                    <span className="w-1 bg-white/45 rounded-full animate-[bounce_1s_infinite_300ms]" style={{ height: '60%' }} />
                    <span className="w-1 bg-white/50 rounded-full animate-[bounce_1s_infinite_400ms]" style={{ height: '70%' }} />
                    <span className="w-1 bg-white/45 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ height: '50%' }} />
                    <span className="w-1 bg-white/40 rounded-full animate-[bounce_1s_infinite_600ms]" style={{ height: '40%' }} />
                  </div>
                )}

                {/* Center play status icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {isPlayingSim ? (
                    <div className="p-5 rounded-full bg-black/80 border border-white/10 text-white animate-pulse">
                      <PlayCircle className="h-8 w-8 text-white/80" />
                    </div>
                  ) : (
                    <div className="p-5 rounded-full bg-white text-black">
                      <Play className="h-8 w-8 fill-current translate-x-0.5" />
                    </div>
                  )}
                </div>

                {/* Simulated interactive player dashboard overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col space-y-3">
                  
                  {/* Slider scrub bar */}
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-[9px] text-[#FAFAFA]/40">01:04</span>
                    <div 
                      className="flex-grow h-1 bg-white/20 rounded-none relative cursor-pointer"
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const p = Math.floor(((e.clientX - r.left) / r.width) * 100);
                        setPlaybackProgress(p);
                      }}
                    >
                      <div className="absolute top-0 bottom-0 left-0 bg-white" style={{ width: `${playbackProgress}%` }} />
                      <div className="absolute h-3 w-3 bg-white border border-neutral-900 rounded-none -top-1 shadow cursor-pointer transition-transform hover:scale-110" style={{ left: `calc(${playbackProgress}% - 6px)` }} />
                    </div>
                    <span className="font-mono text-[9px] text-white/40">{activeVideo.duration}</span>
                  </div>

                  {/* Operational indicators bar */}
                  <div className="flex items-center justify-between text-[10px] text-white/40 font-mono uppercase tracking-widest">
                    <div className="flex items-center space-x-4 font-mono">
                      <button
                        onClick={() => setIsPlayingSim(!isPlayingSim)}
                        className="text-white hover:text-white/80 font-bold transition-all uppercase cursor-pointer"
                      >
                        {isPlayingSim ? 'Pause Video' : 'Resume Video'}
                      </button>
                      <span className="text-white/10">|</span>
                      <div className="flex items-center space-x-1.5">
                        <Volume2 className="h-3.5 w-3.5 text-white/40" />
                        <span>Stereo Output Active</span>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-[#FAFAFA]/30" />
                      <span>Simulated Live Room Stream</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Explanatory footer credits */}
              <div className="p-6 bg-black border-t border-white/10 text-left space-y-2">
                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">DIRECTED BY ARIA VANCE WITH BROOKLYN DIRECT STUDIO</p>
                <p className="text-white/70 text-sm font-light leading-relaxed">{activeVideo.description}</p>
                <p className="text-[9px] text-white/25 font-mono pt-2 uppercase tracking-wide">
                  All rights reserved. Embed sequences are simulated for safe execution inside sandboxed frames.
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

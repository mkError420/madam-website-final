/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Share2, Volume2, ListMusic, Music, Heart, Star, ExternalLink, HelpCircle, Volume, Volume1, VolumeX, Layers } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence, useScroll, useVelocity, useTransform, useSpring } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, PresentationControls, Text3D, Center } from '@react-three/drei';

const Audio3DScene = ({ isPlaying }: { isPlaying: boolean }) => {
  const meshRef = useRef<any>(null);

  return (
    <Canvas className="h-full w-full">
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <PresentationControls global rotation={[0.13, 0.1, 0]} polar={[-0.4, 0.2]} azimuth={[-1, 0.75]} config={{ mass: 2, tension: 400 }}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2, 2, 0.05, 64]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
            {/* Center label */}
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.7, 0.7, 0.01, 32]} />
              <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.2} />
            </mesh>
          </mesh>
        </Float>
      </PresentationControls>
    </Canvas>
  );
};

interface AudioViewProps {
  albums: any[];
  categories: string[];
  activeTrackId: string | null;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  onPauseTrack: () => void;
  getPlayerAnalyser: () => AnalyserNode | null;
  currentTime: number;
  duration: number;
  volume: number;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function AudioView({ albums, categories, activeTrackId, isPlaying, onPlayTrack, onPauseTrack, getPlayerAnalyser, currentTime, duration, volume, onSeek, onVolumeChange }: AudioViewProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lyricsTrack, setLyricsTrack] = useState<Track | null>(null);
  const [favoriteTracks, setFavoriteTracks] = useState<string[]>(['ss_1']); // default pre-favorite
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // 3D Plane Scroll Velocity Logic
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const velocityRotate = useTransform(smoothVelocity, [-2000, 2000], [-10, 10]);
  const velocitySkew = useTransform(smoothVelocity, [-2000, 2000], [-4, 4]);

  const filteredAlbums = activeCategory === 'All' 
    ? albums 
    : albums.filter(alb => alb.category === activeCategory);

  useEffect(() => {
    if (albums.length > 0 && !selectedAlbum) {
      setSelectedAlbum(albums[0]);
    }
  }, [albums, selectedAlbum]);

  // Auto-set the active track's parent album as the selected album for easy viewability
  useEffect(() => {
    if (activeTrackId && albums.length > 0) {
      const parentAlbum = albums.find(alb => alb.tracks.some((tr: any) => tr.id === activeTrackId));
      if (parentAlbum) {
        setSelectedAlbum(parentAlbum);
      }
    }
  }, [activeTrackId, albums]);

  // If selectedAlbum is not in filteredAlbums, auto-select the first one
  useEffect(() => {
    if (filteredAlbums.length > 0 && selectedAlbum && !filteredAlbums.find(a => a.id === selectedAlbum.id)) {
      setSelectedAlbum(filteredAlbums[0]);
    }
  }, [filteredAlbums, selectedAlbum]);

  // Combined Active Track Finder
  const allTracks = albums.flatMap(alb => alb.tracks || []);
  const activeTrack = allTracks.find(t => t.id === activeTrackId);

  // 100% Real Interactive Canvas audio visualizer
  useEffect(() => {
    let ctx: CanvasRenderingContext2D | null = null;
    const canvas = canvasRef.current;
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    const draw = () => {
      if (!canvas || !ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const analyserNode = getPlayerAnalyser();
      
      if (isPlaying && activeTrackId && analyserNode) {
        // Draw real frequency / wave visualizer
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        // Styling visualizer (Sleek minimalist white waveform)
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#fafafa'; 
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0; // normalized signal
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Draw soft frequency pulses at the bottom
        const freqArray = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(freqArray);
        ctx.fillStyle = 'rgba(250, 250, 250, 0.04)';
        for (let i = 0; i < bufferLength; i += 4) {
          const barHeight = (freqArray[i] / 255) * height * 0.45;
          const barWidth = (width / bufferLength) * 4;
          const barX = (i / bufferLength) * width;
          ctx.fillRect(barX, height - barHeight, barWidth, barHeight);
        }

      } else {
        // Slow soothing mock sinus wave when idle (Clean subtle white/20 line)
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(250, 250, 250, 0.25)'; 
        ctx.beginPath();
        
        const time = Date.now() * 0.003;
        for (let i = 0; i < width; i++) {
          const y = height / 2 + Math.sin(i * 0.015 + time) * 10 + Math.cos(i * 0.005 - time) * 3;
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeTrackId]);

  const handleToggleFav = (trackId: string) => {
    if (favoriteTracks.includes(trackId)) {
      setFavoriteTracks(favoriteTracks.filter(id => id !== trackId));
    } else {
      setFavoriteTracks([...favoriteTracks, trackId]);
    }
  };

  const handleShare = (track: Track) => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listen to "${track.title}" by Aria Vance`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Copied sharing link to clipboard: Aria Vance - ${track.title}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 select-none overflow-hidden" id="audio-container">
      
      {/* 1. Page Title */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4 text-left">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Discography</span>
        <h1 className="font-sans text-4xl sm:text-6xl font-light text-white uppercase tracking-widest">
          Audios & <span className="italic font-serif font-light lowercase text-white/90">releases</span>
        </h1>
      </motion.div>

      {/* 2. Global Synthesized Player Canvas Widget */}
      <motion.div 
        style={{ rotateX: velocityRotate, transformPerspective: 1200 }}
        className="bg-neutral-950 border border-white/5 rounded-none p-6 sm:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.7)] space-y-8 relative group" 
        id="audio-master-player"
      >
        <div className="absolute top-0 right-0 p-4">
          <Layers className="h-4 w-4 text-white/10" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 text-left w-full sm:w-1/3">
            <div className="h-24 w-24 relative hidden lg:block">
               <Audio3DScene isPlaying={isPlaying} />
            </div>
            <div className="min-w-0">
              {activeTrack ? (
                <p className="text-white text-sm font-semibold tracking-widest uppercase truncate">{activeTrack.title}</p>
              ) : (
                <p className="text-white/50 text-sm font-medium">Player Idle</p>
              )}
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider mt-1">
                {activeTrack ? (isPlaying ? 'Now Playing' : 'Paused') : 'Select a track'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              disabled={!activeTrackId}
              onClick={isPlaying ? onPauseTrack : () => onPlayTrack(activeTrackId!)}
              className="p-6 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="w-full sm:w-1/3 flex items-center justify-end space-x-3">
            <div className="h-12 w-full max-w-[150px] bg-black/40 rounded-none border border-white/10 overflow-hidden relative hidden md:block">
              <canvas ref={canvasRef} width={150} height={48} className="w-full h-full block" />
              <span className="absolute bottom-0.5 right-1.5 font-mono text-[7px] uppercase text-white/20">
                {isPlaying ? 'SIGNAL' : 'IDLE'}
              </span>
            </div>
            <div className="group flex items-center space-x-2">
              <button onClick={() => onVolumeChange(volume > 0 ? 0 : 0.5)}>
                {volume === 0 ? <VolumeX className="h-4 w-4 text-white/50"/> : volume < 0.5 ? <Volume1 className="h-4 w-4 text-white/50"/> : <Volume2 className="h-4 w-4 text-white/50"/>}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-0 group-hover:w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer transition-all duration-300 accent-white"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <span className="font-mono text-[10px] text-white/40 w-10 text-right">{formatTime(currentTime)}</span>
          <div className="flex-grow relative group/slider">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onInput={(e) => onSeek(Number(e.currentTarget.value))}
              disabled={!activeTrackId}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 disabled:cursor-not-allowed"
            />
          </div>
          <span className="font-mono text-[10px] text-white/40 w-10 text-left">{formatTime(duration)}</span>
        </div>

        {!activeTrackId ? (
          <div className="text-center pt-2">
            <button
                onClick={() => onPlayTrack(albums.length > 0 && albums[0].tracks ? albums[0].tracks[0].id : '')}
                disabled={albums.length === 0}
                className="px-4 py-2 bg-white/10 text-white/80 hover:bg-white/20 cursor-pointer text-[9px] font-mono uppercase font-semibold rounded-none transition-all flex items-center space-x-2 mx-auto disabled:opacity-50"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Audition Default Track</span>
              </button>
          </div>
            ) : (
              <div className="h-8" />
            )
        }
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 items-center border-b border-white/10 pb-4" id="audio-filters">
        <ListMusic className="h-4 w-4 text-white/30 mr-2 hidden sm:block" />
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setLyricsTrack(null); }}
              className={`px-5 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all cursor-pointer rounded-none border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-transparent text-white/45 border-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Audio & Tracks Selection Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 [perspective:2000px]" id="music-explore-grid">
        
        {/* Left: Album Navigation List */}
        <motion.div 
          style={{ rotateY: velocityRotate, transformPerspective: 1200 }}
          className="lg:col-span-4 space-y-6 text-left"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Select Release</span>
          <div className="space-y-3">
            {filteredAlbums.length === 0 ? (
              <p className="text-white/40 text-xs font-mono">No albums in this category.</p>
            ) : filteredAlbums.map((alb) => (
              <button
                key={alb.id}
                id={`album-select-btn-${alb.id}`}
                onClick={() => { setSelectedAlbum(alb); setLyricsTrack(null); }}
                className={`w-full p-5 rounded-none border text-left transition-all duration-500 flex items-center space-x-4 cursor-pointer group/alb ${
                  selectedAlbum && selectedAlbum.id === alb.id
                    ? 'bg-white/5 border-indigo-500/50'
                    : 'bg-transparent border-white/10 hover:bg-white/5'
                }`}
              >
                <motion.img 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={alb.coverUrl} 
                  alt={alb.title} 
                  className="w-12 h-12 object-cover rounded-none border border-white/5"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-white text-sm font-semibold tracking-wider uppercase">{alb.title}</h3>
                  <p className="text-white/40 text-[10px] font-mono tracking-widest uppercase mt-0.5">{alb.type} • {alb.releaseYear}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Explanatory Help Widget for Users */}
          <div className="border border-white/10 rounded-none p-5 space-y-2 text-xs text-white/50 bg-black/30">
            <h4 className="font-sans font-light uppercase tracking-widest text-[#FAFAFA] flex items-center space-x-1.5">
              <HelpCircle className="h-4 w-4 text-white/50" />
              <span>Interactive Synthesizer</span>
            </h4>
            <p className="leading-relaxed text-white/40 font-light">
              Let the built-in HTML5 sound oscillators play custom-generated neo-soul and ambient melodies in real time!
            </p>
          </div>
        </motion.div>

        {/* Right: Tracks List inside Selected Album / lyrics panels */}
        <div className="lg:col-span-8 space-y-8 text-left">
          
          {selectedAlbum ? (
            <>
          {/* Header Description of Album */}
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">{selectedAlbum.type} details</span>
              <h2 className="font-sans font-light text-2xl text-white tracking-widest uppercase">{selectedAlbum.title}</h2>
              <p className="text-xs text-white/50 font-light leading-relaxed tracking-wide mt-1">{selectedAlbum.description}</p>
            </div>

            {/* Platform links */}
            <div className="flex items-center space-x-3 text-xs font-mono">
              <a 
                href={selectedAlbum.streaming.spotify} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 border border-white/10 text-white/55 hover:text-white hover:border-white/30 rounded-full transition-colors"
                title="Spotify Album"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {selectedAlbum.streaming.appleMusic && (
                <a 
                  href={selectedAlbum.streaming.appleMusic} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 border border-white/10 text-white/45 hover:text-white hover:border-white/30 rounded-full transition-colors"
                  title="Apple Music Album"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Tracklist table */}
          <div className="space-y-3 border border-white/5 rounded-none overflow-hidden">
            <div className="bg-neutral-900/50 grid grid-cols-12 gap-2 p-4 font-mono text-[9px] text-white/40 uppercase tracking-[0.25em] border-b border-white/5">
              <div className="col-span-1 text-center font-bold">#</div>
              <div className="col-span-5 sm:col-span-6">Title</div>
              <div className="col-span-3 text-right">Plays</div>
              <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-white/5 bg-black/20" id="tracks-table-body">
              <AnimatePresence mode="popLayout">
                {selectedAlbum.tracks.map((track, index) => {
                const isSelectedAndPlaying = isPlaying && activeTrackId === track.id;
                const isSelected = activeTrackId === track.id;
                const isFavorite = favoriteTracks.includes(track.id);
                return (
                  <motion.div 
                    key={track.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ rotateX: velocityRotate, skewY: velocitySkew, transformPerspective: 1000 }}
                    id={`track-row-${track.id}`}
                    className={`grid grid-cols-12 gap-2 p-5 items-center hover:bg-indigo-900/10 transition-all duration-300 group/row ${
                      isSelected ? 'bg-indigo-950/20 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    {/* Index or active sound icon */}
                    <div className="col-span-1 text-center font-mono text-xs text-white/45">
                      {isSelectedAndPlaying ? (
                        <div className="inline-flex space-x-0.5 items-end h-4">
                          <span className="w-[2px] h-4 bg-indigo-400 animate-[bounce_1s_infinite_100ms] rounded-full" />
                          <span className="w-[2px] h-3 bg-indigo-400 animate-[bounce_1s_infinite_400ms] rounded-full" />
                          <span className="w-[2px] h-3.5 bg-indigo-400 animate-[bounce_1s_infinite_200ms] rounded-full" />
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Title & lyrics toggle shortcut */}
                    <div className="col-span-5 sm:col-span-6">
                      <p className={`text-sm font-medium tracking-wide uppercase ${isSelected ? 'text-white font-bold' : 'text-white/80'}`}>
                        {track.title}
                      </p>
                      <button
                        id={`lyrics-toggle-${track.id}`}
                        onClick={() => setLyricsTrack(lyricsTrack?.id === track.id ? null : track)}
                        className="text-[10px] text-white/40 font-mono hover:text-white hover:underline mt-0.5 pointer-events-auto uppercase tracking-wider"
                      >
                        {lyricsTrack?.id === track.id ? 'Hide Poetry' : 'View Lyrics'}
                      </button>
                    </div>

                    {/* Plays counter */}
                    <div className="col-span-3 text-right font-mono text-[10px] text-white/30 tracking-widest uppercase">
                      {track.plays}
                    </div>

                    {/* Action toggles */}
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end space-x-2">
                      <button
                        id={`track-fav-${track.id}`}
                        onClick={() => handleToggleFav(track.id)}
                        className={`p-1.5 rounded-full transition-colors pointer-events-auto hover:bg-white/5 ${
                          isFavorite ? 'text-indigo-400 hover:text-indigo-300' : 'text-neutral-500 hover:text-white'
                        }`}
                        title="Favorite"
                      >
                        <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        id={`track-play-toggle-${track.id}`}
                        onClick={() => isSelectedAndPlaying ? onPauseTrack() : onPlayTrack(track.id)}
                        className={`p-2.5 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all ${
                          isSelectedAndPlaying ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30'
                        }`}
                        title={isSelectedAndPlaying ? 'Pause' : 'Play Audition'}
                      >
                        {isSelectedAndPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current ml-0.5" />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          </div>

          {/* Sub Panels: Lyrics display container */}
          {lyricsTrack && (
            <div className="border border-white/10 bg-[#050505] rounded-none p-6 space-y-3" id="lyrics-drawer">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">POETIC LYRICS: {lyricsTrack.title}</span>
                <button 
                  onClick={() => setLyricsTrack(null)}
                  className="font-mono text-[9px] text-white/55 hover:text-white uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
              <p className="text-white/90 text-sm leading-relaxed italic whitespace-pre-line font-light font-serif" id="lyrics-content">
                {lyricsTrack.lyrics || "Poetry elements are loading..."}
              </p>
              <p className="text-[9px] text-white/30 font-mono text-right font-light tracking-wide uppercase">
                © {selectedAlbum.releaseYear} Aria Vance Music Ltd. All Rights Reserved.
              </p>
            </div>
          )}

            </>
          ) : (
            <div className="border border-white/10 rounded-none p-6 text-center text-white/40 font-mono text-xs">
               Select an album to view its tracks.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

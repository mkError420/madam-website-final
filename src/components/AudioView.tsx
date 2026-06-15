/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Share2, Volume2, ListMusic, Music, Heart, Star, ExternalLink, HelpCircle } from 'lucide-react';
import { Track } from '../types';
import { getAnalyser } from '../utils/synth';

interface AudioViewProps {
  albums: any[];
  categories: string[];
  activeTrackId: string | null;
  onPlayTrack: (trackId: string) => void;
  onPauseTrack: () => void;
}

export default function AudioView({ albums, categories, activeTrackId, onPlayTrack, onPauseTrack }: AudioViewProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lyricsTrack, setLyricsTrack] = useState<Track | null>(null);
  const [favoriteTracks, setFavoriteTracks] = useState<string[]>(['ss_1']); // default pre-favorite
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

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

      const analyserNode = getAnalyser();
      
      if (activeTrackId && analyserNode) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 select-none" id="audio-container">
      
      {/* 1. Page Title */}
      <div className="space-y-4 text-left">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Discography</span>
        <h1 className="font-sans text-4xl sm:text-6xl font-light text-white uppercase tracking-widest">
          Audios & <span className="italic font-serif font-light lowercase text-white/90">releases</span>
        </h1>
        <div className="h-[1px] w-20 bg-white/20" />
      </div>

      {/* 2. Global Synthesized Player Canvas Widget */}
      <div className="bg-[#050505] border border-white/10 rounded-none p-6 sm:p-8 backdrop-blur-md" id="audio-master-player">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Metadata */}
          <div className="lg:col-span-4 flex items-center space-x-5 text-left">
            <div className={`p-4 rounded-full bg-black border border-white/10 ${activeTrackId ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
              <Disc className="h-10 w-10 text-white/60 animate-pulse" />
            </div>
            <div>
              {activeTrack ? (
                <>
                  <p className="text-white text-sm font-semibold tracking-widest uppercase">{activeTrack.title}</p>
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider mt-1">Synthesizing live: key mapped tone</p>
                </>
              ) : (
                <>
                  <p className="text-white/50 text-sm font-medium">No track currently auditing</p>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mt-1">Select a song from tracklists below</p>
                </>
              )}
            </div>
          </div>

          {/* Real-time Oscillating Canvas */}
          <div className="lg:col-span-5 h-20 bg-black/40 rounded-none border border-white/10 overflow-hidden relative">
            <canvas ref={canvasRef} width={500} height={80} className="w-full h-full block" />
            <span className="absolute bottom-1 right-2 font-mono text-[8px] uppercase tracking-wider text-white/25">
              {activeTrackId ? 'Stereo Wave signal analyzer' : 'Idle pulse'}
            </span>
          </div>

          {/* Quick Controls */}
          <div className="lg:col-span-3 flex items-center justify-center lg:justify-end space-x-6">
            {activeTrackId ? (
              <button
                id="master-player-pause"
                onClick={onPauseTrack}
                className="px-6 py-3.5 border border-white/30 hover:border-white text-white hover:bg-white/5 cursor-pointer text-[10px] font-mono uppercase font-semibold rounded-none active:scale-95 transition-all flex items-center space-x-2"
              >
                <Pause className="h-4 w-4" />
                <span>Pause stream</span>
              </button>
            ) : (
              <button
                id="master-player-play-default"
                onClick={() => onPlayTrack(albums.length > 0 && albums[0].tracks ? albums[0].tracks[0].id : '')}
                disabled={albums.length === 0}
                className="px-6 py-3.5 bg-white text-neutral-950 hover:bg-neutral-200 cursor-pointer text-[10px] font-mono uppercase font-semibold rounded-none active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current ml-0.5" />
                <span>audition default</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 items-center border-b border-white/10 pb-4" id="audio-filters">
        <ListMusic className="h-4 w-4 text-white/30 mr-2 hidden sm:block" />
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setLyricsTrack(null); }}
              className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer rounded-none border ${
                isActive
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/45 border-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Audio & Tracks Selection Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4" id="music-explore-grid">
        
        {/* Left: Album Navigation List */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Select Release</span>
          <div className="space-y-3">
            {filteredAlbums.length === 0 ? (
              <p className="text-white/40 text-xs font-mono">No albums in this category.</p>
            ) : filteredAlbums.map((alb) => (
              <button
                key={alb.id}
                id={`album-select-btn-${alb.id}`}
                onClick={() => { setSelectedAlbum(alb); setLyricsTrack(null); }}
                className={`w-full p-4 rounded-none border text-left transition-all duration-300 flex items-center space-x-4 cursor-pointer ${
                  selectedAlbum && selectedAlbum.id === alb.id
                    ? 'bg-white/5 border-white/20'
                    : 'bg-transparent border-white/10 hover:bg-white/5'
                }`}
              >
                <img 
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
        </div>

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
          <div className="space-y-2 border border-white/10 rounded-none overflow-hidden">
            <div className="bg-black/40 grid grid-cols-12 gap-2 p-3 font-mono text-[9px] text-white/40 uppercase tracking-[0.25em] border-b border-white/10">
              <div className="col-span-1 text-center font-bold">#</div>
              <div className="col-span-5 sm:col-span-6">Title</div>
              <div className="col-span-3 text-right">Plays</div>
              <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-white/5 bg-black/10" id="tracks-table-body">
              {selectedAlbum.tracks.map((track, index) => {
                const isSelected = activeTrackId === track.id;
                const isFavorite = favoriteTracks.includes(track.id);
                return (
                  <div 
                    key={track.id} 
                    id={`track-row-${track.id}`}
                    className={`grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-colors ${
                      isSelected ? 'bg-white/5' : ''
                    }`}
                  >
                    {/* Index or active sound icon */}
                    <div className="col-span-1 text-center font-mono text-sm text-white/45">
                      {isSelected ? (
                        <div className="inline-flex space-x-0.5 items-end h-3">
                          <span className="w-[2px] h-3 bg-white animate-[bounce_1s_infinite_100ms] rounded-full" />
                          <span className="w-[2px] h-2.5 bg-white animate-[bounce_1s_infinite_400ms] rounded-full" />
                          <span className="w-[2px] h-2.5 bg-white animate-[bounce_1s_infinite_200ms] rounded-full" />
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
                        className={`p-1.5 rounded-full transition-colors pointer-events-auto ${
                          isFavorite ? 'text-white hover:text-white/50' : 'text-neutral-500 hover:text-white'
                        }`}
                        title="Favorite"
                      >
                        <Heart className="h-3.5 w-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        id={`track-play-toggle-${track.id}`}
                        onClick={() => isSelected ? onPauseTrack() : onPlayTrack(track.id)}
                        className={`p-2 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                          isSelected ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                        }`}
                        title={isSelected ? 'Pause' : 'Play Audition'}
                      >
                        {isSelected ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current ml-0.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
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

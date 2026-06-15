/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, PlayCircle, Info, Calendar, Clock, X, Volume2, ShieldAlert } from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface VideoViewProps {
  videos: Video[];
}

export default function VideoView({ videos }: VideoViewProps) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isPlayingSim, setIsPlayingSim] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(25); // initial simulated status

  const handleOpenVideo = (video: Video) => {
    setActiveVideo(video);
    setIsPlayingSim(true);
    setPlaybackProgress(Math.floor(Math.random() * 20));
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    setIsPlayingSim(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 select-none" id="video-container">
      
      {/* Page Title */}
      <div className="space-y-4 text-left">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Visuals</span>
        <h1 className="font-sans text-4xl sm:text-6xl font-light text-white uppercase tracking-widest">
          Music Videos & <span className="italic font-serif font-light lowercase text-white/90">cinema</span>
        </h1>
        <div className="h-[1px] w-20 bg-white/20" />
      </div>

      {/* Grid of Video Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8" id="videos-grid">
        {videos.length === 0 ? (
           <div className="col-span-3 text-center text-white/40 font-mono text-xs py-12">
              No videos available. Check back soon.
           </div>
        ) : videos.map((video) => (
          <motion.div
            key={video.id}
            id={`video-card-${video.id}`}
            whileHover={{ y: -6 }}
            className="group bg-[#050505] border border-white/10 rounded-none overflow-hidden flex flex-col justify-between"
          >
            {/* Aspect Thumbnail Container */}
            <div className="relative aspect-video overflow-hidden bg-black flex items-center justify-center">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Play overlays */}
              <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/20 transition-all flex items-center justify-center">
                <button
                  id={`play-vcard-${video.id}`}
                  onClick={() => handleOpenVideo(video)}
                  className="p-4 rounded-full bg-white text-black scale-90 group-hover:scale-110 opacity-90 group-hover:opacity-100 shadow-xl transition-all cursor-pointer"
                >
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </button>
              </div>

              {/* Time Label */}
              <span className="absolute bottom-2.5 right-2.5 font-mono text-[9px] uppercase tracking-wider bg-black/90 px-2 py-0.5 text-white/60 rounded-none border border-white/5">
                {video.duration}
              </span>
            </div>

            {/* Video description metadata */}
            <div className="p-6 text-left space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/60 px-2.5 py-1 border border-white/10 bg-white/5 rounded-none inline-block">
                  {video.type.replace('-', ' ')}
                </span>
                <h3 className="text-white text-base font-light font-sans tracking-wider pt-2 leading-snug uppercase">
                  {video.title}
                </h3>
                <p className="text-white/50 text-xs font-light leading-relaxed tracking-wide">
                  {video.description}
                </p>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="h-3.5 w-3.5 text-white/55" />
                  <span>{video.releaseYear}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{video.duration}</span>
                </span>
              </div>
            </div>
            
          </motion.div>
        ))}
      </section>

      {/* 100% Compliant Simulated Video Player Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            id="video-player-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
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
                  className="p-2 border border-white/10 hover:border-white rounded-none text-white/50 hover:text-white transition-colors cursor-pointer"
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
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsPlayingSim(!isPlayingSim)}
                        className="text-white hover:text-white/80 font-bold transition-all uppercase cursor-pointer"
                      >
                        {isPlayingSim ? 'Pause Video' : 'Resume Video'}
                      </button>
                      <span className="text-white/10">|</span>
                      <div className="flex items-center space-x-1.5">
                        <Volume2 className="h-3.5 w-3.5 text-white/40" />
                        <span>Analog Stereo Output Enabled</span>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-[#FAFAFA]/30" />
                      <span>Simulated Live Session Stream</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Explanatory footer credits */}
              <div className="p-6 bg-black border-t border-white/10 text-left space-y-2">
                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">DIRECTED BY ARIA VANCE WITH BROOKLYN DIRECT STUDIO</p>
                <p className="text-white/70 text-sm font-light leading-relaxed">{activeVideo.description}</p>
                <p className="text-[9px] text-white/25 font-mono pt-2 uppercase tracking-wide">
                  All rights reserved. Embed sequences are simulated for safe local execution inside sandboxed frames.
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

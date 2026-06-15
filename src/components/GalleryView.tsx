/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Image as ImageIcon, Sparkles, Sliders } from 'lucide-react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

type FilterCategory = 'all' | 'stage' | 'studio' | 'editorial' | 'backstage';

export default function GalleryView() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Group items by filter
  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const categories: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All Photos' },
    { id: 'stage', label: 'Live on Stage' },
    { id: 'studio', label: 'Studio Echoes' },
    { id: 'editorial', label: 'Art Press' },
    { id: 'backstage', label: 'Backstage' },
  ];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIdx = (lightboxIndex + 1) % filteredItems.length;
    setLightboxIndex(nextIdx);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const prevIdx = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxIndex(prevIdx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 select-none" id="gallery-container">
      
      {/* Page Title & Caption */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Echoes in Pixels</span>
          <h1 className="font-sans text-4xl sm:text-6xl font-light text-white uppercase tracking-widest animate-pulse">
            Photo <span className="italic font-serif font-light lowercase text-white/95">gallery</span>
          </h1>
          <div className="h-[1px] w-20 bg-white/20" />
        </div>
        <p className="text-white/50 font-light text-xs sm:text-sm max-w-sm text-left md:text-right leading-relaxed tracking-wide">
          Analog grain, fleeting silhouettes, and the quiet spaces between performances. Archival photographs curated by Aria.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center border-b border-white/10 pb-4" id="gallery-filters">
        <Sliders className="h-4 w-4 text-white/30 mr-2 hidden sm:block" />
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => { setActiveCategory(cat.id); setLightboxIndex(null); }}
              className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer rounded-none border ${
                isActive
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/45 border-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Masonry-like Grid Layout */}
      <section className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6" id="gallery-masonry-grid">
        {filteredItems.map((item, idx) => {
          return (
            <motion.div
              key={item.id}
              id={`gallery-item-${item.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.015 }}
              onClick={() => setLightboxIndex(idx)}
              className="break-inside-avoid relative rounded-none overflow-hidden group cursor-pointer border border-white/10 bg-black/40 flex flex-col mb-6"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-auto object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 block"
                referrerPolicy="no-referrer"
              />

              {/* Hover Caption overlay block */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-left">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/60">{item.category} Session</span>
                <p className="text-white text-xs font-light mt-1 tracking-wide leading-relaxed">{item.caption}</p>
              </div>

              {/* Inline layout fallback info caption for touch screens */}
              <div className="p-3 bg-black/40 border-t border-white/5 sm:hidden text-left">
                <p className="text-white/60 text-xs font-light leading-relaxed truncate">{item.caption}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Lightbox Overlay Controller */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            id="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Close indicator bar */}
            <div className="flex items-center justify-between p-4 bg-transparent select-none">
              <span className="text-white/40 font-mono text-xs uppercase tracking-widest flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-white/40" />
                <span>Photo {lightboxIndex + 1} of {filteredItems.length}</span>
              </span>
              <button
                id="lightbox-close"
                onClick={() => setLightboxIndex(null)}
                className="p-2 border border-white/10 hover:border-white rounded-none text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Middle slider visual viewport */}
            <div className="flex-grow flex items-center justify-between w-full max-w-5xl mx-auto px-1 sm:px-6 relative select-none">
              {/* Prev Button */}
              <button
                id="lightbox-prev"
                onClick={handlePrevImage}
                className="p-3 bg-transparent border border-white/10 hover:border-white text-white/60 hover:text-white rounded-none transition-all z-20 cursor-pointer absolute left-4 sm:left-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              {/* Main Image Container */}
              <div className="mx-auto max-h-[70vh] flex flex-col justify-center items-center p-2 relative z-10 select-all">
                <img
                  src={filteredItems[lightboxIndex].url}
                  alt={filteredItems[lightboxIndex].caption}
                  className="max-h-[65vh] max-w-full object-contain rounded-none border border-white/10 shadow-2xl brightness-95"
                  onClick={(e) => e.stopPropagation()} // halt click escape
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Next Button */}
              <button
                id="lightbox-next"
                onClick={handleNextImage}
                className="p-3 bg-transparent border border-white/10 hover:border-white text-white/60 hover:text-white rounded-none transition-all z-20 cursor-pointer absolute right-4 sm:right-0"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Bottom descriptions text */}
            <div className="p-6 text-center select-none w-full max-w-xl mx-auto">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/65 px-3 py-1 bg-white/5 border border-white/10 rounded-none inline-block">
                Category: {filteredItems[lightboxIndex].category.toUpperCase()}
              </span>
              <h4 className="text-white text-sm sm:text-base font-light tracking-wide mt-4 leading-relaxed font-serif italic" onClick={(e) => e.stopPropagation()}>
                "{filteredItems[lightboxIndex].caption}"
              </h4>
              <p className="text-[10px] text-white/30 font-mono mt-2 uppercase tracking-[0.1em]">
                Use LEFT/RIGHT buttons to navigate • Press closing X anywhere to escape
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

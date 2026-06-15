/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShieldAlert, Award, FileText } from 'lucide-react';
import { ARTIST_INFO } from '../data';
import { motion } from 'motion/react';

export default function AboutView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 select-none text-left" id="about-container">
      
      {/* Page Title */}
      <div className="space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">The Journey</span>
        <h1 className="font-sans text-4xl sm:text-6xl font-light text-white uppercase tracking-widest">
          About Aria <span className="italic font-serif font-light lowercase text-white/90">Vance</span>
        </h1>
        <div className="h-[1px] w-20 bg-white/20" />
      </div>

      {/* Grid Layout: Biography & Big Image */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="bio-layout">
        
        {/* Left Column: Extensive Bio Text */}
        <div className="lg:col-span-7 space-y-8 text-white/75 font-light text-sm sm:text-base leading-relaxed tracking-wide">
          <p className="text-xl text-white font-light italic font-serif leading-relaxed">
            "{ARTIST_INFO.bioIntro}"
          </p>

          {ARTIST_INFO.bioFull.map((paragraph, idx) => (
            <p key={idx} className="hover:text-white transition-colors duration-300">
              {paragraph}
            </p>
          ))}

          {/* Quick Technical/Musical Influences block */}
          <div className="border border-white/10 bg-black/30 rounded-none p-6 space-y-3">
            <h3 className="font-sans text-white text-xs uppercase tracking-widest font-semibold flex items-center space-x-2">
              <Award className="h-4 w-4 text-white/60" />
              <span>Sonic Signatures & Instruments value</span>
            </h3>
            <p className="text-xs text-white/40 font-mono leading-relaxed">
              Vocals: Custom tube mic preamps, double nested layering, whispered tones • Keyboards: Vintage 1973 Fender Rhodes Mk1, native tape-saturation • Acoustic Guitars: Cordoba Nylon, custom contact pickups • Bass: Pure sub-frequencies, vintage analog synth filters.
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Portrait & Specs */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-none grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
              alt="Aria Vance Professional Focus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-neutral-950/20" />
          </div>

          <div className="border border-white/10 rounded-none p-6 space-y-4 bg-black/40" id="bio-technical-card">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FAFAFA]/50">Essential Profiles</span>
            <div className="divide-y divide-white/5 text-xs font-mono">
              <div className="flex justify-between py-2 text-white/50">
                <span>Active Years</span>
                <span className="text-white">2023 - Present</span>
              </div>
              <div className="flex justify-between py-2 text-white/50">
                <span>Primary Genres</span>
                <span className="text-white">Neo-Soul, Minimalist Indie</span>
              </div>
              <div className="flex justify-between py-2 text-white/50">
                <span>Origin</span>
                <span className="text-white">Seattle, WA • Brooklyn, NY</span>
              </div>
              <div className="flex justify-between py-2 text-white/50 items-center">
                <span>Press Kit</span>
                <a 
                  href="#" 
                  className="text-white/95 border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:border-white px-3 py-1 text-[10px] tracking-wider uppercase transition-colors rounded-none inline-flex items-center space-x-1"
                  onClick={(e) => { e.preventDefault(); console.log("EPK download simulation started.") }}
                >
                  <FileText className="h-3 w-3" />
                  <span>EPK PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Press Quotes Section */}
      <section className="space-y-10" id="press-section">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Praise</span>
          <h2 className="font-sans text-2xl sm:text-3xl font-light text-white uppercase tracking-widest">
            Press & Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTIST_INFO.pressQuotes.map((quoteObj, idx) => (
            <motion.div
              key={idx}
              id={`press-quote-card-${idx}`}
              whileHover={{ y: -4 }}
              className="bg-[#050505] border border-white/10 rounded-none p-8 flex flex-col justify-between space-y-6"
            >
              {/* Star Rating */}
              <div className="flex items-center space-x-1 text-white">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 fill-current ${i < Math.floor(quoteObj.rating) ? 'opacity-90' : 'opacity-[0.08]'}`} 
                  />
                ))}
                <span className="text-white/40 text-[10px] font-mono ml-2">({quoteObj.rating.toFixed(1)})</span>
              </div>

              {/* Quotation text */}
              <p className="text-white/85 text-sm font-light italic font-serif leading-relaxed flex-grow">
                "{quoteObj.quote}"
              </p>

              {/* Critic metadata */}
              <div className="border-t border-white/5 pt-4 text-xs font-mono text-left">
                <span className="text-[#FAFAFA]/30 uppercase tracking-widest text-[10px]">Source: </span>
                <span className="text-white/80 lowercase italic font-serif tracking-normal font-medium">{quoteObj.source}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}

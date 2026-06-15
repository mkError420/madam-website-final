/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Landmark, Send, Disc, ExternalLink, Calendar, Instagram, Twitter, Heart } from 'lucide-react';
import { ARTIST_INFO } from '../data';
import { ContactMessage } from '../types';
import { motion } from 'motion/react';

interface ContactViewProps {
  onSendMessage: (name: string, email: string, subject: string, message: string) => ContactMessage;
  onSubscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
}

export default function ContactView({ onSendMessage, onSubscribeNewsletter }: ContactViewProps) {
  // Contact Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageSubmitting, setMessageSubmitting] = useState(false);

  // Newsletter Form
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState<{ type: 'idle' | 'success' | 'error'; msg: string }>({ type: 'idle', msg: '' });
  const [newsLoading, setNewsLoading] = useState(false);

  // Form submit handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

    setMessageSubmitting(true);
    
    setTimeout(() => {
      onSendMessage(name, email, subject, message);
      setMessageSuccess(true);
      setMessageSubmitting(false);
      
      // Clean inputs
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 900);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail.trim()) return;

    setNewsLoading(true);
    setNewsStatus({ type: 'idle', msg: '' });

    try {
      const res = await onSubscribeNewsletter(newsEmail);
      if (res.success) {
        setNewsStatus({ type: 'success', msg: res.message });
        setNewsEmail('');
      } else {
        setNewsStatus({ type: 'error', msg: res.message });
      }
    } catch (err) {
      setNewsStatus({ type: 'error', msg: 'An unexpected issue occurred. Please try again.' });
    } finally {
      setNewsLoading(false);
    }
  };

  const streamingServices = [
    { name: 'Spotify Music', icon: Disc, url: ARTIST_INFO.socials.spotify, desc: 'Listen & Follow on Spotify Artists' },
    { name: 'Apple Music', icon: Disc, url: ARTIST_INFO.socials.appleMusic, desc: 'Download standard & high-res tracks' },
    { name: 'Bandcamp Store', icon: Disc, url: ARTIST_INFO.socials.bandcamp, desc: 'Purchase vinyl merch & tape support' },
    { name: 'Soundcloud Stream', icon: Disc, url: ARTIST_INFO.socials.soundcloud, desc: 'Exclusive acoustic draft demos' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 select-none text-left" id="contact-container">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4 text-left">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Dialogue</span>
          <h1 className="font-sans text-4xl sm:text-6xl font-light text-white uppercase tracking-widest">
            Contact & <span className="italic font-serif font-light lowercase text-white/95">streaming</span>
          </h1>
          <div className="h-[1px] w-20 bg-white/20" />
        </div>
        <p className="text-white/50 font-light text-xs sm:text-sm max-w-sm text-left md:text-right leading-relaxed tracking-wide">
          Open for live bookings, record press reviews, and collaborative soundtracks. Connect natively.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-grids">
        
        {/* Left Grid: Platform connectors */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* General Metadata Info */}
          <div className="space-y-4" id="essential-gigs-agency">
            <h3 className="font-sans text-white text-lg tracking-wider uppercase font-light">Representation</h3>
            <div className="space-y-3 font-mono text-xs text-white/50">
              <div className="flex items-center space-x-3">
                <Landmark className="h-4 w-4 text-white/40" />
                <span>Agency: </span>
                <span className="text-white">Blue Oasis Touring International</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white/40" />
                <span>Press Inquiries: </span>
                <span className="text-white">press@ariavancemusic.com</span>
              </div>
            </div>
          </div>

          {/* Connected Music Streaming Ports */}
          <div className="space-y-4">
            <h3 className="font-sans text-white text-lg tracking-wider uppercase font-light">Streaming Ports</h3>
            <div className="grid grid-cols-1 gap-3">
              {streamingServices.map((serv, index) => {
                const Icon = serv.icon;
                return (
                  <a
                    key={index}
                    id={`stream-card-${index}`}
                    href={serv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-none border border-white/10 bg-black/40 hover:border-white flex items-center justify-between group transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-none border border-white/5 bg-black/40 text-white/40 group-hover:text-white group-hover:border-white/30 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold tracking-wide">{serv.name}</p>
                        <p className="text-white/40 text-xs font-light mt-0.5">{serv.desc}</p>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-white/35 group-hover:text-white transition-colors animate-pulse" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Social icons */}
          <div className="space-y-2 pt-2 text-left">
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">Aesthetic Portfolios</p>
            <div className="flex space-x-3">
              <a href={ARTIST_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 hover:border-white rounded-none text-white/50 hover:text-white transition-all" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={ARTIST_INFO.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 hover:border-white rounded-none text-white/50 hover:text-white transition-all" title="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Grid: Transmitting Forms / sign up forms */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Main Contact Form */}
          <div className="bg-transparent border border-white/10 rounded-none p-6 sm:p-8 space-y-6" id="contact-form-block">
            
            <div className="space-y-1">
              <h3 className="font-sans text-white text-xl font-light uppercase tracking-widest">Send a Message</h3>
              <p className="text-white/40 text-xs font-mono uppercase tracking-wide">Direct transmit logs processed securely</p>
            </div>

            {messageSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-white/5 border border-white/10 text-white rounded-none space-y-4 text-center"
              >
                <div className="p-3 bg-white/5 border border-white/10 rounded-none w-fit mx-auto text-white">
                  <Send className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white text-base font-semibold tracking-wide uppercase">Transmission Successful!</h4>
                  <p className="text-white/60 text-xs font-light max-w-sm mx-auto leading-relaxed">
                    Thank you! Your message was saved under Aria's contact files. Aria vance and her production team will review and reply within 48-72 hours.
                  </p>
                </div>
                <button
                  onClick={() => setMessageSuccess(false)}
                  className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black border-none text-[10px] font-mono tracking-widest rounded-none uppercase transition-all font-semibold pointer-events-auto cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left" id="contact-form">
                
                {/* 2-column input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 focus-within:text-white">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Liam Porter"
                      disabled={messageSubmitting}
                      className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm transition-colors text-left"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-white">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-light">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. liam@porter.org"
                      disabled={messageSubmitting}
                      className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm transition-colors text-left"
                    />
                  </div>
                </div>

                {/* Subject picker */}
                <div className="space-y-1.5 focus-within:text-white">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-light">Subject topic</label>
                  <select
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm transition-all text-left font-mono"
                  >
                    <option value="" disabled className="text-white bg-black">--- Select Inquiry Category ---</option>
                    <option value="Live Booking / Concert Invite" className="text-white bg-black">Live Booking / Concert Invite</option>
                    <option value="Record Label / Publisher Press" className="text-white bg-black">Record Label / Publisher Press</option>
                    <option value="Media Interview Request" className="text-white bg-black">Media Interview Request</option>
                    <option value="General Fan Mail / Praise" className="text-white bg-black">General Fan Mail / Praise</option>
                    <option value="Technical Issue" className="text-white bg-black">Technical Issue</option>
                  </select>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5 focus-within:text-white">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-light">Message details</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write details of your proposal or inquiries here..."
                    disabled={messageSubmitting}
                    className="w-full px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm transition-colors text-left leading-relaxed font-sans"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={messageSubmitting}
                    className="px-6 py-3 bg-white text-black hover:bg-neutral-200 font-sans text-[10px] tracking-widest uppercase font-semibold rounded-none transition-all cursor-pointer flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{messageSubmitting ? 'Transmitting...' : 'Transmit Message'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Secondary Newsletter subscription box */}
          <div className="border border-white/10 rounded-none p-6 sm:p-8 bg-black/40 space-y-4" id="contact-newsletter-subscribe">
            <div className="space-y-1 text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">DIGITAL NEWSLETTER</span>
              <h3 className="font-sans text-lg text-white font-light tracking-wider uppercase mt-1">Subscribe to the echoes</h3>
              <p className="text-white/50 text-xs font-light leading-relaxed tracking-wide">
                We protect your security. Hand-written emails are sent only once a month with exclusive download codes.
              </p>
            </div>

            <form onSubmit={handleNewsSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md text-left pt-2" id="contact-newsletter-form">
              <input
                type="email"
                required
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                placeholder="news.reader@musicblog.com"
                disabled={newsLoading}
                className="flex-grow px-3.5 py-2.5 rounded-none bg-black border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm transition-colors text-left"
              />
              <button
                type="submit"
                disabled={newsLoading}
                className="px-5 py-2.5 bg-white text-black font-sans text-[10px] font-semibold tracking-widest uppercase hover:bg-neutral-200 transition-all rounded-none cursor-pointer disabled:opacity-50"
              >
                {newsLoading ? 'Adding...' : 'Subscribe'}
              </button>
            </form>

            {newsStatus.type !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-none text-xs font-mono text-center max-w-md ${
                  newsStatus.type === 'success'
                    ? 'bg-white/5 text-white border border-white/10'
                    : 'bg-white/5 text-red-400 border border-red-500/35'
                }`}
              >
                {newsStatus.msg}
              </motion.div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

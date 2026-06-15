/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Calendar, Users, Eye, EyeOff, Trash2, Plus, RefreshCw, BarChart2, Check, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { Subscriber, ContactMessage, TourEvent, RSVP } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  subscribers: Subscriber[];
  contacts: ContactMessage[];
  events: TourEvent[];
  rsvps: RSVP[];
  albums: any[];
  audioCategories: string[];
  onAddEvent: (eventData: Omit<TourEvent, 'id'>) => TourEvent;
  onUpdateEventStatus: (id: string, status: TourEvent['status']) => void;
  onDeleteEvent: (id: string) => void;
  onToggleContactRead: (id: string) => void;
  onDeleteContact: (id: string) => void;
  onAddAudioCategory: (category: string) => void;
  onDeleteAudioCategory: (category: string) => void;
  onUpdateAlbumCategory: (id: string, category: string) => void;
}

export default function DashboardView({
  subscribers,
  contacts,
  events,
  rsvps,
  albums,
  audioCategories,
  onAddEvent,
  onUpdateEventStatus,
  onDeleteEvent,
  onToggleContactRead,
  onDeleteContact,
  onAddAudioCategory,
  onDeleteAudioCategory,
  onUpdateAlbumCategory,
}: DashboardViewProps) {
  // New Show Event Form
  const [date, setDate] = useState('2026-09-15');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('USA');
  const [status, setStatus] = useState<TourEvent['status']>('available');
  const [formSuccess, setFormSuccess] = useState(false);
  const [newCat, setNewCat] = useState('');

  // Expanded messages controls
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  // Metrics details
  const totalSubscribers = subscribers.length;
  const unreadMessagesCount = contacts.filter(c => !c.read).length;
  const totalRsvpSeatsAllocated = rsvps.reduce((sum, r) => sum + r.ticketsCount, 0);

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue.trim() || !city.trim() || !country.trim() || !date) return;

    onAddEvent({
      date,
      venue: venue.trim(),
      city: city.trim(),
      country: country.trim(),
      status,
      ticketUrl: '#'
    });

    setFormSuccess(true);
    // Reset Form fields
    setVenue('');
    setCity('');
    setCountry('USA');
    setStatus('available');

    setTimeout(() => {
      setFormSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 select-none text-left" id="admin-dashboard-container">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
        <div className="space-y-4">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Back-Office Portal</span>
          <h1 className="font-sans text-3xl sm:text-5xl font-light text-white uppercase tracking-widest flex items-center space-x-3.5">
            <ShieldAlert className="h-8 w-8 text-white/70 animate-pulse" />
            <span>Artist Control <span className="italic font-serif font-light lowercase text-white/95">panel</span></span>
          </h1>
          <div className="h-[1px] w-20 bg-white/20" />
        </div>
        <div className="mt-4 md:mt-0 px-3 py-2 border border-white/10 bg-white/5 rounded-none font-mono text-xs text-white/65 flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-white/85" />
          <span>Local Storage DB: SINGER_CORE active</span>
        </div>
      </div>

      {/* 3-Value Stat Cards Blocks */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="dashboard-metric-cards">
        
        {/* Metric 1 */}
        <div className="bg-black/35 border border-white/10 rounded-none p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-[0.15em]">Mailing List Subscribers</span>
            <p className="text-3xl font-sans font-light text-white tracking-tight">{totalSubscribers}</p>
            <p className="text-[9px] text-white/50 font-mono uppercase tracking-wide flex items-center space-x-1">
              <span>● Automated opt-in</span>
            </p>
          </div>
          <div className="p-4 rounded-none bg-white/5 text-white/65 border border-white/10">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-black/35 border border-white/10 rounded-none p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-[0.15em]">Contact Request Inbox</span>
            <p className="text-3xl font-sans font-light text-white tracking-tight">{contacts.length}</p>
            <p className="text-[9px] text-white/50 font-mono uppercase tracking-wide">
              {unreadMessagesCount} unread / pending triage
            </p>
          </div>
          <div className="p-4 rounded-none bg-white/5 text-white/65 border border-white/10">
            <Mail className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-black/35 border border-white/10 rounded-none p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-[0.15em]">Event RSVPs & holds</span>
            <p className="text-3xl font-sans font-light text-white tracking-tight">{rsvps.length}</p>
            <p className="text-[9px] text-white/50 font-mono uppercase tracking-wide">
              {totalRsvpSeatsAllocated} total seats reserved
            </p>
          </div>
          <div className="p-4 rounded-none bg-white/5 text-white/65 border border-white/10">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

      </section>

      {/* Main Admin Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin-main-section">
        
        {/* Left column: Event Schedule Manager Creator and Subscribers Table */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Sub block 1: Create Tour Event Form */}
          <div className="bg-black/40 border border-white/10 rounded-none p-6 sm:p-8 space-y-6" id="add-tour-event-card">
            <div className="space-y-1">
              <h3 className="font-sans text-lg font-light uppercase tracking-widest text-white">Publish New Tour Stop</h3>
              <p className="text-white/40 text-xs font-mono uppercase tracking-wide">Added shows dynamically update the calendar instantly!</p>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4" id="add-event-form">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Show Date */}
                <div className="space-y-1.5 focus-within:text-white">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Target Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-none bg-black border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30 text-left"
                  />
                </div>

                {/* Venue name */}
                <div className="space-y-1.5 focus-within:text-white">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Venue Name</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Royal Chapel Hall"
                    className="w-full px-3 py-2.5 rounded-none bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 text-left font-sans"
                  />
                </div>

                {/* City Location */}
                <div className="space-y-1.5 focus-within:text-white">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">City Location</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Portland, OR"
                    className="w-full px-3 py-2.5 rounded-none bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 text-left font-sans"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Country */}
                <div className="space-y-1.5 focus-within:text-white">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. USA"
                    className="w-full px-3 py-2.5 rounded-none bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-white/30 text-left"
                  />
                </div>

                {/* Status selector */}
                <div className="space-y-1.5 focus-within:text-white">
                  <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TourEvent['status'])}
                    className="w-full px-3 py-2.5 rounded-none bg-black border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30 text-left uppercase tracking-widest cursor-pointer"
                  >
                    <option value="available" className="text-white bg-black uppercase">Tickets Open (Available)</option>
                    <option value="sold-out" className="text-white bg-black uppercase">Sold Out (Full House)</option>
                    <option value="past" className="text-white bg-black uppercase">Past Session</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  {formSuccess && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-white font-mono bg-white/5 border border-white/10 px-3 py-1 text-center rounded-none"
                    >
                      ✓ Show successfully registered onto live calendar database!
                    </motion.p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-sans text-[10px] tracking-widest uppercase font-semibold rounded-none border-none transition-all cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Gig Stop</span>
                </button>
              </div>

            </form>
          </div>

          {/* Sub block 2: Contacts / Messages Inbox feed lists */}
          <div className="space-y-4" id="contacts-triaging-block">
            <h3 className="font-sans text-lg uppercase tracking-widest font-light text-white">Contact Forms Feed</h3>
            
            <div className="border border-white/10 rounded-none overflow-hidden bg-black/40 divide-y divide-white/5">
              {contacts.length === 0 ? (
                <p className="p-8 text-center text-xs text-white/40 font-mono uppercase tracking-widest">No feedback messages in database.</p>
              ) : (
                contacts.map((msg) => {
                  const isExpanded = expandedMessageId === msg.id;
                  return (
                    <div 
                      key={msg.id} 
                      id={`adm-msg-row-${msg.id}`}
                      className={`p-4 hover:bg-white/5 transition-all ${!msg.read ? 'border-l-2 border-l-white bg-white/5' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div onClick={() => setExpandedMessageId(isExpanded ? null : msg.id)} className="flex-grow cursor-pointer text-left space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-white text-sm font-medium">{msg.name}</p>
                            <span className="text-[10px] text-white/40 font-mono">• {msg.email}</span>
                          </div>
                          <p className="text-xs text-white/60 font-sans truncate max-w-lg tracking-wide">
                            <span className="font-mono text-white/50 underline text-[9px] mr-1.5 uppercase">[{msg.subject}]</span>
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {/* Toggle read */}
                          <button
                            id={`msg-adm-read-${msg.id}`}
                            onClick={() => onToggleContactRead(msg.id)}
                            className="p-1.5 border border-white/10 text-white hover:text-white rounded-none hover:border-white transition-all cursor-pointer bg-black/40"
                            title={msg.read ? 'Mark Unread' : 'Mark Read'}
                          >
                            {msg.read ? <EyeOff className="h-3.5 w-3.5 text-white/30" /> : <Eye className="h-3.5 w-3.5 text-white" />}
                          </button>
                          
                          {/* Delete */}
                          <button
                            id={`msg-adm-del-${msg.id}`}
                            onClick={() => onDeleteContact(msg.id)}
                            className="p-1.5 border border-white/10 text-white/40 hover:text-white rounded-none hover:border-white transition-all cursor-pointer bg-black/40"
                            title="Delete Message"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable message container details */}
                      {isExpanded && (
                        <div className="mt-4 p-4 rounded-none bg-black/95 border border-white/10 space-y-3 font-sans text-xs text-white/80 whitespace-pre-line text-left leading-relaxed">
                          <div className="border-b border-white/10 pb-2 flex justify-between text-white/40 font-mono text-[9px] uppercase tracking-wider">
                            <span className="underline">SUBJECT: {msg.subject}</span>
                            <span>DATE: {new Date(msg.date).toLocaleString()}</span>
                          </div>
                          <p className="italic font-serif font-light text-white/90">"{msg.message}"</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sub block 2b: Audio Categories Manager */}
          <div className="bg-black/40 border border-white/10 rounded-none p-6 sm:p-8 space-y-6" id="audio-categories-manager">
            <div className="space-y-1">
              <h3 className="font-sans text-lg font-light uppercase tracking-widest text-white">Audio Categories & Albums</h3>
              <p className="text-white/40 text-xs font-mono uppercase tracking-wide">Manage Categories and Assign Albums</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); if (newCat.trim()) { onAddAudioCategory(newCat.trim()); setNewCat(''); } }} className="flex gap-2">
              <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New Category (e.g. Acoustic)" className="flex-grow px-3.5 py-2.5 bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-white/30" />
              <button type="submit" className="px-5 py-2.5 bg-white text-black text-[10px] uppercase font-bold tracking-widest cursor-pointer hover:bg-neutral-200 transition-colors">Add</button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
               {audioCategories.filter(c => c !== 'All').map(cat => (
                  <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-[10px] text-white font-mono uppercase tracking-widest">
                     <span>{cat}</span>
                     <button onClick={() => onDeleteAudioCategory(cat)} className="text-white/40 hover:text-white cursor-pointer"><Trash2 className="h-3 w-3" /></button>
                  </div>
               ))}
            </div>

            <div className="divide-y divide-white/5 pt-4 border-t border-white/10 font-mono text-xs">
               {albums.map(alb => (
                 <div key={alb.id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-white font-sans uppercase tracking-wider">{alb.title}</span>
                    <select
                      value={alb.category || ''}
                      onChange={(e) => onUpdateAlbumCategory(alb.id, e.target.value)}
                      className="bg-black border border-white/10 text-white/80 font-mono text-[9px] uppercase px-2 py-1.5 focus:outline-none focus:border-white/30 cursor-pointer"
                    >
                      <option value="" className="bg-black text-white/40">-- No Category --</option>
                      {audioCategories.filter(c => c !== 'All').map(cat => (
                         <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
                      ))}
                    </select>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* Right column: Subscribers List and Events controllers */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Sub block 3: Show Events Live Schedule control panel table */}
          <div className="space-y-4" id="calendar-adm-tours">
            <h3 className="font-sans text-lg uppercase tracking-widest font-light text-white">Live Shows list</h3>
            
            <div className="border border-white/10 rounded-none overflow-hidden bg-black/40 divide-y divide-white/5 font-mono text-[11px]" id="calendar-adm-table">
              {events.map((e) => {
                return (
                  <div key={e.id} id={`adm-tour-row-${e.id}`} className="p-3 bg-transparent flex items-center justify-between">
                    <div className="text-left max-w-[170px]">
                      <p className="text-white truncate font-sans font-medium uppercase tracking-wider text-xs">{e.venue}</p>
                      <p className="text-white/40 text-[10px] mt-0.5">{e.city} • {e.date}</p>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Status select toggle */}
                      <select
                        id={`adm-status-select-${e.id}`}
                        value={e.status}
                        onChange={(sel) => onUpdateEventStatus(e.id, sel.target.value as TourEvent['status'])}
                        className="p-1 bg-black border border-white/10 rounded-none text-white/80 font-mono text-[9px] focus:outline-none uppercase tracking-widest cursor-pointer"
                      >
                        <option value="available">Available</option>
                        <option value="sold-out">Sold Out</option>
                        <option value="past">Past</option>
                      </select>

                      <button
                        id={`adm-del-tour-${e.id}`}
                        onClick={() => onDeleteEvent(e.id)}
                        className="p-1.5 border border-white/10 text-white/40 hover:text-white rounded-none hover:border-white transition-all cursor-pointer"
                        title="Delete Show"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub block 4: Newsletter Subscribers list */}
          <div className="space-y-4" id="mailing-list-manager">
            <h3 className="font-sans text-lg uppercase tracking-widest font-light text-white">Subscribers List</h3>
            
            <div className="border border-white/10 rounded-none overflow-hidden bg-black/40 divide-y divide-white/5 font-mono text-xs">
              <div className="bg-white/5 p-3 flex justify-between font-bold text-white/40 uppercase text-[9px] tracking-wider border-b border-white/10">
                <span>Email Address</span>
                <span>Subscribed on</span>
              </div>

              <div className="divide-y divide-white/5" id="subscribers-adm-body">
                {subscribers.length === 0 ? (
                  <p className="p-4 text-center text-white/40 font-mono uppercase tracking-widest">No active subscribers.</p>
                ) : (
                  subscribers.map((sub) => (
                    <div key={sub.id} id={`sub-row-${sub.id}`} className="p-3 flex justify-between items-center text-left">
                      <span className="text-white tracking-wide truncate max-w-[150px] font-sans">{sub.email}</span>
                      <span className="text-white/40 text-[10px]">
                        {new Date(sub.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sub block 5: RSVPs roster list */}
          <div className="space-y-4" id="rsvp-roster-manager">
            <h3 className="font-sans text-lg uppercase tracking-widest font-light text-white">Guest seats RSVPs</h3>
            
            <div className="border border-white/10 rounded-none overflow-hidden bg-black/40 divide-y divide-white/5 font-mono text-[11px]" id="rsvps-adm-table">
              <div className="bg-white/5 p-2.5 flex justify-between font-bold text-white/40 uppercase text-[9px] tracking-wider border-b border-white/10">
                <span>Rostered Guest</span>
                <span>Seats holds</span>
              </div>
              <div className="divide-y divide-white/5">
                {rsvps.length === 0 ? (
                  <p className="p-4 text-center text-white/40 font-mono uppercase tracking-widest">No live RSVPs yet.</p>
                ) : (
                  rsvps.map((r) => (
                    <div key={r.id} id={`adm-rsvp-row-${r.id}`} className="p-3 text-left space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-sans font-medium uppercase tracking-wider">{r.name}</span>
                        <span className="text-white underline font-bold font-mono text-[10px]">{r.ticketsCount} seats held</span>
                      </div>
                      <div className="flex justify-between text-white/40 text-[9px]">
                        <span className="truncate max-w-[140px] normal-case">{r.email}</span>
                        <span className="truncate max-w-[140px] italic font-serif font-light">{r.eventName}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

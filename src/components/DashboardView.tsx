/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Calendar, Users, Eye, EyeOff, Trash2, Plus, ShieldAlert, Sparkles, Image as ImageIcon, Video, Music, X } from 'lucide-react';
import { Subscriber, ContactMessage, RSVP, Video as VideoType, GalleryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  subscribers: Subscriber[];
  contacts: ContactMessage[];
  rsvps: RSVP[];
  albums: any[];
  audioCategories: string[];
  videos: VideoType[];
  galleryItems: GalleryItem[];
  onToggleContactRead: (id: string) => void;
  onDeleteContact: (id: string) => void;
  onAddAudioCategory: (category: string) => void;
  onDeleteAudioCategory: (category: string) => void;
  onUpdateAlbumCategory: (id: string, category: string) => void;
  onAddAlbum: (data: any) => void;
  onDeleteAlbum: (id: string) => void;
  onAddTrack: (albumId: string, data: any) => void;
  onDeleteTrack: (albumId: string, trackId: string) => void;
  onAddVideo: (data: Omit<VideoType, 'id'>) => void;
  onDeleteVideo: (id: string) => void;
  onAddGalleryItem: (data: Omit<GalleryItem, 'id'>) => void;
  onDeleteGalleryItem: (id: string) => void;
}

export default function DashboardView({
  subscribers,
  contacts,
  rsvps,
  albums,
  audioCategories,
  videos,
  galleryItems,
  onToggleContactRead,
  onDeleteContact,
  onAddAudioCategory,
  onDeleteAudioCategory,
  onUpdateAlbumCategory,
  onAddAlbum,
  onDeleteAlbum,
  onAddTrack,
  onDeleteTrack,
  onAddVideo,
  onDeleteVideo,
  onAddGalleryItem,
  onDeleteGalleryItem,
}: DashboardViewProps) {
  // Audio manager states
  const [newCat, setNewCat] = useState('');
  const [albTitle, setAlbTitle] = useState('');
  const [albType, setAlbType] = useState('album');
  const [albYear, setAlbYear] = useState(2026);
  const [albCover, setAlbCover] = useState('');
  const [albDesc, setAlbDesc] = useState('');
  
  const [trAlbumId, setTrAlbumId] = useState('');
  const [trTitle, setTrTitle] = useState('');
  const [trDuration, setTrDuration] = useState('');
  const [trAudioUrl, setTrAudioUrl] = useState('');

  // Video states
  const [vidTitle, setVidTitle] = useState('');
  const [vidType, setVidType] = useState('music-video');
  const [vidThumb, setVidThumb] = useState('');
  const [vidDuration, setVidDuration] = useState('');
  const [vidYear, setVidYear] = useState(2026);
  const [vidDesc, setVidDesc] = useState('');

  // Gallery states
  const [galUrl, setGalUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galCat, setGalCat] = useState('editorial');
  const [galAspect, setGalAspect] = useState('portrait');

  // Admin Navigation State
  const [activeSection, setActiveSection] = useState('overview');

  // Expanded messages controls
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  // Metrics details
  const totalSubscribers = subscribers.length;
  const unreadMessagesCount = contacts.filter(c => !c.read).length;
  const totalRsvpSeatsAllocated = rsvps.reduce((sum, r) => sum + r.ticketsCount, 0);

  // Right-side Menu Renderer
  const renderMenuButton = (section: string, label: string) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`text-left text-[10px] sm:text-xs font-mono uppercase tracking-widest w-full px-3 py-2 transition-colors ${
        activeSection === section 
          ? 'bg-white/10 text-white border-l-2 border-white' 
          : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      }`}
    >
      {label}
    </button>
  );

  // Dynamic Content Switcher
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h3 className="font-sans text-lg font-light uppercase tracking-widest text-white">Dashboard Overview</h3>
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
          </div>
        );

      case 'communications-inbox':
        return (
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
        );

      case 'audience-subscribers':
        return (
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
        );

      case 'audience-rsvps':
        return (
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
        );

      case 'media-audio':
        return (
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
        );

      case 'media-albums':
        return (
          <div className="space-y-8" id="media-albums-manager">
            {/* Add Album Form */}
            <div className="bg-black/40 border border-white/10 p-6 space-y-4">
              <div className="space-y-1 border-b border-white/10 pb-4">
                <h3 className="font-sans text-lg font-light uppercase tracking-widest text-white">Publish Release</h3>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-wide">Create a new Album or EP entry.</p>
              </div>
              <form onSubmit={e => { e.preventDefault(); onAddAlbum({ title: albTitle, type: albType, releaseYear: albYear, coverUrl: albCover, description: albDesc }); setAlbTitle(''); setAlbCover(''); setAlbDesc(''); setAlbType('album'); setAlbYear(2026); }} className="space-y-4 font-mono text-xs text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="Album Title" value={albTitle} onChange={e => setAlbTitle(e.target.value)} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none" />
                  <input placeholder="Cover Image URL" value={albCover} onChange={e => setAlbCover(e.target.value)} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none" />
                  <select value={albType} onChange={e => setAlbType(e.target.value)} className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none cursor-pointer">
                    <option value="album">Full Album</option>
                    <option value="EP">EP</option>
                    <option value="single">Single</option>
                  </select>
                  <input type="number" placeholder="Release Year" value={albYear} onChange={e => setAlbYear(Number(e.target.value))} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none" />
                </div>
                <textarea placeholder="Album Description" value={albDesc} onChange={e => setAlbDesc(e.target.value)} required className="w-full p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none min-h-[80px]" />
                <button type="submit" className="w-full px-5 py-2.5 bg-white text-black font-sans uppercase font-bold tracking-widest cursor-pointer hover:bg-neutral-200">Create Release</button>
              </form>
            </div>

            {/* Add Track Form */}
            <div className="bg-black/40 border border-white/10 p-6 space-y-4">
              <h3 className="font-sans text-sm font-light uppercase tracking-widest text-white">Append Track to Release</h3>
              <form onSubmit={e => { e.preventDefault(); if(trAlbumId) { onAddTrack(trAlbumId, { title: trTitle, duration: trDuration, audioUrl: trAudioUrl }); setTrTitle(''); setTrDuration(''); setTrAudioUrl(''); } }} className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select value={trAlbumId} onChange={e => setTrAlbumId(e.target.value)} required className="p-2.5 bg-black border border-white/10 text-white cursor-pointer outline-none">
                    <option value="">Select Album...</option>
                    {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                  </select>
                  <input placeholder="Track Title" value={trTitle} onChange={e => setTrTitle(e.target.value)} required className="p-2.5 bg-black border border-white/10 text-white outline-none focus:border-white/30" />
                  <input placeholder="Duration (e.g. 03:45)" value={trDuration} onChange={e => setTrDuration(e.target.value)} required className="p-2.5 bg-black border border-white/10 text-white outline-none focus:border-white/30" />
                </div>
                <input placeholder="Audio File URL (e.g. https://.../track.mp3)" value={trAudioUrl} onChange={e => setTrAudioUrl(e.target.value)} required className="w-full p-2.5 bg-black border border-white/10 text-white outline-none focus:border-white/30" />
                <button type="submit" className="w-full mt-1 px-3 py-2.5 bg-white/10 text-white border border-white/20 uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer">Add Track</button>
              </form>
            </div>

            {/* Albums List */}
            <div className="space-y-3">
               {albums.map(alb => (
                 <div key={alb.id} className="border border-white/10 bg-black/40 p-4 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                       <div className="flex items-center space-x-3">
                         <img src={alb.coverUrl} className="h-10 w-10 object-cover border border-white/10 grayscale" alt="" />
                         <div>
                           <h4 className="text-white text-sm font-sans uppercase tracking-widest">{alb.title}</h4>
                           <p className="text-white/40 text-[9px] font-mono tracking-widest uppercase">{alb.tracks?.length || 0} Tracks • {alb.releaseYear}</p>
                         </div>
                       </div>
                       <button onClick={() => onDeleteAlbum(alb.id)} className="p-2 text-white/30 hover:text-red-400 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="space-y-1 pl-1 border-l-2 border-white/10">
                       {alb.tracks?.map((t: any) => (
                          <div key={t.id} className="flex justify-between items-center group px-3 py-1.5 hover:bg-white/5 text-[10px] font-mono text-white/60">
                             <span className="uppercase">{t.title} <span className="text-white/30">({t.duration})</span></span>
                             <button onClick={() => onDeleteTrack(alb.id, t.id)} className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white cursor-pointer transition-opacity"><X className="h-3 w-3" /></button>
                          </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'media-videos':
        return (
          <div className="space-y-8" id="media-videos-manager">
            <div className="bg-black/40 border border-white/10 p-6 space-y-4">
              <div className="space-y-1 border-b border-white/10 pb-4">
                <h3 className="font-sans text-lg font-light uppercase tracking-widest text-white">Publish Video</h3>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-wide">Add a new cinematic piece.</p>
              </div>
              <form onSubmit={e => { e.preventDefault(); onAddVideo({ title: vidTitle, type: vidType as any, thumbnailUrl: vidThumb, duration: vidDuration, releaseYear: vidYear, description: vidDesc, embedId: 'simulated' }); setVidTitle(''); setVidThumb(''); setVidDuration(''); setVidDesc(''); }} className="space-y-4 font-mono text-xs text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="Video Title" value={vidTitle} onChange={e => setVidTitle(e.target.value)} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none" />
                  <input placeholder="Thumbnail URL" value={vidThumb} onChange={e => setVidThumb(e.target.value)} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none" />
                  <select value={vidType} onChange={e => setVidType(e.target.value)} className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none cursor-pointer">
                    <option value="music-video">Music Video</option>
                    <option value="live-session">Live Session</option>
                    <option value="behind-the-scenes">Behind the Scenes</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Duration" value={vidDuration} onChange={e => setVidDuration(e.target.value)} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none w-full" />
                    <input type="number" placeholder="Year" value={vidYear} onChange={e => setVidYear(Number(e.target.value))} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none w-full" />
                  </div>
                </div>
                <textarea placeholder="Description" value={vidDesc} onChange={e => setVidDesc(e.target.value)} required className="w-full p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none min-h-[60px]" />
                <button type="submit" className="w-full px-5 py-2.5 bg-white text-black font-sans uppercase font-bold tracking-widest cursor-pointer hover:bg-neutral-200">Add Video to Library</button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {videos.map(v => (
                 <div key={v.id} className="border border-white/10 bg-black/40 flex overflow-hidden h-24 relative group">
                    <img src={v.thumbnailUrl} className="w-1/3 h-full object-cover grayscale opacity-60" alt="" />
                    <div className="p-3 w-2/3 flex flex-col justify-center">
                       <span className="text-[9px] text-white/40 font-mono uppercase">{v.type.replace('-', ' ')}</span>
                       <h4 className="text-white text-xs font-sans uppercase tracking-widest truncate">{v.title}</h4>
                    </div>
                    <button onClick={() => onDeleteVideo(v.id)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/80 border border-white/10 text-white/50 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'media-gallery':
        return (
          <div className="space-y-8" id="media-gallery-manager">
            <div className="bg-black/40 border border-white/10 p-6 space-y-4">
              <div className="space-y-1 border-b border-white/10 pb-4">
                <h3 className="font-sans text-lg font-light uppercase tracking-widest text-white">Publish Photo</h3>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-wide">Add a picture to the Artist Gallery.</p>
              </div>
              <form onSubmit={e => { e.preventDefault(); onAddGalleryItem({ url: galUrl, caption: galCaption, category: galCat as any, aspectRatio: galAspect as any }); setGalUrl(''); setGalCaption(''); }} className="space-y-4 font-mono text-xs text-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="Image URL" value={galUrl} onChange={e => setGalUrl(e.target.value)} required className="col-span-1 sm:col-span-2 p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none" />
                  <input placeholder="Caption" value={galCaption} onChange={e => setGalCaption(e.target.value)} required className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={galCat} onChange={e => setGalCat(e.target.value)} className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none cursor-pointer">
                      <option value="editorial">Editorial</option>
                      <option value="stage">Stage</option>
                      <option value="studio">Studio</option>
                      <option value="backstage">Backstage</option>
                    </select>
                    <select value={galAspect} onChange={e => setGalAspect(e.target.value)} className="p-2.5 bg-black border border-white/10 focus:border-white/30 outline-none cursor-pointer">
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full px-5 py-2.5 bg-white text-black font-sans uppercase font-bold tracking-widest cursor-pointer hover:bg-neutral-200">Add to Gallery</button>
              </form>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {galleryItems.map(g => (
                 <div key={g.id} className="relative group border border-white/10 aspect-square overflow-hidden">
                    <img src={g.url} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 transition-opacity" alt="" />
                    <button onClick={() => onDeleteGalleryItem(g.id)} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                       <Trash2 className="h-6 w-6 text-red-400 hover:text-red-300" />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        );

      default:
        return null;
    }
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

      {/* Main Admin Grids with Sidebar */}
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8" id="admin-main-section">
        
        {/* Left column: Content Area */}
        <div className="lg:col-span-9 space-y-12 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right column: Sidebar Navigation */}
        <div className="lg:col-span-3">
          <div className="bg-black/40 border border-white/10 rounded-none p-6 space-y-6 sticky top-24">
            <h3 className="font-sans text-sm font-light uppercase tracking-widest text-white mb-2">Portal Menu</h3>
            
            <nav className="space-y-6">
              {/* Overview */}
              <div>
                {renderMenuButton('overview', 'Dashboard Overview')}
              </div>

              {/* Communications */}
              <div className="space-y-2">
                <span className="text-[9px] font-sans text-white/40 uppercase tracking-[0.2em] px-3">Communications</span>
                <div className="flex flex-col space-y-1">
                  {renderMenuButton('communications-inbox', 'Contact Inbox')}
                </div>
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <span className="text-[9px] font-sans text-white/40 uppercase tracking-[0.2em] px-3">Audience</span>
                <div className="flex flex-col space-y-1">
                  {renderMenuButton('audience-subscribers', 'Mailing List')}
                  {renderMenuButton('audience-rsvps', 'Guest RSVPs')}
                </div>
              </div>

              {/* Media */}
              <div className="space-y-2">
                <span className="text-[9px] font-sans text-white/40 uppercase tracking-[0.2em] px-3">Media</span>
                <div className="flex flex-col space-y-1">
                  {renderMenuButton('media-audio', 'Audio Categories')}
                  {renderMenuButton('media-albums', 'Albums & Tracks')}
                  {renderMenuButton('media-videos', 'Video Library')}
                  {renderMenuButton('media-gallery', 'Photo Gallery')}
                </div>
              </div>
            </nav>
          </div>
        </div>
        
      </div>

    </div>
  );
}

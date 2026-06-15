/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Disc, Music, Calendar, Image as ImageIcon, Video, User, Mail, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  showAdminBadge: boolean;
}

export default function Navigation({ currentTab, onChangeTab, showAdminBadge }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Disc },
    { id: 'about', label: 'About', icon: User },
    { id: 'audios', label: 'Audios', icon: Music },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    onChangeTab(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <button 
            id="nav-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <span className="font-sans font-light text-xl sm:text-2xl tracking-[0.35em] text-white uppercase transition-opacity duration-300 hover:opacity-80">
              Aria Vance
            </span>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex space-x-8 items-center" id="nav-desktop">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative font-sans text-xs tracking-[0.2em] font-medium uppercase transition-colors duration-300 py-2 cursor-pointer ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* Dashboard shortcut */}
            <button
              id="nav-item-dashboard"
              onClick={() => handleNavClick('dashboard')}
              className={`p-2 rounded-none border transition-all duration-300 cursor-pointer flex items-center ${
                currentTab === 'dashboard'
                  ? 'border-white/40 text-white bg-white/5'
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
              }`}
              title="Artist Dashboard Admin"
            >
              <ShieldAlert className="h-4 w-4 text-white/70" />
              {showAdminBadge && (
                <span className="ml-1.5 flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              id="mobile-nav-dashboard"
              onClick={() => handleNavClick('dashboard')}
              className={`p-2 rounded-none border transition-colors ${
                currentTab === 'dashboard'
                  ? 'border-white/40 text-white bg-white/5'
                  : 'border-white/10 text-white/60'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-white/10 rounded-none text-white/60 hover:text-white bg-black transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-[#030303]"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-4 w-full px-4 py-3 rounded-none text-left text-sm tracking-widest uppercase transition-colors ${
                      isActive 
                        ? 'bg-white/5 text-white font-medium border-l-2 border-white' 
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

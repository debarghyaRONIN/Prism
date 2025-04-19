"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface HeaderProps {
  onToggleFocusMode: () => void;
  onToggleTimeline: () => void;
  onToggleAnalytics?: () => void;
  userName?: string;
  userAvatar?: string;
}

export default function Header({ 
  onToggleFocusMode, 
  onToggleTimeline, 
  onToggleAnalytics,
  userName = 'User',
  userAvatar = ''
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  
  // Check if device is mobile and detect orientation
  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      const isMobileDevice = window.innerWidth < 768;
      const isLandscapeOrientation = window.innerWidth > window.innerHeight;
      const isNarrow = window.innerWidth < 1024;
      
      setIsMobile(isMobileDevice);
      setIsLandscape(isLandscapeOrientation);
      setIsNarrowScreen(isNarrow);
      
      // In landscape mode, we can show more UI elements
      if (isLandscapeOrientation) {
        document.documentElement.classList.add('landscape-mode');
        document.documentElement.classList.remove('portrait-mode');
      } else {
        document.documentElement.classList.add('portrait-mode');
        document.documentElement.classList.remove('landscape-mode');
      }
      
      // Enforce landscape on mobile
      if (isMobileDevice && !isLandscapeOrientation) {
        // Show landscape recommendation for mobile
        const landscapePrompt = document.getElementById('landscape-prompt');
        if (landscapePrompt) {
          landscapePrompt.style.display = 'flex';
        } else {
          const prompt = document.createElement('div');
          prompt.id = 'landscape-prompt';
          prompt.style.position = 'fixed';
          prompt.style.bottom = '0';
          prompt.style.left = '0';
          prompt.style.right = '0';
          prompt.style.backgroundColor = 'rgba(0,0,0,0.8)';
          prompt.style.color = 'white';
          prompt.style.padding = '8px 16px';
          prompt.style.zIndex = '50';
          prompt.style.display = 'flex';
          prompt.style.alignItems = 'center';
          prompt.style.justifyContent = 'center';
          prompt.style.fontSize = '12px';
          prompt.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
              <path d="M21 12H3M21 12L15 6M21 12L15 18" />
            </svg>
            <span>This application works best in landscape orientation</span>
          `;
          document.body.appendChild(prompt);
        }
      } else {
        const landscapePrompt = document.getElementById('landscape-prompt');
        if (landscapePrompt) {
          landscapePrompt.style.display = 'none';
        }
      }
    };
    
    // Initial check
    checkDeviceAndOrientation();
    
    // Add resize listener
    window.addEventListener('resize', checkDeviceAndOrientation);
    window.addEventListener('orientationchange', checkDeviceAndOrientation);
    
    return () => {
      window.removeEventListener('resize', checkDeviceAndOrientation);
      window.removeEventListener('orientationchange', checkDeviceAndOrientation);
      
      // Remove landscape prompt if it exists
      const landscapePrompt = document.getElementById('landscape-prompt');
      if (landscapePrompt) {
        document.body.removeChild(landscapePrompt);
      }
      
      // Remove classes
      document.documentElement.classList.remove('landscape-mode', 'portrait-mode');
    };
  }, []);
  
  // Get initials from the user's name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <motion.div 
            {...{
              className: "flex items-center gap-2",
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3 }
            } as any}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16L6 10H18L12 16Z" fill="url(#paint0_linear)" />
              <path d="M12 8L18 14H6L12 8Z" fill="url(#paint1_linear)" />
              <defs>
                <linearGradient id="paint0_linear" x1="6" y1="10" x2="18" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#A21CAF" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="6" y1="14" x2="18" y2="8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22C55E" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Prism</h1>
          </motion.div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${showMobileMenu ? 'rotate-90' : ''}`}
            >
              {showMobileMenu ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
          
          <nav className="hidden md:flex items-center gap-4">
            <motion.button
              {...{
                className: "btn-outline text-sm",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 }
              } as any}
            >
              Dashboard
            </motion.button>
            <motion.button
              {...{
                className: "btn-outline text-sm",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: onToggleTimeline
              } as any}
            >
              Timeline
            </motion.button>
            <motion.button
              {...{
                className: "btn-outline text-sm",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: onToggleAnalytics
              } as any}
            >
              Analytics
            </motion.button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`relative ${isMobile && !isLandscape ? 'hidden' : 'block'}`}>
            <input
              type="text"
              placeholder="Search tasks..."
              className="px-4 py-2 pl-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 text-neutral-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          
          <motion.button
            {...{
              className: `btn-primary ${isMobile && !isLandscape ? 'hidden' : 'flex items-center'}`,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: onToggleFocusMode
            } as any}
          >
            {isNarrowScreen && isLandscape ? 
              "Focus" : "Focus Mode"}
          </motion.button>
          
          <div className="relative">
            <motion.button
              {...{
                className: "h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold cursor-pointer",
                whileHover: { scale: 1.05, boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" },
                whileTap: { scale: 0.98 },
                onClick: () => setShowProfileDropdown(!showProfileDropdown),
                "aria-label": "User profile"
              } as any}
            >
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(userName)
              )}
            </motion.button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50 border border-neutral-200 dark:border-neutral-700">
                <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="font-medium">{userName}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">user@example.com</div>
                </div>
                
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full text-left">
                  View Profile
                </Link>
                
                <Link href="/profile/edit" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full text-left">
                  Edit Profile
                </Link>
                
                <Link href="/profile/settings" className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full text-left">
                  Settings
                </Link>
                
                <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>
                
                <button className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full text-left text-error-600 dark:text-error-400">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu - with landscape optimizations */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className={`py-3 ${isLandscape ? 'grid grid-cols-2 gap-2' : 'space-y-3'}`}>
              <button className="w-full text-left px-3 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md">
                Dashboard
              </button>
              <button 
                className="w-full text-left px-3 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                onClick={() => {
                  onToggleTimeline();
                  setShowMobileMenu(false);
                }}
              >
                Timeline
              </button>
              <button 
                className="w-full text-left px-3 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                onClick={() => {
                  if (onToggleAnalytics) onToggleAnalytics();
                  setShowMobileMenu(false);
                }}
              >
                Analytics
              </button>
              <button 
                className="w-full text-left px-3 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                onClick={() => {
                  onToggleFocusMode();
                  setShowMobileMenu(false);
                }}
              >
                Focus Mode
              </button>
              
              {/* Mobile search - only show in portrait */}
              {!isLandscape && (
                <div className="relative px-3 pt-2">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="w-full px-4 py-2 pl-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute left-6 top-4.5 text-neutral-400"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 
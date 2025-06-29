"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Workspace, { WorkspaceHandle } from '../components/Workspace';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Home() {
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({
    'Design System': 0,
    'Mobile App': 0,
    'Marketing Website': 0,
    'Backend API': 0,
    'New Project': 0
  });
  // Add state for active category
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Add user information
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: ''
  });
  
  // Reference to the workspace component
  const workspaceRef = useRef<WorkspaceHandle | null>(null);
  
  // Use useCallback for all event handlers to prevent recreation on renders
  const handleAddNewTask = useCallback((projectName: string) => {
    if (workspaceRef.current) {
      workspaceRef.current.addNewTask(projectName);
    }
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  // Get project counts from the workspace component
  const updateProjectCounts = useCallback((counts: Record<string, number>) => {
    setProjectCounts(counts);
  }, []);

  // Toggle handlers with useCallback
  const handleToggleFocusMode = useCallback(() => {
    setShowFocusMode(prev => !prev);
    // Close other views when focusing
    if (!showFocusMode) {
      setShowTimeline(false);
      setShowAnalytics(false);
    }
  }, [showFocusMode]);

  const handleToggleTimeline = useCallback(() => {
    setShowTimeline(prev => !prev);
    // Close other views when showing timeline
    if (!showTimeline) {
      setShowFocusMode(false);
      setShowAnalytics(false);
    }
  }, [showTimeline]);

  const handleToggleAnalytics = useCallback(() => {
    setShowAnalytics(prev => !prev);
    // Close other views when showing analytics
    if (!showAnalytics) {
      setShowFocusMode(false);
      setShowTimeline(false);
    }
  }, [showAnalytics]);

  const handleCloseFocusMode = useCallback(() => {
    setShowFocusMode(false);
  }, []);

  const handleCloseTimeline = useCallback(() => {
    setShowTimeline(false);
  }, []);

  const handleCloseAnalytics = useCallback(() => {
    setShowAnalytics(false);
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header 
        onToggleFocusMode={handleToggleFocusMode}
        onToggleTimeline={handleToggleTimeline}
        onToggleAnalytics={handleToggleAnalytics}
        userName={user.name}
        userAvatar={user.avatar}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onNewTask={handleAddNewTask} 
          projectCounts={projectCounts}
          onCategoryChange={handleCategoryChange}
          activeCategory={activeCategory}
        />
        
        <div className="flex-1 p-4 relative">
          <Workspace 
            ref={workspaceRef}
            showFocusMode={showFocusMode} 
            showTimeline={showTimeline}
            showAnalytics={showAnalytics}
            onProjectCountsUpdate={updateProjectCounts}
            onToggleFocusMode={handleCloseFocusMode}
            onToggleTimeline={handleCloseTimeline}
            onToggleAnalytics={handleCloseAnalytics}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </main>
  );
} 
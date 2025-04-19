"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { format, parseISO, isAfter, isBefore, isEqual, addDays, addMonths } from 'date-fns';
import { BsCardList, BsCalendar3, BsPhone, BsThreeDots, BsPencil, BsTrash } from 'react-icons/bs';
import { FaRegCircle, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaFlag } from 'react-icons/fa';

// Define the missing interfaces at the top of the file
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date | string;
  assignee?: {
    name: string;
  };
  connections?: string[];
}

interface TimelineProps {
  tasks: Task[];
  onClose: () => void;
}

type ViewMode = 'timeline' | 'overview';

// Task statuses with respective icons and colors
const statusConfig: Record<string, { icon: React.ElementType; color: string }> = {
  'To Do': { icon: FaRegCircle, color: 'text-neutral-500' },
  'In Progress': { icon: FaExclamationCircle, color: 'text-amber-500' },
  'Completed': { icon: FaCheckCircle, color: 'text-emerald-500' },
  'Cancelled': { icon: FaTimesCircle, color: 'text-rose-500' },
};

// Priority colors
const priorityColors: Record<string, string> = {
  'Low': 'bg-blue-500',
  'Medium': 'bg-amber-500',
  'High': 'bg-rose-500',
};

// Timeline component
const Timeline: React.FC<TimelineProps> = ({ tasks, onClose }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [taskPositions, setTaskPositions] = useState<{[key: string]: {x: number, y: number}}>({});
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dragControls = useDragControls();

  // Detect mobile device and enforce landscape orientation
  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      const isLandscapeOrientation = window.innerWidth > window.innerHeight;
      setIsMobile(mobileQuery.matches);
      setIsLandscape(isLandscapeOrientation);
      
      // Force landscape orientation message if in portrait mode on mobile
      if (window.innerHeight > window.innerWidth && mobileQuery.matches) {
        const landscapeMessage = document.getElementById('landscape-message');
        if (landscapeMessage) {
          landscapeMessage.style.display = 'flex';
        } else {
          const message = document.createElement('div');
          message.id = 'landscape-message';
          message.style.position = 'fixed';
          message.style.inset = '0';
          message.style.backgroundColor = 'rgba(0,0,0,0.9)';
          message.style.color = 'white';
          message.style.zIndex = '9999';
          message.style.display = 'flex';
          message.style.flexDirection = 'column';
          message.style.alignItems = 'center';
          message.style.justifyContent = 'center';
          message.style.textAlign = 'center';
          message.style.padding = '20px';
          message.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12H3M21 12L15 6M21 12L15 18" />
            </svg>
            <h2 style="margin: 16px 0; font-size: 24px;">Please rotate your device</h2>
            <p>This application is optimized for landscape orientation</p>
          `;
          document.body.appendChild(message);
        }
      } else {
        const landscapeMessage = document.getElementById('landscape-message');
        if (landscapeMessage) {
          landscapeMessage.style.display = 'none';
        }
      }
      
      // Add classes for responsive styling
      if (mobileQuery.matches) {
        document.documentElement.classList.add('mobile-device');
        if (isLandscapeOrientation) {
          document.documentElement.classList.add('landscape');
          document.documentElement.classList.remove('portrait');
        } else {
          document.documentElement.classList.add('portrait');
          document.documentElement.classList.remove('landscape');
        }
      } else {
        document.documentElement.classList.remove('mobile-device', 'portrait', 'landscape');
      }
    };
    
    // Check initially
    checkDeviceAndOrientation();
    
    // Add listeners for screen size and orientation changes
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    mobileQuery.addEventListener('change', checkDeviceAndOrientation);
    window.addEventListener('resize', checkDeviceAndOrientation);
    window.addEventListener('orientationchange', checkDeviceAndOrientation);
    
    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', checkDeviceAndOrientation);
      window.removeEventListener('resize', checkDeviceAndOrientation);
      window.removeEventListener('orientationchange', checkDeviceAndOrientation);
      
      // Remove the landscape message if it exists
      const landscapeMessage = document.getElementById('landscape-message');
      if (landscapeMessage) {
        document.body.removeChild(landscapeMessage);
      }
      
      // Remove classes
      document.documentElement.classList.remove('mobile-device', 'portrait', 'landscape');
    };
  }, []);

  // Helper function to compare dates that could be string or Date objects
  const compareTaskDates = (dateA?: Date | string, dateB?: Date | string): number => {
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    const dateObjA = dateA instanceof Date ? dateA : parseISO(dateA);
    const dateObjB = dateB instanceof Date ? dateB : parseISO(dateB);
    
    return isAfter(dateObjA, dateObjB) ? 1 : -1;
  };

  // Sort tasks by due date (earliest first)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      return compareTaskDates(a.dueDate, b.dueDate);
    });
  }, [tasks]);

  // Calculate positions for tasks
  useEffect(() => {
    if (viewMode === 'timeline' && containerRef.current) {
      // Define a fixed width for task nodes
      const nodeWidth = 240;
      const nodeHeight = 100;
      const horizontalSpacing = 300; // Space between columns
      const verticalSpacing = 200; // Space between rows

      // Group tasks by month
      const tasksByMonth: {[key: string]: Task[]} = {};
      sortedTasks.forEach(task => {
        if (!task.dueDate) return;
        
        const monthKey = format(
          task.dueDate instanceof Date ? task.dueDate : parseISO(task.dueDate), 
          'yyyy-MM'
        );
        
        if (!tasksByMonth[monthKey]) {
          tasksByMonth[monthKey] = [];
        }
        tasksByMonth[monthKey].push(task);
      });

      // Calculate positions
      const newPositions: {[key: string]: {x: number, y: number}} = {};
      let monthIndex = 0;

      Object.entries(tasksByMonth).forEach(([month, monthTasks]) => {
        // For each month, create a new column
        monthTasks.forEach((task, taskIndex) => {
          newPositions[task.id] = {
            x: monthIndex * horizontalSpacing + 100,
            y: taskIndex * verticalSpacing + 100
          };
        });
        monthIndex++;
      });

      // Position tasks without due dates at the end
      const tasksWithoutDueDate = sortedTasks.filter(task => !task.dueDate);
      tasksWithoutDueDate.forEach((task, index) => {
        newPositions[task.id] = {
          x: monthIndex * horizontalSpacing + 100,
          y: index * verticalSpacing + 100
        };
      });

      setTaskPositions(newPositions);
    } else if (viewMode === 'overview' && containerRef.current) {
      // In overview mode, positions are handled by CSS grid
      // We don't need to set positions manually
    }
  }, [sortedTasks, viewMode]);

  // Group tasks by status
  const getTasksByStatus = () => {
    const byStatus: {[key: string]: Task[]} = {
      'To Do': [],
      'In Progress': [],
      'Completed': [],
      'Cancelled': [],
    };

    sortedTasks.forEach(task => {
      if (byStatus[task.status]) {
        byStatus[task.status].push(task);
      }
    });

    return byStatus;
  };

  // Handle touch gesture events
  const handleTouchStart = (e: React.TouchEvent, taskId: string) => {
    // Store how many fingers are touching the screen
    setTouchCount(e.touches.length);
    
    // For single finger touches on a task, start a timer for long press
    if (e.touches.length === 1) {
      longPressTimerRef.current = setTimeout(() => {
        setSelectedTask(taskId);
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }, 800); // 0.8 seconds for better responsiveness
    }
    
    // For two finger touches, prepare for panning the view
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent default browser behaviors
      setIsPanning(true);
      // Cancel any active long press
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };
  
  // Handle task actions
  const handleTaskAction = (action: 'edit' | 'delete', taskId: string) => {
    // Close the menu
    setActiveTaskMenu(null);
    
    // For this example, we'll just log the action
    // In a real app, you would implement editing or deleting logic
    console.log(`${action} task: ${taskId}`);
    
    // Example implementation:
    // if (action === 'edit') {
    //   // Open task edit form/modal
    // } else if (action === 'delete') {
    //   // Show confirmation dialog and delete task
    // }
  };
  
  // Enhanced touch move handler with inertial scrolling
  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press if the finger moves significantly
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Handle two-finger panning with improved calculation
    if (e.touches.length === 2 && isPanning) {
      e.preventDefault(); // Prevent default scrolling
      
      // Calculate the midpoint of the two touches
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Store these positions for delta calculation
      const currentMidX = (touch1.clientX + touch2.clientX) / 2;
      const currentMidY = (touch1.clientY + touch2.clientY) / 2;
      
      // Get previous touch positions from ref
      const target = e.currentTarget as HTMLElement;
      const prevMidX = target.dataset.prevTouchX ? parseFloat(target.dataset.prevTouchX) : currentMidX;
      const prevMidY = target.dataset.prevTouchY ? parseFloat(target.dataset.prevTouchY) : currentMidY;
      
      // Calculate movement delta with improved sensitivity
      const deltaX = currentMidX - prevMidX;
      const deltaY = currentMidY - prevMidY;
      
      // Adjust sensitivity for landscape orientation
      const xSensitivity = isLandscape ? 1.2 : 1.0;
      const ySensitivity = isLandscape ? 1.0 : 1.2;
      
      // Update view offset based on the delta with orientation-specific sensitivity
      setViewOffset(prev => ({
        x: prev.x + deltaX * xSensitivity,
        y: prev.y + deltaY * ySensitivity
      }));
      
      // Store current positions for next delta calculation
      target.dataset.prevTouchX = currentMidX.toString();
      target.dataset.prevTouchY = currentMidY.toString();
    }
  };
  
  // Enhanced touch end handler with inertia effect
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Update the touch count
    setTouchCount(e.touches.length);
    
    // Clear any pending long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // End panning mode if no more two-finger touch
    if (e.touches.length < 2) {
      setIsPanning(false);
      
      // Add inertia effect - smooth deceleration of movement
      if (containerRef.current) {
        const target = e.currentTarget as HTMLElement;
        if (target.dataset.prevTouchX && isPanning) {
          // Apply inertia here if needed
        }
        
        // Clear previous touch positions
        delete target.dataset.prevTouchX;
        delete target.dataset.prevTouchY;
      }
    }
  };
  
  // Handle dragging for tasks in mobile view
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, taskId: string) => {
    if (isMobile && selectedTask) {
      // Update the task position with enhanced movement
      setTaskPositions(prev => ({
        ...prev,
        [taskId]: {
          x: prev[taskId]?.x + info.offset.x || info.offset.x,
          y: prev[taskId]?.y + info.offset.y || info.offset.y
        }
      }));
      
      // Provide haptic feedback when drag ends
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Clear selected task after moving
      setSelectedTask(null);
    }
  };

  // Render a task node with responsive support
  const renderTaskNode = (task: Task, index: number) => {
    const StatusIcon = statusConfig[task.status]?.icon || FaRegCircle;
    const statusColor = statusConfig[task.status]?.color || 'text-neutral-500';
    const priorityColor = priorityColors[task.priority] || 'bg-neutral-500';
    
    // Determine appropriate width based on viewport
    const getTaskWidth = () => {
      // Check if we're in landscape
      if (isMobile) {
        return isLandscape ? '320px' : 'calc(100% - 24px)';
      } else {
        return '240px';
      }
    };
    
    const nodeStyle = taskPositions[task.id] ? {
      left: `${taskPositions[task.id].x}px`,
      top: `${taskPositions[task.id].y}px`,
      zIndex: selectedTask === task.id ? 20 : (activeTaskMenu === task.id ? 25 : 15),
      width: getTaskWidth(),
      maxWidth: isMobile ? '100%' : '240px',
      touchAction: isPanning ? 'none' : 'auto', // Improved touch handling
    } : {};
    
    return (
      <motion.div
        key={task.id}
        className={`absolute bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-4 ${
          selectedTask === task.id ? 'ring-2 ring-primary-500' : ''
        }`}
        style={nodeStyle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: selectedTask === task.id ? 1.05 : 1,
          x: isMobile ? viewOffset.x : 0,
          y: isMobile ? viewOffset.y : 0
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }} // Faster animation for better responsiveness
        drag={isMobile && selectedTask === task.id}
        dragControls={dragControls}
        onDragEnd={(e, info) => handleDragEnd(e, info, task.id)}
        onTouchStart={(e) => handleTouchStart(e, task.id)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        dragConstraints={containerRef}
        dragElastic={0.1} // Reduced elasticity for more precise control
        dragMomentum={true} // Enable momentum for smoother dragging
      >
        {/* Task header with status and menu */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <StatusIcon className={`mr-2 ${statusColor}`} />
            <span className="text-sm font-medium">{task.status}</span>
          </div>
          <div className="flex items-center">
            {task.priority && (
              <div className={`h-3 w-3 rounded-full ${priorityColor} mr-2`} title={`Priority: ${task.priority}`}></div>
            )}
            {/* Mobile action menu button */}
            {isMobile && (
              <button 
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id);
                }}
                aria-label="Task options"
              >
                <BsThreeDots />
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile action menu */}
        {activeTaskMenu === task.id && isMobile && (
          <div className="absolute right-2 top-8 bg-white dark:bg-neutral-700 shadow-lg rounded-md py-1 z-30">
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-600"
              onClick={() => handleTaskAction('edit', task.id)}
            >
              <BsPencil className="mr-2" /> Edit
            </button>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-600"
              onClick={() => handleTaskAction('delete', task.id)}
            >
              <BsTrash className="mr-2" /> Delete
            </button>
          </div>
        )}
        
        <h3 className="font-semibold mb-1 line-clamp-2">{task.title}</h3>
        
        {task.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
          {task.assignee && (
            <div>
              <span>{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div>
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Helper function to safely format a date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    
    // If it's already a Date object
    if (date instanceof Date) {
      return format(date, 'MMM d, yyyy');
    } 
    
    // If it's a string, try to parse it
    try {
      return format(parseISO(date), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid date';
    }
  };
  
  // Render mobile-friendly timeline markers
  const renderTimeMarkers = () => {
    if (viewMode !== 'timeline' || sortedTasks.length === 0) return null;
    
    // Find earliest and latest dates
    const taskDates = sortedTasks
      .filter(task => task.dueDate)
      .map(task => {
        if (task.dueDate instanceof Date) {
          return task.dueDate;
        } else {
          try {
            return parseISO(task.dueDate!);
          } catch (error) {
            console.error('Error parsing date:', error);
            return new Date(); // Fallback to current date
          }
        }
      });
    
    if (taskDates.length === 0) return null;
    
    // Sort dates
    taskDates.sort((a, b) => (isAfter(a, b) ? 1 : -1));
    
    // Get earliest and latest
    const earliest = taskDates[0];
    const latest = taskDates[taskDates.length - 1];
    
    // Generate months between earliest and latest
    const markers = [];
    let current = earliest;
    
    while (isBefore(current, latest) || isEqual(current, latest)) {
      markers.push(format(current, isMobile ? 'MMM yy' : 'MMMM yyyy')); // Shorter format for mobile
      current = addMonths(current, 1);
    }
    
    // Render month markers with responsive design
    return (
      <div className="absolute top-0 left-0 h-20 flex z-20 overflow-x-auto w-full">
        {markers.map((marker, index) => (
          <div 
            key={marker} 
            className="flex flex-col items-center px-4 md:px-10 font-medium text-neutral-700 dark:text-neutral-300 flex-shrink-0"
            style={{ left: `${index * (isMobile ? 120 : 300) + 50}px` }}
          >
            <div className="h-8 border-l border-neutral-300 dark:border-neutral-700"></div>
            <div className="text-xs md:text-sm">{marker}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex flex-col bg-white dark:bg-neutral-900 z-40"
    >
      {/* Responsive header */}
      <div className="p-3 md:p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h2 className="text-lg md:text-2xl font-bold text-neutral-800 dark:text-white truncate">Project Timeline</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Responsive view mode selector */}
      <div className="flex justify-center p-2 md:p-4 border-b border-neutral-200 dark:border-neutral-800 z-50 overflow-x-auto">
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center px-2 md:px-4 py-2 rounded-md whitespace-nowrap ${
              viewMode === 'timeline' 
                ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <BsCalendar3 className="mr-1 md:mr-2" />
            <span className="text-sm md:text-base">Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('overview')}
            className={`flex items-center px-2 md:px-4 py-2 rounded-md whitespace-nowrap ${
              viewMode === 'overview' 
                ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <BsCardList className="mr-1 md:mr-2" />
            <span className="text-sm md:text-base">Overview</span>
          </button>
        </div>
      </div>

      {/* Touch gestures help for mobile devices */}
      {isMobile && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300 border-b border-blue-100 dark:border-blue-800">
          <ul className="list-disc pl-5">
            <li>Long press (<span className="font-bold">0.8 seconds</span>) on a task to select and move it</li>
            <li>Use two fingers to pan around the workspace</li>
            <li>Tap the three dots to access task options</li>
            <li>For best experience, use landscape orientation</li>
          </ul>
        </div>
      )}

      {/* Main content area */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-auto p-2 md:p-4"
      >
        {/* Render different views based on viewMode */}
        {viewMode === 'timeline' && (
          <>
            {renderTimeMarkers()}
            <div className="relative mt-20">
              <AnimatePresence>
                {sortedTasks.map((task, index) => renderTaskNode(task, index))}
              </AnimatePresence>
            </div>
          </>
        )}

        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {Object.entries(getTasksByStatus()).map(([status, tasks]) => (
              <div key={status} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 md:p-4">
                <div className="flex items-center mb-3 md:mb-4">
                  {statusConfig[status as keyof typeof statusConfig] && (
                    <div className={`mr-2 ${statusConfig[status as keyof typeof statusConfig].color}`}>
                      {React.createElement(statusConfig[status as keyof typeof statusConfig].icon)}
                    </div>
                  )}
                  <h3 className="font-semibold text-sm md:text-base">{status}</h3>
                  <span className="ml-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs px-2 py-1 rounded-full">
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-2 md:space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="bg-white dark:bg-neutral-750 p-2 md:p-3 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700"
                      onClick={() => isMobile && setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium text-sm line-clamp-1">{task.title}</h4>
                        {isMobile && (
                          <button 
                            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id);
                            }}
                          >
                            <BsThreeDots size={14} />
                          </button>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {formatDate(task.dueDate)}
                        </div>
                      )}
                      
                      {/* Mobile action menu for overview mode */}
                      {activeTaskMenu === task.id && isMobile && (
                        <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-700 flex justify-around">
                          <button 
                            className="flex items-center px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction('edit', task.id);
                            }}
                          >
                            <BsPencil className="mr-1" /> Edit
                          </button>
                          <button 
                            className="flex items-center px-2 py-1 text-xs text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction('delete', task.id);
                            }}
                          >
                            <BsTrash className="mr-1" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Touch indicators for mobile */}
        {isMobile && touchCount > 0 && (
          <div className="fixed bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
            {touchCount} finger{touchCount !== 1 ? 's' : ''} {selectedTask ? '• Task selected' : ''}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Timeline;
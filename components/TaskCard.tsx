"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { format } from 'date-fns';

interface Assignee {
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  assignee: Assignee;
  type: string;
  project: string;
  // Note: connections property is no longer needed but might still exist in data
}

interface Position {
  x: number;
  y: number;
}

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onMove?: (taskId: string, position: Position) => void;
  initialPosition?: Position;
}

// Generate a random position within the viewport
const getRandomPosition = (): Position => {
  // Get viewport dimensions with some padding
  const padding = 100;
  const maxX = Math.max(window.innerWidth - 360, padding); // account for card width
  const maxY = Math.max(window.innerHeight - 280, padding); // account for card height
  
  // Generate random coordinates
  return {
    x: Math.floor(Math.random() * maxX) + 50,
    y: Math.floor(Math.random() * maxY) + 50
  };
};

export default function TaskCard({ 
  task, 
  onClick, 
  onStatusChange, 
  onMove,
  initialPosition
}: TaskCardProps) {
  // Generate random position if not provided
  const [position, setPosition] = useState<Position>(
    initialPosition || getRandomPosition()
  );
  
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#0ea5e9';
      case 'low': return '#22c55e';
      default: return '#737373';
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'design': return '🎨';
      case 'development': return '💻';
      case 'research': return '🔍';
      case 'meeting': return '👥';
      case 'color': return '🖌️';
      case 'typography': return '🔤';
      case 'auth': return '🔒';
      case 'ui': return '📱';
      case 'api': return '🔌';
      case 'content': return '📝';
      case 'seo': return '🔎';
      case 'database': return '💾';
      case 'endpoints': return '🔗';
      case 'security': return '🛡️';
      default: return '📋';
    }
  };

  // Handle status cycle
  const handleStatusCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    
    const statuses = ['To Do', 'In Progress', 'Done'];
    const currentIndex = statuses.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    
    onStatusChange(task.id, statuses[nextIndex]);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-neutral-200 text-neutral-800';
      case 'In Progress': return 'bg-primary-100 text-primary-800';
      case 'Done': return 'bg-success-100 text-success-800';
      default: return 'bg-neutral-200 text-neutral-800';
    }
  };

  // Handle middle mouse button down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only respond to middle mouse button (button === 1)
    if (e.button === 1) {
      e.preventDefault(); // Prevent auto-scroll behavior
      e.stopPropagation();
      
      if (cardRef.current) {
        // Calculate the offset from where the user clicked
        const rect = cardRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        setDragOffset({ x: offsetX, y: offsetY });
        setIsDragging(true);
      }
    }
  }, []);
  
  // Handle mouse movement during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      
      // Calculate new position
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Update card position
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset]);
  
  // Handle mouse up to end dragging
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      
      // Notify parent component of the final position
      if (onMove) {
        onMove(task.id, position);
      }
    }
  }, [isDragging, onMove, task.id, position]);
  
  // Add and remove event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Generate a random rotation for the card (-3 to +3 degrees)
  const getRandomRotation = () => {
    // Use task id to ensure consistent rotation for the same card
    const seed = task.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (seed % 7) - 3; // Range from -3 to +3 degrees
  };

  const rotation = getRandomRotation();

  return (
    <div
      ref={cardRef}
      className={`absolute bg-white dark:bg-neutral-800 rounded-lg shadow-md border-2 border-neutral-200 dark:border-neutral-700 p-4 cursor-pointer transition-all hover:shadow-lg overflow-hidden flex flex-col ${isDragging ? 'shadow-xl ring-2 ring-primary-500 z-50' : 'shadow-lg'}`}
      onClick={isDragging ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      style={{
        minWidth: '320px',
        minHeight: '240px',
        width: '320px',
        height: '240px',
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transform: isDragging ? 'rotate(0deg)' : `rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease, transform 0.3s ease',
        zIndex: isDragging ? 1000 : Math.floor(Math.random() * 10) + 1
      }}
    >
      {/* Card header with task type and project */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className="text-xl mr-2 flex-shrink-0" role="img" aria-label={task.type}>
            {getTypeIcon(task.type)}
          </span>
          <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded truncate max-w-[150px]">
            {task.project}
          </span>
        </div>
        
        {/* Priority indicator */}
        <div 
          className="h-4 w-4 rounded-full flex-shrink-0" 
          style={{ backgroundColor: getPriorityColor(task.priority) }}
          title={`${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority`}
        ></div>
      </div>
      
      {/* Task title */}
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2 text-base">
        {task.title}
      </h3>
      
      {/* Task description - truncated */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3 flex-grow">
        {task.description}
      </p>
      
      {/* Card footer */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-800">
        {/* Assignee */}
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xs flex-shrink-0">
            {task.assignee.name[0]}
          </div>
          <span className="text-xs ml-1 text-neutral-500 dark:text-neutral-400 truncate max-w-[80px]">
            {task.assignee.name}
          </span>
        </div>
        
        {/* Status badge and due date */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
          
          <button 
            onClick={handleStatusCycle}
            className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}
          >
            {task.status}
          </button>
        </div>
      </div>
      
      {/* Card identifier */}
      <div className="absolute top-0 right-0 bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 text-xs text-neutral-500 dark:text-neutral-400 rounded-bl-md">
        #{task.id}
      </div>
      
      {/* Drag indicator - only shown when hovering and not dragging */}
      {isHovered && !isDragging && (
        <div className="absolute top-0 left-0 m-2 text-xs text-neutral-400 dark:text-neutral-500">
          <span title="Middle-click and drag to move">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9l-3 3 3 3"></path>
              <path d="M9 5l3-3 3 3"></path>
              <path d="M15 19l3 3 3-3"></path>
              <path d="M19 9l3 3-3 3"></path>
              <path d="M2 12h20"></path>
              <path d="M12 2v20"></path>
            </svg>
          </span>
        </div>
      )}
      
      {/* Quick actions on hover - only shown when not dragging */}
      {isHovered && !isDragging && (
        <div className="absolute top-8 right-2 bg-white dark:bg-neutral-800 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700 p-1 flex space-x-1">
          <button 
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded" 
            title="Edit task"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit logic here or through parent
            }}
          >
            ✏️
          </button>
        </div>
      )}
    </div>
  );
} 
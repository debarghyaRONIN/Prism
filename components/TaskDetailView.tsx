"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Position {
  x: number;
  y: number;
}

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
  position: Position;
  connections: string[];
  project: string;
}

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit?: () => void;
}

export default function TaskDetailView({ task, onClose, onComplete, onDelete, onEdit }: TaskDetailViewProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusTransition, setStatusTransition] = useState(false);
  
  // Reset completing state when task status changes
  useEffect(() => {
    if (isCompleting) {
      setIsCompleting(false);
      // Show status transition animation
      setStatusTransition(true);
      const timer = setTimeout(() => {
        setStatusTransition(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [task.status, isCompleting]);
  
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
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-neutral-200 text-neutral-800';
      case 'In Progress': return 'bg-primary-100 text-primary-800';
      case 'Done': return 'bg-success-100 text-success-800';
      default: return 'bg-neutral-200 text-neutral-800';
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'design': return '🎨';
      case 'development': return '💻';
      case 'research': return '🔍';
      case 'meeting': return '👥';
      default: return '📋';
    }
  };
  
  // Use useCallback for event handlers to prevent unnecessary rerenders
  const handleComplete = useCallback(() => {
    setIsCompleting(true);
    // Add a small delay to show the completing state
    setTimeout(() => {
      // Toggle the task status between 'Done' and previous status
      onComplete(task.id);
    }, 500);
  }, [onComplete, task.id]);
  
  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);
  
  const handleDeleteConfirm = useCallback(() => {
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    // Add a small delay to show the deleting state
    setTimeout(() => {
      onDelete(task.id);
    }, 500);
  }, [onDelete, task.id]);
  
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);
  
  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 } 
    },
    exit: { 
      opacity: 0,
      scale: 0.95, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        {...{} as any}
      >
        {/* Header */}
        <div className="relative">
          {/* Color bar based on priority */}
          <div 
            className="h-2 w-full" 
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          ></div>
          
          <div className="p-6 pb-4">
            <div className="flex justify-between">
              <div className="flex items-start space-x-2">
                <span className="text-xl">{getTypeIcon(task.type)}</span>
                <div>
                  <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded mb-1 inline-block">
                    {task.project}
                  </span>
                  <h2 className="text-xl font-bold">{task.title}</h2>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-2xl w-8 h-8 flex items-center justify-center transition-colors"
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            
            <div className="flex items-center space-x-3 mt-4">
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)} transition-all duration-300 ${statusTransition ? 'scale-110 ring-2 ring-offset-2 ring-primary-300 dark:ring-primary-700' : ''}`}
              >
                {task.status}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                backgroundColor: `${getPriorityColor(task.priority)}20`,
                color: getPriorityColor(task.priority)
              }}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6 pt-2">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Description</h3>
            <p className="text-neutral-800 dark:text-neutral-200">
              {task.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Assignee</h3>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm mr-2">
                  {task.assignee.name[0]}
                </div>
                <span>{task.assignee.name}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Due Date</h3>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          
          {/* You could add more details here if needed */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Connected Tasks</h3>
            {task.connections.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {task.connections.map(taskId => (
                  <span key={taskId} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
                    Task #{taskId.replace('t', '')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No connected tasks</p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-6 pt-0 flex justify-end space-x-3 border-t border-neutral-200 dark:border-neutral-800 mt-4">
          {showDeleteConfirm ? (
            <>
              <div className="mr-auto text-neutral-600 dark:text-neutral-400">
                Are you sure you want to delete this task?
              </div>
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-danger-500 text-white hover:bg-danger-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                disabled={isDeleting}
              >
                Delete
              </button>
              
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Edit
                </button>
              )}
              
              <button
                onClick={handleComplete}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                disabled={isCompleting}
              >
                {isCompleting 
                  ? (task.status === 'Done' ? 'Reopening...' : 'Completing...') 
                  : (task.status === 'Done' ? 'Reopen Task' : 'Mark Complete')
                }
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
} 
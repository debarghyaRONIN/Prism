"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfDay, differenceInDays } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  assignee: { name: string; avatar: string };
  type: string;
  connections: string[]; // Array of connected task IDs
}

interface TimelineProps {
  tasks: Task[];
  onClose: () => void;
}

type ViewMode = 'timeline' | 'overview' | 'graph';

export default function Timeline({ tasks, onClose }: TimelineProps) {
  // State to track which view mode is active - show graph view by default for demonstration
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const taskNodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [arrows, setArrows] = useState<Array<{from: string, to: string, path: string}>>([]);

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  // Find earliest and latest dates
  const earliestDate = sortedTasks.length > 0 ? startOfDay(sortedTasks[0].dueDate) : startOfDay(new Date());
  const latestDate = sortedTasks.length > 0 ? startOfDay(sortedTasks[sortedTasks.length - 1].dueDate) : startOfDay(addDays(new Date(), 7));
  
  // Create array of dates for timeline
  const daysBetween = differenceInDays(latestDate, earliestDate) + 1;
  const dateArray = Array.from({ length: daysBetween }, (_, i) => addDays(earliestDate, i));
  
  // Helper to position task on timeline
  const getTaskPosition = (taskDate: Date) => {
    const days = differenceInDays(startOfDay(taskDate), earliestDate);
    return `${(days / (daysBetween - 1)) * 100}%`;
  };
  
  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#0ea5e9';
      case 'low': return '#22c55e';
      default: return '#737373';
    }
  };

  // Group tasks by status for overview
  const tasksByStatus = {
    'To Do': sortedTasks.filter(task => task.status === 'To Do'),
    'In Progress': sortedTasks.filter(task => task.status === 'In Progress'),
    'Done': sortedTasks.filter(task => task.status === 'Done')
  };

  // Create a map for looking up tasks by ID
  const taskMap = tasks.reduce((map, task) => {
    map.set(task.id, task);
    return map;
  }, new Map<string, Task>());

  // Find root tasks (tasks that no other task connects to)
  const findRootTasks = () => {
    // Create a set of all task IDs that are connected to by some other task
    const childTaskIds = new Set<string>();
    tasks.forEach(task => {
      task.connections.forEach(connId => {
        childTaskIds.add(connId);
      });
    });
    
    // Return tasks that aren't in the childTaskIds set
    return tasks.filter(task => !childTaskIds.has(task.id));
  };

  // Simplified animation for better performance
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  // Calculate a reasonable subset of tasks to display to reduce animation load
  const displayedTasks = sortedTasks.slice(0, 10); // Only show up to 10 tasks

  // After initializing viewMode
  useEffect(() => {
    // When we switch to the relationship view, generate some example connections if needed
    if (viewMode === 'graph' && tasks.some(task => !task.connections)) {
      // Add connections data to tasks that don't have it
      // This is only for demonstration purposes
      const exampleConnections = [
        { source: 0, targets: [1, 2] },         // First task connects to second and third
        { source: 1, targets: [3, 4] },         // Second task connects to fourth and fifth
        { source: 2, targets: [5] },            // Third task connects to sixth
        { source: 5, targets: [6, 7] },         // Sixth task connects to seventh and eighth
        { source: 3, targets: [8] }             // Fourth task connects to ninth
      ];
      
      // Add connections to tasks for demonstration
      console.log("Adding example connections for demonstration");
    }
  }, [viewMode, tasks]);

  // Update the useEffect for calculating arrows to handle tasks without connections array
  useEffect(() => {
    if (viewMode !== 'graph' || !graphContainerRef.current) return;

    // Wait for layout to complete
    const timer = setTimeout(() => {
      const newArrows: Array<{from: string, to: string, path: string}> = [];
      
      // For each task, draw connections to its linked tasks
      tasks.forEach(task => {
        const sourceElement = taskNodeRefs.current.get(task.id);
        if (!sourceElement) return;

        const sourceRect = sourceElement.getBoundingClientRect();
        const containerRect = graphContainerRef.current!.getBoundingClientRect();

        // Calculate source position relative to the container
        const sourceX = sourceRect.left - containerRect.left + sourceRect.width / 2;
        const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;

        // For each connection, draw an arrow
        // Handle tasks that might not have connections array
        const connections = task.connections || [];
        connections.forEach(targetId => {
          const targetElement = taskNodeRefs.current.get(targetId);
          if (!targetElement) return;

          const targetRect = targetElement.getBoundingClientRect();
          
          // Calculate target position relative to the container
          const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
          const targetY = targetRect.top - containerRect.top + targetRect.height / 2;

          // Calculate control points for curved arrow
          const dx = targetX - sourceX;
          const dy = targetY - sourceY;
          const controlX = sourceX + dx / 2;
          const controlY = sourceY + dy / 2;

          // Adjust end points to stop at card edges
          const angle = Math.atan2(dy, dx);
          const sourceRadius = Math.min(sourceRect.width, sourceRect.height) / 2;
          const targetRadius = Math.min(targetRect.width, targetRect.height) / 2;
          
          const sourceEndX = sourceX + Math.cos(angle) * sourceRadius;
          const sourceEndY = sourceY + Math.sin(angle) * sourceRadius;
          const targetEndX = targetX - Math.cos(angle) * targetRadius;
          const targetEndY = targetY - Math.sin(angle) * targetRadius;

          // Create SVG path
          const path = `M ${sourceEndX} ${sourceEndY} Q ${controlX} ${controlY} ${targetEndX} ${targetEndY}`;
          
          newArrows.push({
            from: task.id,
            to: targetId,
            path
          });
        });
      });

      setArrows(newArrows);
    }, 100);

    return () => clearTimeout(timer);
  }, [viewMode, tasks]);

  // Recursive function to render task hierarchy
  const renderTaskHierarchy = (taskId: string, level: number = 0, visited = new Set<string>()): React.ReactNode => {
    // Prevent circular references
    if (visited.has(taskId)) {
      return <div key={`cycle-${taskId}`} className="text-red-500 text-xs ml-4">Circular reference</div>;
    }
    
    const task = taskMap.get(taskId);
    if (!task) {
      return <div key={`missing-${taskId}`} className="text-red-500 text-xs ml-4">Task not found</div>;
    }

    const newVisited = new Set(visited);
    newVisited.add(taskId);
    
    const getTaskEl = (task: Task, isChild = false) => (
      <div 
        key={task.id}
        ref={el => {
          if (el) taskNodeRefs.current.set(task.id, el);
        }}
        className={`bg-white dark:bg-neutral-800 p-3 rounded-lg border-l-4 shadow-sm mb-3 ${isChild ? 'ml-4' : ''}`}
        style={{
          borderLeftColor: getPriorityColor(task.priority),
          transform: `translateX(${level * 20}px)`
        }}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{task.title}</h3>
          <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded">
            {task.status}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="text-neutral-500 dark:text-neutral-400">
            {format(task.dueDate, 'MMM d')}
          </span>
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-[10px] mr-1">
              {task.assignee.name[0]}
            </div>
            <span className="text-neutral-500 dark:text-neutral-400 max-w-[80px] truncate">
              {task.assignee.name}
            </span>
          </div>
        </div>
      </div>
    );

    if (task.connections.length === 0) {
      return getTaskEl(task);
    }

    return (
      <div key={task.id} className="mb-4">
        {getTaskEl(task)}
        <div className="pl-4 border-l border-neutral-200 dark:border-neutral-700 ml-4">
          {task.connections.map(connId => renderTaskHierarchy(connId, level + 1, newVisited))}
        </div>
      </div>
    );
  };
  
  const rootTasks = findRootTasks();
  
  return (
    <div className="focus-mode">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={modalVariants}
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-4xl p-8"
        {...{} as any}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
            {viewMode === 'timeline' ? "Project Timeline" : 
             viewMode === 'overview' ? "Task Overview" : 
             "Task Relationships"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center ${
                  viewMode === 'timeline' 
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400' 
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <polyline points="8 8 12 4 16 8"></polyline>
                  <polyline points="16 16 12 20 8 16"></polyline>
                </svg>
                Timeline
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center ${
                  viewMode === 'overview' 
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400' 
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <path d="M3 9h18"></path>
                  <path d="M9 21V9"></path>
                </svg>
                Overview
              </button>
              <button
                onClick={() => setViewMode('graph')}
                className={`px-3 py-1.5 text-xs rounded-md flex items-center ${
                  viewMode === 'graph' 
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400' 
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Relationships
              </button>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-2xl w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Close timeline"
            >
              ×
            </button>
          </div>
        </div>
        
        {viewMode === 'timeline' && (
          /* Timeline view */
          <div className="relative mt-16 mb-16">
            {/* Timeline track */}
            <div className="absolute h-1 bg-neutral-200 dark:bg-neutral-700 w-full top-7 rounded-full"></div>
            
            {/* Date markers - limit to every other date for less visual noise */}
            <div className="relative">
              {dateArray.filter((_, i) => i % 2 === 0 || i === dateArray.length - 1).map((date, index, filteredArray) => (
                <div 
                  key={format(date, 'yyyy-MM-dd')}
                  className="absolute top-0 transform -translate-x-1/2"
                  style={{ left: `${(index / (filteredArray.length - 1)) * 100}%` }}
                >
                  <div className="h-3 w-3 bg-neutral-400 dark:bg-neutral-500 rounded-full mb-2"></div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    {format(date, 'MMM d')}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tasks - simplified rendering */}
            <div className="relative pt-16">
              {displayedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="absolute transform -translate-x-1/2 transition-opacity duration-300"
                  style={{ 
                    left: getTaskPosition(task.dueDate),
                    top: (index % 3) * 80 + 16, // Stack tasks to avoid overlap
                    opacity: 1
                  }}
                >
                  <div 
                    className="w-4 h-16 absolute top-[-16px] left-1/2 transform -translate-x-1/2"
                    style={{ 
                      background: `linear-gradient(to bottom, transparent, ${getPriorityColor(task.priority)})` 
                    }}
                  ></div>
                  <div 
                    className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg border-t-4 w-48"
                    style={{ borderTopColor: getPriorityColor(task.priority) }}
                  >
                    <h3 className="font-medium text-sm truncate">{task.title}</h3>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {format(task.dueDate, 'MMM d')}
                      </span>
                      <div className="h-5 w-5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-[10px]">
                        {task.assignee.name[0]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {viewMode === 'overview' && (
          /* Overview mode */
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <div key={status} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-3 text-center py-2 rounded-md" style={{
                  backgroundColor: status === 'To Do' ? '#f1f5f9' : status === 'In Progress' ? '#e0f2fe' : '#dcfce7',
                  color: status === 'To Do' ? '#475569' : status === 'In Progress' ? '#0369a1' : '#16a34a'
                }}>
                  {status} ({statusTasks.length})
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {statusTasks.map(task => (
                    <div 
                      key={task.id}
                      className="bg-white dark:bg-neutral-700 p-3 rounded-md shadow-sm border-l-4 text-sm"
                      style={{ borderLeftColor: getPriorityColor(task.priority) }}
                    >
                      <h4 className="font-medium truncate mb-2">{task.title}</h4>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                          </svg>
                          <span className="text-xs font-bold">{format(task.dueDate, 'MMM d')}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white text-[10px]">
                            {task.assignee.name[0]}
                          </div>
                          <span className="text-xs ml-1 text-neutral-500 dark:text-neutral-400 max-w-[60px] truncate">{task.assignee.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {statusTasks.length === 0 && (
                    <div className="text-center text-neutral-500 dark:text-neutral-400 text-xs py-4">
                      No tasks in this status
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'graph' && (
          /* Graph view showing task relationships */
          <div 
            ref={graphContainerRef}
            className="relative bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 min-h-[400px] max-h-[500px] overflow-auto"
          >
            {/* Render task relationships with arrows */}
            <div className="relative">
              {/* SVG overlay for arrows */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {arrows.map((arrow, index) => (
                  <g key={`arrow-${index}`}>
                    <path
                      d={arrow.path}
                      fill="none"
                      stroke="rgba(99, 102, 241, 0.6)"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                ))}
                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L6,3 Z" fill="rgba(99, 102, 241, 0.8)" />
                  </marker>
                </defs>
              </svg>

              {/* Task hierarchy cards */}
              <div className="space-y-6 relative z-10">
                {rootTasks.length > 0 ? (
                  rootTasks.map(task => renderTaskHierarchy(task.id))
                ) : (
                  <div className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                    No clear task hierarchy found. Try connecting tasks through the task editor.
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 border-t border-neutral-200 dark:border-neutral-700 pt-4 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-0 border-t-2 border-dashed border-indigo-400 mr-1"></div>
                  <span>Task connection/dependency</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  <span>High priority</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Medium priority</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>Low priority</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 
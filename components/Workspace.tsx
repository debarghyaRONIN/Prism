"use client";

import { useState, useRef, forwardRef, useImperativeHandle, useEffect, useCallback, useMemo, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { format } from 'date-fns';
import TaskCard from '../components/TaskCard';
import FocusMode from '../components/FocusMode';
import Timeline from '../components/Timeline';
import Analytics from '../components/Analytics';
import TaskDetailView from './TaskDetailView';
import TaskDialog from './TaskDialog';
import NavigationHelp from './NavigationHelp';

// Define the Task interface
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

// Sample initial task data
const initialTasks = [
  {
    id: 't1',
    title: 'Design System Components',
    description: 'Create reusable UI components for the design system',
    status: 'In Progress',
    priority: 'high',
    dueDate: new Date('2025-01-03'), // Static date instead of Date.now()
    assignee: { name: 'Alice', avatar: '' },
    type: 'design',
    position: { x: 100, y: 100 },
    connections: ['t6', 't9', 't11', 't12'],
    project: 'Design System'
  },
  {
    id: 't2',
    title: 'User Authentication Flow',
    description: 'Implement login, registration, and password reset',
    status: 'To Do',
    priority: 'urgent',
    dueDate: new Date('2025-01-01'), // Static date
    assignee: { name: 'Bob', avatar: '' },
    type: 'auth',
    position: { x: 800, y: 100 },
    connections: ['t15', 't16', 't25'],
    project: 'Mobile App'
  },
  {
    id: 't3',
    title: 'API Integration',
    description: 'Connect frontend with backend services',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date('2025-01-05'), // Static date
    assignee: { name: 'Charlie', avatar: '' },
    type: 'api',
    position: { x: 800, y: 900 },
    connections: ['t8', 't21', 't23'],
    project: 'Backend API'
  },
  {
    id: 't4',
    title: 'User Research',
    description: 'Conduct interviews with potential users',
    status: 'Done',
    priority: 'low',
    dueDate: new Date('2024-12-29'), // Static date
    assignee: { name: 'Diana', avatar: '' },
    type: 'research',
    position: { x: 100, y: 900 },
    connections: ['t5', 't17', 't18', 't19'],
    project: 'Marketing Website'
  },
  {
    id: 't5',
    title: 'Competitive Analysis',
    description: 'Research competitors and identify market gaps',
    status: 'Done',
    priority: 'low',
    dueDate: new Date('2024-12-28'), // Static date
    assignee: { name: 'Eva', avatar: '' },
    type: 'research',
    position: { x: 400, y: 900 },
    connections: ['t4', 't17', 't19'],
    project: 'Marketing Website'
  },
  {
    id: 't6',
    title: 'Color Palette Definition',
    description: 'Define brand color palette and accessibility guidelines',
    status: 'In Progress',
    priority: 'medium',
    dueDate: new Date('2025-01-02'), // Static date
    assignee: { name: 'Alice', avatar: '' },
    type: 'color',
    position: { x: 400, y: 100 },
    connections: ['t1', 't10', 't11'],
    project: 'Design System'
  },
  {
    id: 't7',
    title: 'Push Notification Setup',
    description: 'Implement push notification service for mobile users',
    status: 'To Do',
    priority: 'high',
    dueDate: new Date('2025-01-04'), // Static date
    assignee: { name: 'Bob', avatar: '' },
    type: 'api',
    position: { x: 1100, y: 100 },
    connections: ['t13', 't16'],
    project: 'Mobile App'
  },
  {
    id: 't8',
    title: 'Database Schema Design',
    description: 'Design and document the database schema for the API',
    status: 'In Progress',
    priority: 'high',
    dueDate: new Date('2025-01-02'), // Static date
    assignee: { name: 'Charlie', avatar: '' },
    type: 'database',
    position: { x: 1100, y: 900 },
    connections: ['t3', 't24', 't28'],
    project: 'Backend API'
  },
  {
    id: 't9',
    title: 'Typography Guidelines',
    description: 'Create typography scale and usage guidelines',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date('2025-01-03'), // Static date
    assignee: { name: 'Alice', avatar: '' },
    type: 'typography',
    position: { x: 100, y: 300 },
    connections: ['t1', 't10', 't26'],
    project: 'Design System'
  },
  {
    id: 't10',
    title: 'Form Components',
    description: 'Design and implement form input components',
    status: 'In Progress',
    priority: 'high',
    dueDate: new Date('2025-01-05'), // Static date
    assignee: { name: 'Diana', avatar: '' },
    type: 'design',
    position: { x: 400, y: 300 },
    connections: ['t1', 't11', 't26'],
    project: 'Design System'
  },
  {
    id: 't11',
    title: 'Accessibility Audit',
    description: 'Review components for accessibility compliance',
    status: 'To Do',
    priority: 'urgent',
    dueDate: new Date('2025-01-02'), // Static date
    assignee: { name: 'Eva', avatar: '' },
    type: 'design',
    position: { x: 100, y: 500 },
    connections: ['t1', 't6', 't10'],
    project: 'Design System'
  },
  {
    id: 't12',
    title: 'Icon Library',
    description: 'Create and categorize icon set for the design system',
    status: 'In Progress',
    priority: 'medium',
    dueDate: new Date('2025-01-06'), // Static date
    assignee: { name: 'Alice', avatar: '' },
    type: 'design',
    position: { x: 400, y: 500 },
    connections: ['t1', 't26'],
    project: 'Design System'
  },
  {
    id: 't13',
    title: 'Onboarding Flow',
    description: 'Design and implement user onboarding experience',
    status: 'To Do',
    priority: 'high',
    dueDate: new Date('2025-01-07'), // Static date
    assignee: { name: 'Bob', avatar: '' },
    type: 'ui',
    position: { x: 800, y: 300 },
    connections: ['t2', 't14', 't15'],
    project: 'Mobile App'
  },
  {
    id: 't14',
    title: 'Gesture Controls',
    description: 'Implement intuitive gesture controls for mobile',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date('2025-01-08'), // Static date
    assignee: { name: 'Charlie', avatar: '' },
    type: 'ux',
    position: { x: 1100, y: 300 },
    connections: ['t13', 't15', 't16'],
    project: 'Mobile App'
  },
  {
    id: 't15',
    title: 'Offline Mode',
    description: 'Implement offline functionality with data sync',
    status: 'To Do',
    priority: 'high',
    dueDate: new Date('2025-01-05'), // Static date
    assignee: { name: 'Diana', avatar: '' },
    type: 'feature',
    position: { x: 800, y: 500 },
    connections: ['t2', 't13', 't14'],
    project: 'Mobile App'
  },
  {
    id: 't16',
    title: 'Performance Optimization',
    description: 'Optimize app performance on low-end devices',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date('2025-01-06'), // Static date
    assignee: { name: 'Eva', avatar: '' },
    type: 'optimization',
    position: { x: 1100, y: 500 },
    connections: ['t2', 't7', 't14'],
    project: 'Mobile App'
  },
  {
    id: 't17',
    title: 'SEO Optimization',
    description: 'Optimize website content for search engines',
    status: 'In Progress',
    priority: 'high',
    dueDate: new Date('2025-01-03'), // Static date
    assignee: { name: 'Alice', avatar: '' },
    type: 'seo',
    position: { x: 100, y: 1100 },
    connections: ['t4', 't5', 't18'],
    project: 'Marketing Website'
  },
  {
    id: 't18',
    title: 'Content Creation',
    description: 'Develop compelling content for the marketing website',
    status: 'In Progress',
    priority: 'medium',
    dueDate: new Date('2025-01-04'), // Static date
    assignee: { name: 'Bob', avatar: '' },
    type: 'content',
    position: { x: 400, y: 1100 },
    connections: ['t4', 't17', 't20'],
    project: 'Marketing Website'
  },
  {
    id: 't19',
    title: 'Case Studies',
    description: 'Create case studies highlighting customer success stories',
    status: 'In Progress',
    priority: 'low',
    dueDate: new Date('2025-01-10'), // Static date
    assignee: { name: 'Charlie', avatar: '' },
    type: 'content',
    position: { x: 100, y: 1300 },
    connections: ['t4', 't5', 't20'],
    project: 'Marketing Website'
  },
  {
    id: 't20',
    title: 'Testimonial Collection',
    description: 'Collect and format customer testimonials',
    status: 'Done',
    priority: 'low',
    dueDate: new Date('2024-12-27'), // Static date
    assignee: { name: 'Diana', avatar: '' },
    type: 'content',
    position: { x: 400, y: 1300 },
    connections: ['t18', 't19', 't27'],
    project: 'Marketing Website'
  },
  {
    id: 't21',
    title: 'Authentication Middleware',
    description: 'Implement JWT authentication middleware',
    status: 'In Progress',
    priority: 'urgent',
    dueDate: new Date('2025-01-01'), // Static date
    assignee: { name: 'Eva', avatar: '' },
    type: 'security',
    position: { x: 800, y: 1100 },
    connections: ['t3', 't22', 't23'],
    project: 'Backend API'
  },
  {
    id: 't22',
    title: 'Rate Limiting',
    description: 'Implement rate limiting for API endpoints',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date('2025-01-05'), // Static date
    assignee: { name: 'Alice', avatar: '' },
    type: 'security',
    position: { x: 1100, y: 1100 },
    connections: ['t21', 't23'],
    project: 'Backend API'
  },
  {
    id: 't23',
    title: 'User Endpoints',
    description: 'Create CRUD endpoints for user management',
    status: 'In Progress',
    priority: 'high',
    dueDate: new Date('2025-01-03'), // Static date
    assignee: { name: 'Bob', avatar: '' },
    type: 'endpoints',
    position: { x: 800, y: 1300 },
    connections: ['t3', 't21', 't22'],
    project: 'Backend API'
  },
  {
    id: 't24',
    title: 'Database Indexing',
    description: 'Optimize database queries with proper indexing',
    status: 'To Do',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 4),
    assignee: { name: 'Charlie', avatar: '' },
    type: 'database',
    position: { x: 1100, y: 1300 },
    connections: ['t8', 't28'],
    project: 'Backend API'
  },
  {
    id: 't25',
    title: 'Advanced Search Implementation',
    description: 'Create advanced search functionality with filters',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 7),
    assignee: { name: 'Diana', avatar: '' },
    type: 'ui',
    position: { x: 800, y: 700 },
    connections: ['t2', 't14', 't16'],
    project: 'Mobile App'
  },
  {
    id: 't26',
    title: 'Analytics Dashboard',
    description: 'Design and implement analytics dashboard for admins',
    status: 'In Progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 6),
    assignee: { name: 'Eva', avatar: '' },
    type: 'design',
    position: { x: 100, y: 700 },
    connections: ['t9', 't10', 't12'],
    project: 'Design System'
  },
  {
    id: 't27',
    title: 'Responsive Testing',
    description: 'Test website on various devices and screen sizes',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3),
    assignee: { name: 'Alice', avatar: '' },
    type: 'content',
    position: { x: 100, y: 1500 },
    connections: ['t18', 't20'],
    project: 'Marketing Website'
  },
  {
    id: 't28',
    title: 'Data Migration Scripts',
    description: 'Create scripts for migrating legacy data',
    status: 'In Progress',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 86400000 * 1),
    assignee: { name: 'Bob', avatar: '' },
    type: 'database',
    position: { x: 800, y: 1500 },
    connections: ['t8', 't24'],
    project: 'Backend API'
  }
];

// Create a properly typed motion button component
const MotionButton = motion.button as any;

interface WorkspaceProps {
  showFocusMode: boolean;
  showTimeline: boolean;
  showAnalytics?: boolean;
  onProjectCountsUpdate?: (counts: Record<string, number>) => void;
  onToggleFocusMode?: () => void;
  onToggleTimeline?: () => void;
  onToggleAnalytics?: () => void;
  activeCategory?: string;
}

// Export types for the ref
export interface WorkspaceHandle {
  addNewTask: (projectName?: string) => void;
}

const Workspace = forwardRef<WorkspaceHandle, WorkspaceProps>(
  function Workspace({ 
    showFocusMode, 
    showTimeline, 
    showAnalytics = false,
    onProjectCountsUpdate, 
    onToggleFocusMode, 
    onToggleTimeline,
    onToggleAnalytics,
    activeCategory = 'all'
  }, ref) {
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTask, setActiveTask] = useState<string | null>(null);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [detailViewTask, setDetailViewTask] = useState<string | null>(null);
    const [zoomScale, setZoomScale] = useState(1);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
    const [newTaskProject, setNewTaskProject] = useState<string>('');
    const [activeProject, setActiveProject] = useState<string>('Design System');
    // Add panning state
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [showPanHint, setShowPanHint] = useState(false);
    const [showNavHelp, setShowNavHelp] = useState(false);
    const [showMiddleClickHint, setShowMiddleClickHint] = useState(false);
    const middleClickHintTimer = useRef<NodeJS.Timeout | null>(null);
    
    const workspaceRef = useRef<HTMLDivElement>(null);
    
    // Show panning hint when zoomed out significantly
    useEffect(() => {
      if (zoomScale < 0.3) {
        setShowPanHint(true);
        const timer = setTimeout(() => {
          setShowPanHint(false);
        }, 4000);
        
        return () => clearTimeout(timer);
      }
    }, [zoomScale]);
    
    // Zoom in function - increase scale by 0.1
    const handleZoomIn = useCallback(() => {
      setZoomScale(prevScale => Math.min(prevScale + 0.1, 2)); // Limit max zoom to 2x
    }, []);
    
    // Zoom out function - decrease scale by 0.1 with minimum limit of 0.01 (1%)
    const handleZoomOut = useCallback(() => {
      setZoomScale(prevScale => Math.max(prevScale - 0.1, 0.01)); // Prevent going below 1%
    }, []);
    
    // Filter tasks based on activeCategory and activeProject
    const visibleTasks = useMemo(() => {
      // First filter by project
      const projectTasks = tasks.filter(task => task.project === activeProject);
      
      // Then filter by category if needed
      if (activeCategory === 'all') {
        return projectTasks;
      }
      
      // Filter by category - each task's type should match the selected category ID
      return projectTasks.filter(task => task.type === activeCategory);
    }, [tasks, activeCategory, activeProject]);
    
    // Reset zoom function - set zoom scale to 1 and center on all visible tasks
    const handleResetZoom = useCallback(() => {
      // Reset zoom scale
      setZoomScale(1);
      
      // Calculate the center point of all visible tasks
      if (visibleTasks.length > 0) {
        // Find bounding box of all visible tasks
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        
        visibleTasks.forEach(task => {
          // Task card is 320px wide and 240px tall
          minX = Math.min(minX, task.position.x);
          minY = Math.min(minY, task.position.y);
          maxX = Math.max(maxX, task.position.x + 320);
          maxY = Math.max(maxY, task.position.y + 240);
        });
        
        // Calculate center point of all tasks
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        // Calculate required pan offset to center view on all tasks
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        setPanOffset({
          x: viewportWidth / 2 - centerX,
          y: viewportHeight / 2 - centerY
        });
        
        // Add some padding to ensure all tasks are visible
        const padding = 40; // pixels
        const contentWidth = maxX - minX + (padding * 2);
        const contentHeight = maxY - minY + (padding * 2);
        
        // If content is larger than viewport, adjust zoom to fit
        if (contentWidth > viewportWidth || contentHeight > viewportHeight) {
          const scaleX = viewportWidth / contentWidth;
          const scaleY = viewportHeight / contentHeight;
          const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in, only out if needed
          
          if (scale < 1) {
            setZoomScale(scale);
            
            // Adjust pan offset for new scale
            setPanOffset({
              x: (viewportWidth / 2 - centerX) * scale,
              y: (viewportHeight / 2 - centerY) * scale
            });
          }
        }
      } else {
        // If no tasks, just reset to origin
        setPanOffset({ x: 0, y: 0 });
      }
      
      // Also reset task selection states
      setActiveTask(null);
      setDraggedTask(null);
    }, [visibleTasks]);
    
    // Handle panning - start drag
    const handlePanStart = useCallback((e: React.MouseEvent) => {
      // Only start panning with left mouse button (button 0)
      if (e.button === 0) { 
        const target = e.target as HTMLElement;
        const isEmptySpaceClick = 
          e.target === e.currentTarget || 
          target.hasAttribute('data-workspace') || 
          target.closest('[data-workspace="true"]') !== null;
        
        if (isEmptySpaceClick) {
          // Clear active task when clicking empty space
          if (activeTask) {
            setActiveTask(null);
          }
          
          // Clear any task being dragged
          if (draggedTask) {
            setDraggedTask(null);
          }
          
          setIsPanning(true);
          setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
          
          // Update cursor style
          document.body.style.cursor = 'grabbing';
        }
      }
    }, [activeTask, draggedTask, panOffset]);
    
    // Handle panning - during drag
    const handlePanMove = useCallback((e: React.MouseEvent) => {
      if (isPanning) {
        // Simple direct state update - no animation frames needed
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y
        });
      }
    }, [isPanning, panStart]);
    
    // Handle panning - end drag
    const handlePanEnd = useCallback(() => {
      setIsPanning(false);
      // Reset cursor
      document.body.style.cursor = '';
    }, []);
    
    // Add mouseup and mousemove event listeners for panning
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isPanning) {
          setPanOffset({
            x: e.clientX - panStart.x,
            y: e.clientY - panStart.y
          });
        }
      };
      
      const handleMouseUp = () => {
        if (isPanning) {
          setIsPanning(false);
          // Reset cursor
          document.body.style.cursor = '';
        }
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isPanning, panStart, setPanOffset]);
    
    // Count tasks by project for the UI
    const projectCounts = useMemo(() => {
      const counts: Record<string, number> = {};
      
      // Count tasks by project
      tasks.forEach(task => {
        if (!counts[task.project]) {
          counts[task.project] = 0;
        }
        counts[task.project]++;
      });
      
      return counts;
    }, [tasks]);

    // Memoize the connection paths to avoid recalculating on every render
    const connectionPaths = useMemo(() => {
      // Return empty array to disable connections
      return [];
    }, []);

    // Function to calculate live connection paths based on current positions
    // This ensures lines stay connected even as tasks move
    const getConnectionPath = useCallback(() => {
      // Return empty path string since connections are disabled
      return '';
    }, []);

    // Memoize the minimap dots to avoid recalculating on every render
    const minimapDots = useMemo(() => {
      if (zoomScale >= 0.25) return []; // Only calculate if minimap is visible
      
      return tasks
        .filter(task => task.project === activeProject)
        .map(task => ({
          id: task.id,
          x: (task.position.x / 2000) * 100,
          y: (task.position.y / 1200) * 100,
          color: task.id === activeTask ? '#0ea5e9' : 
                task.status === 'Done' ? '#22c55e' : 
                task.priority === 'urgent' ? '#ef4444' : 
                '#f59e0b',
          title: task.title
        }));
    }, [tasks, activeProject, activeTask, zoomScale]);
    
    // For ambient auras, limit the number and only render when needed
    const renderAmbientAuras = useCallback(() => {
      // Limit to just 2-3 auras for better performance
      const visibleAuraTasks = visibleTasks.slice(0, 3);
      
      return visibleAuraTasks.map(task => {
        let color;
        switch (task.priority) {
          case 'urgent': color = 'rgba(239, 68, 68, 0.03)';
            break;
          case 'high': color = 'rgba(245, 158, 11, 0.03)';
            break;
          case 'medium': color = 'rgba(14, 165, 233, 0.03)';
            break;
          case 'low': color = 'rgba(34, 197, 94, 0.03)';
            break;
          default: color = 'rgba(156, 163, 175, 0.03)';
        }
        
        return (
          <div
            key={`aura-${task.id}`}
            className="absolute rounded-full"
            style={{
              left: task.position.x + 75,
              top: task.position.y + 50,
              width: 200,
              height: 200,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`,
              zIndex: 0
            }}
          />
        );
      });
    }, [visibleTasks]);

    // Calculate project counts for sidebar
    useEffect(() => {
      if (onProjectCountsUpdate) {
        onProjectCountsUpdate(projectCounts);
      }
    }, [projectCounts, onProjectCountsUpdate]);

    // Handle project change from sidebar
    useEffect(() => {
      // Listen for changes to activeProject from Sidebar
      const handleProjectChange = (event: CustomEvent) => {
        if (event.detail && event.detail.project) {
          setActiveProject(event.detail.project);
        }
      };
      
      window.addEventListener('projectChange' as any, handleProjectChange);
      
      return () => {
        window.removeEventListener('projectChange' as any, handleProjectChange);
      };
    }, []);
    
    // Add keyboard shortcuts for zooming
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        
        if (isCtrlOrCmd) {
          if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            handleZoomIn();
          } else if (e.key === '-') {
            e.preventDefault();
            handleZoomOut();
          } else if (e.key === '0') {
            e.preventDefault();
            handleResetZoom();
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleZoomIn, handleZoomOut, handleResetZoom]);
    
    // Expose the addNewTask method
    useImperativeHandle(ref, () => ({
      addNewTask: (projectName?: string) => {
        // If project name is provided, use it, otherwise use current active project
        setNewTaskProject(projectName || activeProject);
        setTaskToEdit(undefined);
        setShowTaskDialog(true);
      }
    }));
    
    // Manage which task is being dragged
    const handleDragStart = useCallback((taskId: string) => {
      setDraggedTask(taskId);
    }, []);

    // Update task position when drag ends
    const handleDragEnd = useCallback((taskId: string, x: number, y: number) => {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            position: { x, y }
          };
        }
        return t;
      }));
      
      // Clear dragged task state
      setDraggedTask(null);
    }, []);
    
    // Handle task click - optimize with useCallback
    const handleTaskClick = useCallback((taskId: string) => {
      // Only show detail view if not dragging
      if (draggedTask === null) {
        setDetailViewTask(taskId);
      }
      setActiveTask(prevActiveTask => taskId === prevActiveTask ? null : taskId);
    }, [draggedTask]);

    // Close the detail view
    const handleCloseDetailView = () => {
      setDetailViewTask(null);
    };

    // Edit task
    const handleEditTask = useCallback((taskId: string) => {
      const taskToEdit = tasks.find(task => task.id === taskId);
      if (taskToEdit) {
        setTaskToEdit(taskToEdit);
        setShowTaskDialog(true);
      }
    }, [tasks]);

    // Handle saving a task from the dialog
    const handleSaveTask = (taskData: Partial<Task>) => {
      if (taskToEdit) {
        // Update existing task
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskToEdit.id ? { ...task, ...taskData } : task
          )
        );
      } else {
        // Create new task with default position that will be updated client-side
        const newPos = taskData.position || {
          x: 100,
          y: 100
        };
        
        // Ensure the project is set - use the active project if not specified
        const project = taskData.project || activeProject;
        
        // Use a deterministic ID pattern instead of Date.now()
        const newId = `t-${Math.floor(1000000 + Math.random() * 9000000)}`;
        
        const newTask: Task = {
          id: newId,
          title: taskData.title || 'New Task',
          description: taskData.description || '',
          status: taskData.status || 'To Do',
          priority: taskData.priority || 'medium',
          dueDate: taskData.dueDate || new Date(), // Use current date as default
          assignee: taskData.assignee || { name: 'Unassigned', avatar: '' },
          type: taskData.type || 'design',
          position: newPos,
          connections: taskData.connections || [],
          project: project
        };
        
        // Add task to the list
        setTasks(prevTasks => {
          const task = { ...newTask };
          
          // Update position client-side only
          if (!taskData.position) {
            // Apply random position on next render cycle to avoid hydration mismatch
            setTimeout(() => {
              setTasks(currentTasks => 
                currentTasks.map(t => 
                  t.id === task.id 
                    ? { 
                        ...t, 
                        position: {
                          x: 100 + Math.random() * 800,
                          y: 100 + Math.random() * 500
                        }
                      } 
                    : t
                )
              );
            }, 0);
          }
          
          return [...prevTasks, task];
        });
      }
      
      // Close the dialog
      setShowTaskDialog(false);
      
      // Clear edit task and project settings
      setTaskToEdit(undefined);
      setNewTaskProject('');
    };

    // Mark a task as completed or reopen it
    const handleCompleteTask = useCallback((taskId: string) => {
      // Toggle between Done and previous states
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          // If task is already Done, set it back to 'In Progress' or 'To Do'
          if (task.status === 'Done') {
            return { ...task, status: 'To Do' };
          } else {
            // Otherwise mark it as Done
            return { ...task, status: 'Done' };
          }
        }
        return task;
      }));
      
      // Keep the detail view open instead of closing it
      // This allows users to see the updated status and toggle back if needed
    }, []);

    // Delete a task
    const handleDeleteTask = useCallback((taskId: string) => {
      // Remove the task from the tasks array using functional update pattern
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Close the detail view immediately
      setDetailViewTask(null);
    }, []);
    
    // Prioritize tasks based on deadline proximity for focus mode
    const prioritizedTasks = [...tasks].sort((a, b) => 
      a.dueDate.getTime() - b.dueDate.getTime()
    );
    
    // Find the task for detail view
    const detailTask = tasks.find(task => task.id === detailViewTask);
    
    useEffect(() => {
      // Randomize task positions on initial load, ensuring no overlap
      const randomizeTaskPositions = () => {
        // Define grid dimensions
        const cellWidth = 300; // Minimum width for a task card + spacing
        const cellHeight = 200; // Minimum height for a task card + spacing
        
        // Track which grid cells are occupied
        const occupiedCells = new Set<string>();
        
        // Create a copy of tasks to modify
        const updatedTasks = [...tasks];
        
        // Group tasks by project
        const projectGroups: Record<string, Task[]> = {
          'Design System': updatedTasks.filter(t => t.project === 'Design System'),
          'Mobile App': updatedTasks.filter(t => t.project === 'Mobile App'),
          'Marketing Website': updatedTasks.filter(t => t.project === 'Marketing Website'),
          'Backend API': updatedTasks.filter(t => t.project === 'Backend API')
        };
        
        // Assign regions for each project to keep them somewhat grouped
        const projectRegions: Record<string, {startX: number, startY: number, width: number, height: number}> = {
          'Design System': { startX: 0, startY: 0, width: 10, height: 10 },
          'Mobile App': { startX: 0, startY: 0, width: 10, height: 10 },
          'Marketing Website': { startX: 0, startY: 10, width: 10, height: 10 },
          'Backend API': { startX: 0, startY: 10, width: 10, height: 10 }
        };
        
        // Function to find an unoccupied cell in a region
        const findUnoccupiedCell = (
          region: {startX: number, startY: number, width: number, height: number}
        ): Position => {
          let attempts = 0;
          const maxAttempts = 100; // Prevent infinite loop
          
          while (attempts < maxAttempts) {
            // Generate random cell coordinates within the region
            const cellX = Math.floor(Math.random() * region.width) + region.startX;
            const cellY = Math.floor(Math.random() * region.height) + region.startY;
            const cellKey = `${cellX},${cellY}`;
            
            // Check if cell is unoccupied
            if (!occupiedCells.has(cellKey)) {
              occupiedCells.add(cellKey);
              return { x: cellX * cellWidth, y: cellY * cellHeight };
            }
            
            attempts++;
          }
          
          // If all cells in the preferred region are occupied, find any available cell
          for (let x = 0; x < 30; x++) {
            for (let y = 0; y < 30; y++) {
              const cellKey = `${x},${y}`;
              if (!occupiedCells.has(cellKey)) {
                occupiedCells.add(cellKey);
                return { x: x * cellWidth, y: y * cellHeight };
              }
            }
          }
          
          // Fallback: return random position if grid is full
          return { 
            x: Math.floor(Math.random() * 3000),
            y: Math.floor(Math.random() * 3000)
          };
        };
        
        // Update positions for each project's tasks
        Object.entries(projectGroups).forEach(([project, projectTasks]) => {
          if (project in projectRegions) {
            const region = projectRegions[project];
            
            projectTasks.forEach(task => {
              const newPosition = findUnoccupiedCell(region);
              
              // Find and update the task in the original array
              const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
              if (taskIndex !== -1) {
                updatedTasks[taskIndex] = {
                  ...updatedTasks[taskIndex],
                  position: newPosition
                };
              }
            });
          }
        });
        
        // Update tasks state with new positions
        setTasks(updatedTasks);
      };
      
      // Only run once on initial load
      randomizeTaskPositions();
    }, []);
    
    // Handle adding a new connection between tasks
    const handleAddConnection = useCallback(() => {
      // Connection functionality disabled
      return;
    }, []);
    
    // State for connection notification
    const [connectionNotification, setConnectionNotification] = useState({
      isVisible: false,
      message: ''
    });
    
    // For rendering the notification
    const renderConnectionNotification = () => {
      if (!connectionNotification.isVisible) return null;
      
      return (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {connectionNotification.message}
        </div>
      );
    };
    
    // Add global middle mouse button handler
    useEffect(() => {
      const handleGlobalMouseDown = (e: MouseEvent) => {
        // Only handle middle mouse button (button 1)
        if (e.button !== 1) return;
        
        // If we're clicking on or within a task card and not already panning the workspace
        const target = e.target as HTMLElement;
        const taskCard = target.closest('.task-card');
        
        if (taskCard && !isPanning) {
          // Prevent default middle-click behavior (usually autoscroll)
          e.preventDefault();
        }
      };
      
      // Add global listener
      document.addEventListener('mousedown', handleGlobalMouseDown);
      
      // Cleanup function
      return () => {
        document.removeEventListener('mousedown', handleGlobalMouseDown);
      };
    }, [isPanning, tasks]);
    
    // Show middle-click hint when hovering over task cards for too long
    useEffect(() => {
      const handleTaskCardHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const taskCard = target.closest('.task-card');
        
        if (taskCard && !showMiddleClickHint && !middleClickHintTimer.current) {
          // Show hint after 1.5 seconds of hovering
          middleClickHintTimer.current = setTimeout(() => {
            setShowMiddleClickHint(true);
            
            // Hide hint after 3 seconds
            setTimeout(() => {
              setShowMiddleClickHint(false);
              middleClickHintTimer.current = null;
            }, 3000);
          }, 1500);
        }
      };
      
      const handleMouseOut = () => {
        if (middleClickHintTimer.current) {
          clearTimeout(middleClickHintTimer.current);
          middleClickHintTimer.current = null;
        }
      };
      
      document.addEventListener('mouseover', handleTaskCardHover);
      document.addEventListener('mouseout', handleMouseOut);
      
      return () => {
        document.removeEventListener('mouseover', handleTaskCardHover);
        document.removeEventListener('mouseout', handleMouseOut);
        if (middleClickHintTimer.current) {
          clearTimeout(middleClickHintTimer.current);
        }
      };
    }, [showMiddleClickHint]);
    
    return (
      <div 
        className="workspace relative overflow-hidden" 
        ref={workspaceRef}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        data-workspace="true"
      >
        {/* Middle-click hint tooltip */}
        {showMiddleClickHint && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-xs z-50 pointer-events-none animate-pulse">
            Middle-click and drag to move task cards
          </div>
        )}
        
        {/* Panning hint tooltip */}
        {showPanHint && !isPanning && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-xs z-50 pointer-events-none animate-pulse">
            Click and drag to move the workspace
          </div>
        )}
        
        {/* Task Dialog */}
        <TaskDialog
          isOpen={showTaskDialog}
          onClose={() => setShowTaskDialog(false)}
          onSave={handleSaveTask}
          initialProject={newTaskProject}
          editTask={taskToEdit}
          allTasks={tasks}
        />
        
        {/* Project Counter */}
        <div className="absolute top-4 right-4 z-20 bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg">
          <h3 className="text-sm font-bold mb-2">Project Tasks</h3>
          <ul className="space-y-1">
            {Object.entries(projectCounts).map(([project, count]) => (
              <li key={project} className="flex justify-between items-center">
                <span className="text-xs">{project}</span>
                <span className="text-xs font-semibold bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Total</span>
              <span className="text-xs font-bold bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </div>
          </div>
        </div>
        
        {/* Task Detail View */}
        {detailViewTask && detailTask && (
          <TaskDetailView 
            task={detailTask}
            onClose={handleCloseDetailView}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={() => handleEditTask(detailTask.id)}
          />
        )}
        
        {/* Ambient backgrounds */}
        <div className="absolute inset-0 z-0">
          {renderAmbientAuras()}
        </div>
        
        {/* Task cards - Apply zoom transform and pan offset */}
        <div 
          className="relative z-10 h-full" 
          style={{ 
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`, 
            transformOrigin: 'center', 
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
            height: '100%',
            width: '100%'
          }}
        >
          {/* Render connection lines between tasks - DISABLED */}
          {/* SVG container is kept but no paths are rendered */}
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ pointerEvents: 'none', zIndex: 5, display: 'none' }}
            viewBox={`0 0 10000 10000`}
            preserveAspectRatio="none"
          >
          </svg>
          
          {visibleTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              initialPosition={task.position}
              onClick={() => handleTaskClick(task.id)}
              onStatusChange={(taskId, newStatus) => {
                // Update task status
                setTasks(prevTasks => 
                  prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
                );
              }}
              onMove={(taskId, position) => handleDragEnd(taskId, position.x, position.y)}
            />
          ))}
        </div>
        
        {/* Mini-map navigation overlay - only show when significantly zoomed out */}
        {zoomScale < 0.25 && (
          <div className="absolute top-20 right-4 z-20 bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-lg opacity-80 border border-neutral-300 dark:border-neutral-700">
            <div className="text-xs font-semibold mb-1 text-center">Mini-Map</div>
            <div 
              className="relative w-48 h-36 border border-neutral-300 dark:border-neutral-700 overflow-hidden"
              onClick={(e) => {
                // Calculate position based on click within mini-map
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2000 - 1000;
                const y = ((e.clientY - rect.top) / rect.height) * 1200 - 600;
                
                // Center the view on the clicked position
                setPanOffset({
                  x: -x * zoomScale,
                  y: -y * zoomScale
                });
              }}
              style={{ cursor: 'pointer' }}
            >
              {minimapDots.map(dot => (
                <div
                  key={`mini-${dot.id}`}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    backgroundColor: dot.color
                  }}
                  title={dot.title}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent's click
                    handleTaskClick(dot.id);
                    
                    // Find the task to center on
                    const task = tasks.find(t => t.id === dot.id);
                    if (task) {
                      // Center the view on the task
                      setPanOffset({
                        x: -task.position.x * zoomScale + window.innerWidth / 2,
                        y: -task.position.y * zoomScale + window.innerHeight / 2
                      });
                    }
                  }}
                />
              ))}
              
              {/* Viewport indicator - adjusted for panning */}
              <div 
                className="absolute border-2 border-primary-500 rounded-sm pointer-events-none"
                style={{
                  width: `${Math.min(1/zoomScale, 1) * 100}%`,
                  height: `${Math.min(1/zoomScale, 1) * 100}%`,
                  left: `${50 + (panOffset.x / (20 * zoomScale))}%`,
                  top: `${50 + (panOffset.y / (12 * zoomScale))}%`,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
            <div className="text-xs text-center mt-1 text-neutral-500">
              Click to navigate
            </div>
          </div>
        )}
        
        {/* New Task Button - Simplified animation */}
        <MotionButton
          {...{
            className: "absolute bottom-4 left-4 btn-primary flex items-center z-30",
            whileHover: { opacity: 0.9 },
            whileTap: { opacity: 0.8 },
            onClick: () => {
              setNewTaskProject(activeProject);
              setTaskToEdit(undefined);
              setShowTaskDialog(true);
            }
          } as any}
        >
          <svg
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </MotionButton>
        
        {/* Reset position button - show when panned away from center */}
        {(panOffset.x !== 0 || panOffset.y !== 0 || zoomScale !== 1) && (
          <MotionButton
            {...{
              className: "absolute bottom-4 left-40 btn-secondary flex items-center z-30",
              whileHover: { opacity: 0.9 },
              whileTap: { opacity: 0.8 },
              onClick: handleResetZoom,
              title: "Reset View Position and Zoom"
            } as any}
          >
            <svg
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Reset View
          </MotionButton>
        )}
        
        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-30">
          <MotionButton
            {...{
              className: "btn-secondary flex items-center justify-center w-10 h-10 rounded-full",
              whileHover: { opacity: 0.9 },
              whileTap: { opacity: 0.8 },
              onClick: handleZoomOut,
              "aria-label": "Zoom out",
              title: "Zoom Out (Ctrl/Cmd + -)"
            } as any}
          >
            <svg
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </MotionButton>
          
          {/* Zoom Level Indicator */}
          <div 
            className="flex items-center justify-center bg-white dark:bg-neutral-800 px-3 rounded-full text-xs font-semibold shadow-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
            onDoubleClick={handleResetZoom}
            title="Double-click to reset zoom (Ctrl/Cmd + 0)"
          >
            {Math.round(zoomScale * 100)}%
          </div>
          
          <MotionButton
            {...{
              className: "btn-secondary flex items-center justify-center w-10 h-10 rounded-full",
              whileHover: { opacity: 0.9 },
              whileTap: { opacity: 0.8 },
              onClick: handleZoomIn,
              "aria-label": "Zoom in",
              title: "Zoom In (Ctrl/Cmd + +)"
            } as any}
          >
            <svg
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </MotionButton>
          
          {/* Help button */}
          <MotionButton
            {...{
              className: "btn-secondary flex items-center justify-center w-10 h-10 rounded-full ml-2",
              whileHover: { opacity: 0.9 },
              whileTap: { opacity: 0.8 },
              onClick: () => setShowNavHelp(!showNavHelp),
              "aria-label": "Navigation Help",
              title: "Navigation Help"
            } as any}
          >
            <svg
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </MotionButton>
        </div>
        
        {/* Navigation help panel */}
        {showNavHelp && (
          <NavigationHelp onClose={() => setShowNavHelp(false)} />
        )}
        
        {/* Focus Mode */}
        {showFocusMode && (
          <FocusMode 
            tasks={prioritizedTasks.slice(0, 3)} 
            onClose={onToggleFocusMode || (() => {})}
          />
        )}
        
        {/* Timeline View */}
        {showTimeline && (
          <Timeline 
            tasks={tasks} 
            onClose={onToggleTimeline || (() => {})}
          />
        )}
        
        {/* Analytics Dashboard */}
        {showAnalytics && (
          <Analytics
            isVisible={showAnalytics}
            tasks={tasks}
            onClose={onToggleAnalytics || (() => {})}
          />
        )}
        
        {/* Connection Notification */}
        {renderConnectionNotification()}
      </div>
    );
  }
);

Workspace.displayName = 'Workspace';

export default Workspace; 

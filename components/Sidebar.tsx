"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onNewTask?: (projectName: string) => void;
  projectCounts: Record<string, number>;
  onCategoryChange?: (categoryId: string) => void;
  activeCategory?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

type ProjectCategoriesMap = {
  [projectId: string]: Category[];
}

export default function Sidebar({ onNewTask, projectCounts, onCategoryChange, activeCategory = 'all' }: SidebarProps) {
  const [activeProject, setActiveProject] = useState('Design System');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📝');
  
  // Keep track of the previous project categories to avoid unnecessary event emissions
  const prevProjectCategoriesRef = useRef<string>('');
  
  // Project data
  const projects = [
    { id: '1', name: 'Design System', color: 'from-primary-400 to-primary-600' },
    { id: '2', name: 'Mobile App', color: 'from-secondary-400 to-secondary-600' },
    { id: '3', name: 'Marketing Website', color: 'from-success-400 to-success-600' },
    { id: '4', name: 'Backend API', color: 'from-warning-400 to-warning-600' },
  ];
  
  // Project categories - organized by project ID
  const [projectCategories, setProjectCategories] = useState<ProjectCategoriesMap>({
    '1': [ // Design System
      { id: 'all', name: 'All Tasks', icon: '📋' },
      { id: 'design', name: 'UI Components', icon: '🎨' },
      { id: 'color', name: 'Color Palette', icon: '🖌️' },
      { id: 'typography', name: 'Typography', icon: '🔤' },
    ],
    '2': [ // Mobile App
      { id: 'all', name: 'All Tasks', icon: '📋' },
      { id: 'auth', name: 'Authentication', icon: '🔒' },
      { id: 'ui', name: 'UI Implementation', icon: '📱' },
      { id: 'api', name: 'API Integration', icon: '🔌' },
    ],
    '3': [ // Marketing Website
      { id: 'all', name: 'All Tasks', icon: '📋' },
      { id: 'research', name: 'Research', icon: '🔍' },
      { id: 'content', name: 'Content', icon: '📝' },
      { id: 'seo', name: 'SEO', icon: '🔎' },
    ],
    '4': [ // Backend API
      { id: 'all', name: 'All Tasks', icon: '📋' },
      { id: 'database', name: 'Database', icon: '💾' },
      { id: 'endpoints', name: 'Endpoints', icon: '🔗' },
      { id: 'security', name: 'Security', icon: '🛡️' },
    ],
  });

  // Get the active project's ID
  const getActiveProjectId = () => {
    const project = projects.find(p => p.name === activeProject);
    return project ? project.id : '1';
  };

  // Get categories for the active project
  const getActiveProjectCategories = (): Category[] => {
    const projectId = getActiveProjectId();
    const categories = projectCategories[projectId] || [];
    
    // Debug log the categories for the active project
    console.log(`Active project: ${activeProject} (ID: ${projectId})`, {
      categories: categories.map(c => ({ id: c.id, name: c.name }))
    });
    
    return categories;
  };

  const handleNewTask = () => {
    if (onNewTask) {
      onNewTask(activeProject);
    }
  };

  // Get task count for a project or return 0 if not found
  const getTaskCount = (projectName: string) => {
    return projectCounts[projectName] || 0;
  };

  // Handle project selection
  const handleProjectSelect = (projectName: string) => {
    setActiveProject(projectName);
    
    // Reset to "All Tasks" when switching projects
    if (onCategoryChange) {
      onCategoryChange('all');
    }
    
    // Emit custom event for project change
    const event = new CustomEvent('projectChange', {
      detail: { project: projectName }
    });
    window.dispatchEvent(event);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    console.log(`Category selected: ${categoryId}`);
    
    // Log all available categories and which one was selected
    const projectId = getActiveProjectId();
    const categories = projectCategories[projectId] || [];
    
    console.log('Available categories:', categories.map(c => ({ id: c.id, name: c.name })));
    console.log('Selected category:', categories.find(c => c.id === categoryId));
    
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  // Add new category to the active project
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const projectId = getActiveProjectId();
      const newCategoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
      const newCategory: Category = {
        id: newCategoryId,
        name: newCategoryName.trim(),
        icon: newCategoryIcon
      };
      
      // Update categories state using the functional form to ensure we have the latest state
      setProjectCategories(prevCategories => {
        const updatedCategories = {
          ...prevCategories,
          [projectId]: [...(prevCategories[projectId] || []), newCategory]
        };
        
        return updatedCategories;
      });
      
      // Reset input fields
      setNewCategoryName('');
      setNewCategoryIcon('📝');
      setShowCategoryInput(false);
      
      // Select the new category
      if (onCategoryChange) {
        onCategoryChange(newCategoryId);
      }
    }
  };

  // Use effect to emit the event after state updates
  useEffect(() => {
    // Create a serialized version of the state for comparison
    const serializedState = JSON.stringify(projectCategories);
    
    // Only emit if the state actually changed
    if (serializedState !== prevProjectCategoriesRef.current) {
      // Emit custom event to sync categories with TaskDialog
      const event = new CustomEvent('categoryUpdate', {
        detail: { projectCategories: projectCategories }
      });
      window.dispatchEvent(event);
      
      // Update the ref
      prevProjectCategoriesRef.current = serializedState;
    }
  }, [projectCategories]);

  // Icon options for new categories
  const iconOptions = ['📝', '🔔', '🏆', '📊', '🚀', '⚙️', '📈', '📚', '🎯', '🖌️', '🔤', '🔒', '📱', '🔌', '🔍', '📝', '🔎', '💾', '🔗', '🛡️'];

  return (
    <div className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Projects
        </h2>
        <div className="space-y-2">
          {projects.map((project) => (
            <motion.button
              key={project.id}
              {...{
                className: `w-full flex items-center p-2 rounded-md text-left ${
                  activeProject === project.name
                    ? 'bg-neutral-100 dark:bg-neutral-800 ring-1 ring-primary-500'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-850'
                }`,
                onClick: () => handleProjectSelect(project.name),
                whileHover: { x: 4 },
                whileTap: { scale: 0.98 }
              } as any}
            >
              <div className={`h-4 w-4 rounded-full mr-3 bg-gradient-to-r ${project.color}`} />
              <div>
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {getTaskCount(project.name)} tasks
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {activeProject} Categories
          </h2>
          <motion.button
            {...{
              className: "text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1 rounded-md",
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.98 },
              onClick: () => setShowCategoryInput(true),
              title: "Add new category"
            } as any}
          >
            <svg
              width="14"
              height="14"
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
          </motion.button>
        </div>
        
        {showCategoryInput && (
          <div className="mb-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md">
            <input
              type="text"
              placeholder="Category name"
              className="w-full p-2 mb-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
            <div className="flex mb-2 space-x-1 overflow-x-auto">
              {iconOptions.map((icon, index) => (
                <button
                  key={index}
                  className={`p-1 rounded-md ${
                    newCategoryIcon === icon ? 'bg-primary-100 dark:bg-primary-900 ring-1 ring-primary-500' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                  onClick={() => setNewCategoryIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <motion.button
                {...{
                  className: "flex-1 text-xs bg-primary-500 text-white p-1 rounded-md",
                  whileHover: { y: -1 },
                  whileTap: { y: 0 },
                  onClick: handleAddCategory
                } as any}
              >
                Add
              </motion.button>
              <motion.button
                {...{
                  className: "flex-1 text-xs bg-neutral-200 dark:bg-neutral-700 p-1 rounded-md",
                  whileHover: { y: -1 },
                  whileTap: { y: 0 },
                  onClick: () => {
                    setShowCategoryInput(false);
                    setNewCategoryName('');
                  }
                } as any}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          {getActiveProjectCategories().map((category: Category) => (
            <motion.button
              key={category.id}
              {...{
                className: `w-full flex items-center p-2 rounded-md text-left hover:bg-neutral-50 dark:hover:bg-neutral-850 ${
                  activeCategory === category.id 
                    ? 'bg-neutral-100 dark:bg-neutral-800 ring-1 ring-primary-500'
                    : ''
                }`,
                whileHover: { x: 4 },
                whileTap: { scale: 0.98 },
                onClick: () => handleCategorySelect(category.id)
              } as any}
            >
              <span className="mr-3">{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mt-auto">
        <motion.button
          {...{
            className: "w-full py-2 px-4 rounded-md bg-primary-500 text-white font-medium flex items-center justify-center",
            whileHover: { y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
            whileTap: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
            onClick: handleNewTask
          } as any}
        >
          <svg
            className="mr-2"
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
          New Task
        </motion.button>
      </div>
    </div>
  );
} 
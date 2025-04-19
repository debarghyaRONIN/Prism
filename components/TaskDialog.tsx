import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  assignee: { name: string; avatar: string };
  type: string;
  position: { x: number; y: number };
  connections: string[];
  project: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

type ProjectCategoriesMap = {
  [projectId: string]: Category[];
}

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialProject?: string;
  editTask?: Task;
  allTasks: Task[];
}

// Initial project categories - will be updated dynamically
const initialProjectCategories: ProjectCategoriesMap = {
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
};

export default function TaskDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialProject = '', 
  editTask, 
  allTasks 
}: TaskDialogProps) {
  // State for categories from all projects
  const [projectCategories, setProjectCategories] = useState<ProjectCategoriesMap>(initialProjectCategories);
  
  // Available projects
  const projects = useMemo(() => [
    { id: '1', name: 'Design System', color: 'from-primary-400 to-primary-600' },
    { id: '2', name: 'Mobile App', color: 'from-secondary-400 to-secondary-600' },
    { id: '3', name: 'Marketing Website', color: 'from-success-400 to-success-600' },
    { id: '4', name: 'Backend API', color: 'from-warning-400 to-warning-600' },
  ], []);

  // Default values for a new task - memoize to prevent recreation on each render
  const defaultTask = useMemo(() => ({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    assignee: { name: 'You', avatar: '' },
    type: 'design',
    connections: [],
    project: initialProject || 'Design System'
  }), [initialProject]);

  // State for form values
  const [task, setTask] = useState<Partial<Task>>(defaultTask);
  const [showConnectionsList, setShowConnectionsList] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  
  // Get project ID by name - memoize with useCallback
  const getProjectIdByName = useCallback((projectName: string): string => {
    const project = projects.find(p => p.name === projectName);
    return project ? project.id : '1';
  }, [projects]);

  // Listen for category updates from Sidebar
  useEffect(() => {
    const handleCategoryUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.projectCategories) {
        const newCategories = event.detail.projectCategories;
        // Check if categories actually changed to prevent unnecessary rerenders
        if (JSON.stringify(newCategories) !== JSON.stringify(projectCategories)) {
          setProjectCategories(newCategories);
        }
      }
    };
    
    window.addEventListener('categoryUpdate' as any, handleCategoryUpdate);
    
    return () => {
      window.removeEventListener('categoryUpdate' as any, handleCategoryUpdate);
    };
  }, [projectCategories]);

  // Set up task data when dialog is opened
  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        // Edit existing task
        setTask(editTask);
      } else {
        // Create new task
        setTask({
          ...defaultTask,
          project: initialProject || defaultTask.project
        });
      }
    }
  }, [isOpen, editTask, initialProject, defaultTask]);

  // Record creation time
  const creationTime = new Date();

  // List of available assignees (in a real app, this would come from an API)
  const assignees = [
    { name: 'You', avatar: '' },
    { name: 'Alice', avatar: '' },
    { name: 'Bob', avatar: '' },
    { name: 'Charlie', avatar: '' },
    { name: 'Diana', avatar: '' },
    { name: 'Eva', avatar: '' }
  ];

  // Update categories when project changes or projectCategories is updated
  useEffect(() => {
    if (task.project) {
      const projectId = getProjectIdByName(task.project);
      // Filter out the "all" category which is just for filtering
      const categories = projectCategories[projectId]?.filter(cat => cat.id !== 'all') || [];
      
      // Check if available categories changed to prevent unnecessary rerenders
      if (JSON.stringify(categories) !== JSON.stringify(availableCategories)) {
        setAvailableCategories(categories);
        
        // If current type doesn't exist in new project categories, set the first available type
        const typeExists = categories.some(cat => cat.id === task.type);
        if (!typeExists && categories.length > 0) {
          setTask(prev => ({ ...prev, type: categories[0].id }));
        }
      }
    }
  }, [task.project, projectCategories, task.type, availableCategories, getProjectIdByName]);

  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Debug log for category selection
    if (name === 'type') {
      console.log(`TaskDialog: Category selected - ID: ${value}`, {
        availableCategories: availableCategories.map(c => ({ id: c.id, name: c.name })),
        selectedCategory: availableCategories.find(c => c.id === value)
      });
    }
    
    setTask(prev => ({ ...prev, [name]: value }));
  };

  // Handle due date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(prev => ({ ...prev, dueDate: new Date(e.target.value) }));
  };

  // Handle assignee change
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedAssignee = assignees.find(a => a.name === selectedName);
    
    if (selectedAssignee) {
      setTask(prev => ({ ...prev, assignee: selectedAssignee }));
    }
  };

  // Handle task connections
  const toggleTaskConnection = (taskId: string) => {
    setTask(prev => {
      const connections = prev.connections || [];
      if (connections.includes(taskId)) {
        return { ...prev, connections: connections.filter(id => id !== taskId) };
      } else {
        return { ...prev, connections: [...connections, taskId] };
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug log when saving a task
    console.log(`Saving task with type: ${task.type}`, {
      task: {
        title: task.title,
        project: task.project, 
        type: task.type
      }
    });
    
    onSave(task);
    onClose();
  };

  // If dialog is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <motion.div 
        {...{
          className: "bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 }
        } as any}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {editTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button 
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={task.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
                placeholder="Task title"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={task.description || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 h-20"
                placeholder="Task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  name="project"
                  value={task.project || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.name}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="type"
                  value={task.type || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
                >
                  {availableCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <select
                  value={task.assignee?.name || ''}
                  onChange={handleAssigneeChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
                >
                  {assignees.map(assignee => (
                    <option key={assignee.name} value={assignee.name}>{assignee.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  name="priority"
                  value={task.priority || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={task.status || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : ''}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Connected Tasks</label>
                <button 
                  type="button"
                  onClick={() => setShowConnectionsList(!showConnectionsList)}
                  className="flex items-center text-primary-500 hover:text-primary-600 text-sm"
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
                    className="mr-1"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {showConnectionsList ? 'Hide Connections' : 'Add Connections'}
                </button>
              </div>

              {/* Show selected connections */}
              {!showConnectionsList && task.connections && task.connections.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {task.connections.map(connId => {
                    const connectedTask = allTasks.find(t => t.id === connId);
                    return connectedTask ? (
                      <div 
                        key={connId}
                        className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-xs flex items-center"
                      >
                        {connectedTask.title}
                        <button 
                          type="button"
                          onClick={() => toggleTaskConnection(connId)}
                          className="ml-1 text-primary-500 hover:text-primary-700"
                        >
                          <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* Task connection selector */}
              {showConnectionsList && (
                <div className="border border-neutral-300 dark:border-neutral-700 rounded-md p-3 max-h-40 overflow-y-auto">
                  {allTasks.length > 0 ? (
                    <div className="space-y-2">
                      {allTasks
                        .filter(t => t.id !== editTask?.id) // Don't show the current task
                        .map(t => (
                          <div key={t.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`task-${t.id}`}
                              checked={task.connections?.includes(t.id) || false}
                              onChange={() => toggleTaskConnection(t.id)}
                              className="mr-2"
                            />
                            <label htmlFor={`task-${t.id}`} className="text-sm">
                              {t.title}
                            </label>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500">No tasks available to connect</p>
                  )}
                </div>
              )}
            </div>

            <div className="text-xs text-neutral-500 mb-4">
              {editTask ? (
                <p>Last edited: {format(new Date(), 'MMM d, yyyy h:mm a')}</p>
              ) : (
                <p>Created: {format(creationTime, 'MMM d, yyyy h:mm a')}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-md hover:opacity-90"
              >
                {editTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 
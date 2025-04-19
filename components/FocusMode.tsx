"use client";

import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: Date;
  assignee: { name: string; avatar: string };
}

interface FocusModeProps {
  tasks: Task[];
  onClose: () => void;
}

export default function FocusMode({ tasks, onClose }: FocusModeProps) {
  // Get priority visual elements
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-danger-500';
      case 'high': return 'bg-warning-500';
      case 'medium': return 'bg-primary-500';
      case 'low': return 'bg-success-500';
      default: return 'bg-neutral-500';
    }
  };

  // Simplified animation for better performance
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="focus-mode">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-2xl p-8"
        {...{} as any}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Focus Mode</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-2xl w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Close focus mode"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border-l-4"
              style={{
                borderLeftColor: task.priority === 'urgent' ? '#ef4444' : 
                                 task.priority === 'high' ? '#f59e0b' : 
                                 task.priority === 'medium' ? '#0ea5e9' : 
                                 '#22c55e'
              }}
            >
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm">{task.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 
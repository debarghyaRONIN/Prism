"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  assignee: {
    name: string;
    avatar: string;
  };
  type: string;
  position: {
    x: number;
    y: number;
  };
  connections: string[];
  project: string;
}

interface TaskAnalyticsDashboardProps {
  tasks: Task[];
  onClose: () => void;
}

const TaskAnalyticsDashboard = ({ tasks, onClose }: TaskAnalyticsDashboardProps) => {
  // Dashboard animation variants
  const dashboardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    },
    exit: { 
      opacity: 0, 
      y: 50,
      transition: { duration: 0.2 } 
    }
  };

  // Calculate task completion metrics
  const metrics = useMemo(() => {
    // Task completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Tasks by status
    const statusCounts = {
      'To Do': tasks.filter(task => task.status === 'To Do').length,
      'In Progress': tasks.filter(task => task.status === 'In Progress').length,
      'Done': completedTasks
    };
    
    // Tasks by priority
    const priorityCounts = {
      'urgent': tasks.filter(task => task.priority === 'urgent').length,
      'high': tasks.filter(task => task.priority === 'high').length,
      'medium': tasks.filter(task => task.priority === 'medium').length,
      'low': tasks.filter(task => task.priority === 'low').length
    };
    
    // Tasks by type
    const typeCounts = tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {});
    
    // Task completion by project
    const projectCompletionRates = Object.entries(
      tasks.reduce((acc: Record<string, { total: number, completed: number }>, task) => {
        if (!acc[task.project]) {
          acc[task.project] = { total: 0, completed: 0 };
        }
        acc[task.project].total += 1;
        if (task.status === 'Done') {
          acc[task.project].completed += 1;
        }
        return acc;
      }, {})
    ).map(([project, counts]) => ({
      project,
      completionRate: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0,
      totalTasks: counts.total,
      completedTasks: counts.completed
    })).sort((a, b) => b.completionRate - a.completionRate);
    
    // Estimate completion timeline
    const avgCompletionTime = 3; // Hypothetical average days to complete a task
    const remainingTasks = totalTasks - completedTasks;
    const estimatedCompletionDays = remainingTasks * avgCompletionTime;
    
    return {
      totalTasks,
      completedTasks,
      completionRate,
      statusCounts,
      priorityCounts,
      typeCounts,
      projectCompletionRates,
      estimatedCompletionDays
    };
  }, [tasks]);

  // Generate mock weekly completion data
  const weeklyData = useMemo(() => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return daysOfWeek.map(day => ({
      day,
      completed: Math.floor(Math.random() * 5),
      added: Math.floor(Math.random() * 6)
    }));
  }, []);

  // Calculate highest value in weekly data for chart scaling
  const weeklyDataMax = useMemo(() => {
    return Math.max(...weeklyData.map(d => Math.max(d.completed, d.added)));
  }, [weeklyData]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={dashboardVariants}
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col"
        {...{} as any}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Task Analytics Dashboard</h2>
            <p className="text-primary-100">Insights and metrics for your tasks</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full text-2xl w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Close analytics"
          >
            ×
          </button>
        </div>
        
        {/* Analytics Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-primary-500 dark:text-primary-300 mb-1">Total Tasks</h3>
              <p className="text-3xl font-bold">{metrics.totalTasks}</p>
            </div>
            
            <div className="bg-success-50 dark:bg-success-900 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-success-500 dark:text-success-300 mb-1">Completed Tasks</h3>
              <p className="text-3xl font-bold">{metrics.completedTasks}</p>
            </div>
            
            <div className="bg-secondary-50 dark:bg-secondary-900 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-300 mb-1">Completion Rate</h3>
              <p className="text-3xl font-bold">{metrics.completionRate}%</p>
              <div className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full mt-2">
                <div 
                  className="h-2 bg-secondary-500 dark:bg-secondary-400 rounded-full" 
                  style={{ width: `${metrics.completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-warning-50 dark:bg-warning-900 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-warning-500 dark:text-warning-300 mb-1">Estimated Completion</h3>
              <p className="text-3xl font-bold">{metrics.estimatedCompletionDays} days</p>
            </div>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Status Distribution Chart */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
              <div className="flex items-end h-64">
                {Object.entries(metrics.statusCounts).map(([status, count], index) => {
                  const colors = {
                    'To Do': 'bg-neutral-400 dark:bg-neutral-500',
                    'In Progress': 'bg-primary-400 dark:bg-primary-500',
                    'Done': 'bg-success-400 dark:bg-success-500'
                  };
                  const maxCount = Math.max(...Object.values(metrics.statusCounts));
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={status} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full flex justify-center mb-2">
                        <div 
                          className={`${colors[status as keyof typeof colors]} w-16 rounded-t-lg transition-all duration-500`} 
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="absolute top-0 transform -translate-y-full text-sm font-semibold">{count}</span>
                      </div>
                      <span className="text-sm">{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Weekly Activity Chart */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Weekly Task Activity</h3>
              <div className="flex items-end h-64">
                {weeklyData.map((item) => {
                  const completedHeight = weeklyDataMax > 0 ? (item.completed / weeklyDataMax) * 100 : 0;
                  const addedHeight = weeklyDataMax > 0 ? (item.added / weeklyDataMax) * 100 : 0;
                  
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full flex justify-center space-x-1 mb-2">
                        <div 
                          className="bg-success-400 dark:bg-success-500 w-5 rounded-t-sm transition-all duration-500" 
                          style={{ height: `${completedHeight}%` }}
                          title={`${item.completed} tasks completed`}
                        ></div>
                        <div 
                          className="bg-primary-400 dark:bg-primary-500 w-5 rounded-t-sm transition-all duration-500" 
                          style={{ height: `${addedHeight}%` }}
                          title={`${item.added} tasks added`}
                        ></div>
                      </div>
                      <span className="text-xs">{item.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-success-400 dark:bg-success-500 mr-2"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-400 dark:bg-primary-500 mr-2"></div>
                  <span className="text-xs">Added</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Priority & Project Completion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
              <div className="space-y-4">
                {Object.entries(metrics.priorityCounts).map(([priority, count]) => {
                  const percentage = metrics.totalTasks > 0 ? (count / metrics.totalTasks) * 100 : 0;
                  const colors = {
                    'urgent': 'bg-danger-500 dark:bg-danger-600',
                    'high': 'bg-warning-500 dark:bg-warning-600',
                    'medium': 'bg-primary-500 dark:bg-primary-600',
                    'low': 'bg-success-500 dark:bg-success-600'
                  };
                  
                  return (
                    <div key={priority} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="capitalize">{priority}</span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{count} tasks ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                        <div 
                          className={`h-2 ${colors[priority as keyof typeof colors]} rounded-full transition-all duration-500`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Project Completion Rates */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Project Completion Rates</h3>
              <div className="space-y-4">
                {metrics.projectCompletionRates.map((project) => (
                  <div key={project.project} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>{project.project}</span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {project.completedTasks}/{project.totalTasks} tasks
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500" 
                        style={{ width: `${project.completionRate}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm font-medium">
                      {project.completionRate}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex justify-between items-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Data updated: {new Date().toLocaleString()}
          </p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskAnalyticsDashboard; 
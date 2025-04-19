"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  tasksByProject: Record<string, number>;
  tasksByPriority: Record<string, number>;
  completionTrend: { date: string; completed: number }[];
}

interface AnalyticsProps {
  isVisible: boolean;
  tasks: any[]; // Replace with your task type
  onClose: () => void; // Add onClose prop
}

export default function Analytics({ isVisible, tasks, onClose }: AnalyticsProps) {
  const [stats, setStats] = useState<TaskStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    blockedTasks: 0,
    tasksByProject: {},
    tasksByPriority: {},
    completionTrend: []
  });

  useEffect(() => {
    if (tasks.length > 0) {
      // Calculate stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
      const blockedTasks = tasks.filter(task => task.status === 'blocked').length;
      
      // Tasks by project
      const tasksByProject: Record<string, number> = {};
      tasks.forEach(task => {
        if (task.project) {
          tasksByProject[task.project] = (tasksByProject[task.project] || 0) + 1;
        }
      });
      
      // Tasks by priority
      const tasksByPriority: Record<string, number> = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      };
      tasks.forEach(task => {
        if (task.priority) {
          tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
        }
      });
      
      // Generate mock completion trend data for the last 7 days
      const completionTrend = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        // Generate a random number between 1 and 5 for completed tasks per day
        const completed = Math.floor(Math.random() * 5) + 1;
        completionTrend.push({ date: dateStr, completed });
      }
      
      setStats({
        totalTasks,
        completedTasks,
        inProgressTasks,
        blockedTasks,
        tasksByProject,
        tasksByPriority,
        completionTrend
      });
    }
  }, [tasks]);

  if (!isVisible) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to generate a gradient color based on a value
  const getGradientColor = (index: number, total: number) => {
    const colors = [
      'from-primary-500 to-primary-600',
      'from-secondary-500 to-secondary-600',
      'from-success-500 to-success-600',
      'from-warning-500 to-warning-600',
      'from-error-500 to-error-600',
      'from-info-500 to-info-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div 
      {...{
        className: "fixed inset-0 bg-white dark:bg-neutral-900 overflow-auto z-50 p-6",
        variants: containerVariants,
        initial: "hidden",
        animate: "visible"
      } as any}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
            Task Analytics Dashboard
          </h2>
          
          <motion.button
            {...{
              className: "px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700",
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: onClose
            } as any}
          >
            Close
          </motion.button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            {...{
              className: "bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg p-4 shadow",
              variants: itemVariants
            } as any}
          >
            <h3 className="text-sm font-medium text-primary-600 dark:text-primary-400">Total Tasks</h3>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">{stats.totalTasks}</p>
          </motion.div>
          
          <motion.div 
            {...{
              className: "bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 rounded-lg p-4 shadow",
              variants: itemVariants
            } as any}
          >
            <h3 className="text-sm font-medium text-success-600 dark:text-success-400">Completed</h3>
            <p className="text-3xl font-bold text-success-700 dark:text-success-300">{stats.completedTasks}</p>
            <p className="text-sm text-success-600 dark:text-success-400">
              {stats.totalTasks ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : '0%'}
            </p>
          </motion.div>
          
          <motion.div 
            {...{
              className: "bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-800/30 rounded-lg p-4 shadow",
              variants: itemVariants
            } as any}
          >
            <h3 className="text-sm font-medium text-warning-600 dark:text-warning-400">In Progress</h3>
            <p className="text-3xl font-bold text-warning-700 dark:text-warning-300">{stats.inProgressTasks}</p>
            <p className="text-sm text-warning-600 dark:text-warning-400">
              {stats.totalTasks ? `${Math.round((stats.inProgressTasks / stats.totalTasks) * 100)}%` : '0%'}
            </p>
          </motion.div>
          
          <motion.div 
            {...{
              className: "bg-gradient-to-r from-error-50 to-error-100 dark:from-error-900/30 dark:to-error-800/30 rounded-lg p-4 shadow",
              variants: itemVariants
            } as any}
          >
            <h3 className="text-sm font-medium text-error-600 dark:text-error-400">Blocked</h3>
            <p className="text-3xl font-bold text-error-700 dark:text-error-300">{stats.blockedTasks}</p>
            <p className="text-sm text-error-600 dark:text-error-400">
              {stats.totalTasks ? `${Math.round((stats.blockedTasks / stats.totalTasks) * 100)}%` : '0%'}
            </p>
          </motion.div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart for Task Status */}
          <motion.div 
            {...{
              className: "bg-white dark:bg-neutral-800 p-6 rounded-lg shadow",
              variants: itemVariants
            } as any}
          >
            <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
            <div className="relative h-64">
              {/* Simple CSS-based pie chart */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* We'll fake a pie chart using conic gradients */}
                  <div 
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(
                        #10B981 0% ${stats.totalTasks ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%, 
                        #F59E0B ${stats.totalTasks ? (stats.completedTasks / stats.totalTasks) * 100 : 0}% ${stats.totalTasks ? ((stats.completedTasks + stats.inProgressTasks) / stats.totalTasks) * 100 : 0}%, 
                        #EF4444 ${stats.totalTasks ? ((stats.completedTasks + stats.inProgressTasks) / stats.totalTasks) * 100 : 0}% 100%
                      )`
                    }}
                  />
                  <div className="absolute inset-[15%] bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">{stats.totalTasks}</span>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
                  <span className="text-xs">In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-error-500 rounded-full mr-2"></div>
                  <span className="text-xs">Blocked</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Bar Chart for Tasks by Project */}
          <motion.div 
            {...{
              className: "bg-white dark:bg-neutral-800 p-6 rounded-lg shadow",
              variants: itemVariants
            } as any}
          >
            <h3 className="text-lg font-semibold mb-4">Tasks by Project</h3>
            <div className="space-y-3 h-64 overflow-y-auto">
              {Object.entries(stats.tasksByProject).map(([project, count], index) => (
                <div key={project} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">{project}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getGradientColor(index, Object.keys(stats.tasksByProject).length)}`}
                      style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* New Section: Advanced Visualizations */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Task Completion Trends</h3>
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
            <div className="h-64">
              {/* Time-based Line Chart for Task Completion Trend */}
              <div className="relative h-full flex items-end">
                {/* Y-Axis Labels */}
                <div className="absolute inset-y-0 left-0 w-10 flex flex-col justify-between text-xs text-neutral-500 py-4">
                  <span>5</span>
                  <span>4</span>
                  <span>3</span>
                  <span>2</span>
                  <span>1</span>
                  <span>0</span>
                </div>
                
                {/* Chart */}
                <div className="ml-10 flex-1 h-full flex items-end">
                  <div className="relative w-full h-full flex space-x-4">
                    {/* X-Axis Labels and Bars */}
                    {stats.completionTrend.map((item, index) => {
                      const height = (item.completed / 5) * 100;
                      return (
                        <div 
                          key={item.date} 
                          className="flex-1 flex flex-col items-center"
                        >
                          {/* Bar */}
                          <div className="w-full flex justify-center mb-2">
                            <div 
                              className="w-10 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t-md transition-all duration-500 ease-in-out"
                              style={{ height: `${height}%` }}
                            ></div>
                          </div>
                          
                          {/* X-Axis Label */}
                          <span className="text-xs text-neutral-500">{item.date}</span>
                        </div>
                      );
                    })}
                    
                    {/* Line Graph - We'll add points with connecting lines */}
                    <svg 
                      className="absolute inset-0 pointer-events-none" 
                      viewBox={`0 0 ${stats.completionTrend.length * 100} 100`}
                      preserveAspectRatio="none"
                    >
                      {/* Drawing a path connecting all points */}
                      <path
                        d={stats.completionTrend.map((item, index) => {
                          const x = index * 100 + 50;
                          const y = 100 - (item.completed / 5) * 100;
                          return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                        }).join(" ")}
                        strokeWidth="2"
                        stroke="#10B981"
                        fill="none"
                      />
                      
                      {/* Drawing points at each data point */}
                      {stats.completionTrend.map((item, index) => {
                        const x = index * 100 + 50;
                        const y = 100 - (item.completed / 5) * 100;
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#10B981"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4 text-sm text-neutral-500">
              <p>Task completion over the last 7 days</p>
            </div>
          </div>
        </div>
        
        {/* Task Priority Heatmap */}
        <motion.div 
          {...{
            className: "bg-white dark:bg-neutral-800 p-6 rounded-lg shadow mb-8",
            variants: itemVariants
          } as any}
        >
          <h3 className="text-lg font-semibold mb-4">Task Priority Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.tasksByPriority).map(([priority, count]) => {
              // Determine color based on priority
              let bgColor = '';
              let textColor = '';
              switch(priority) {
                case 'urgent':
                  bgColor = 'bg-gradient-to-br from-error-500/90 to-error-700/90';
                  textColor = 'text-white';
                  break;
                case 'high':
                  bgColor = 'bg-gradient-to-br from-warning-500/80 to-warning-700/80';
                  textColor = 'text-white';
                  break;
                case 'medium':
                  bgColor = 'bg-gradient-to-br from-info-500/70 to-info-700/70';
                  textColor = 'text-white';
                  break;
                case 'low':
                  bgColor = 'bg-gradient-to-br from-success-500/60 to-success-700/60';
                  textColor = 'text-white';
                  break;
                default:
                  bgColor = 'bg-gradient-to-br from-neutral-500/50 to-neutral-700/50';
                  textColor = 'text-white';
              }
              
              return (
                <div 
                  key={priority}
                  className={`${bgColor} ${textColor} rounded-lg p-4 shadow-md flex flex-col items-center justify-center h-32 transition-transform hover:scale-105`}
                >
                  <p className="font-semibold text-lg capitalize">{priority}</p>
                  <p className="text-3xl font-bold mt-2">{count}</p>
                  <p className="text-sm opacity-80 mt-1">
                    {stats.totalTasks ? `${Math.round((count / stats.totalTasks) * 100)}%` : '0%'}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
        
        {/* Productivity Insights */}
        <motion.div 
          {...{
            className: "bg-white dark:bg-neutral-800 p-6 rounded-lg shadow mb-8",
            variants: itemVariants
          } as any}
        >
          <h3 className="text-lg font-semibold mb-4">Productivity Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Productivity Score */}
            <div className="bg-neutral-100 dark:bg-neutral-700/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Productivity Score</h4>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}
                </div>
                <div className="text-lg font-semibold text-neutral-500 dark:text-neutral-400">/100</div>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-600 h-2 rounded-full mt-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  style={{ width: `${stats.totalTasks ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            {/* Most Productive Day */}
            <div className="bg-neutral-100 dark:bg-neutral-700/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Most Productive Day</h4>
              <div className="text-lg font-semibold text-success-600 dark:text-success-400">
                {stats.completionTrend.length > 0 ? 
                  stats.completionTrend.reduce((prev, current) => 
                    prev.completed > current.completed ? prev : current
                  ).date : 'N/A'}
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Based on task completion rate
              </p>
            </div>
            
            {/* Focus Recommendation */}
            <div className="bg-neutral-100 dark:bg-neutral-700/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">Focus Recommendation</h4>
              <div className="text-lg font-semibold text-warning-600 dark:text-warning-400">
                {Object.entries(stats.tasksByPriority)
                  .filter(([priority, _]) => priority === 'urgent' || priority === 'high')
                  .reduce((sum, [_, count]) => sum + count, 0)} high priority tasks
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Prioritize urgent and high priority tasks
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 
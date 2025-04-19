"use client";

import { motion } from 'framer-motion';

interface NavigationHelpProps {
  onClose: () => void;
}

export default function NavigationHelp({ onClose }: NavigationHelpProps) {
  // Animation for the help panel
  const helpPanelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        variants={helpPanelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
            Complete Navigation & Controls Guide
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-2xl w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Close help"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Workspace Navigation */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Workspace Navigation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Pan Controls</h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Click & Drag:</span> 
                    <span>Left Click and drag on empty space to pan around the workspace</span>
                    <span>Middle Scroll Button click to grab the Task Card and move it around the workspace</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Reset View:</span> 
                    <span>Click the &quot;Reset View&quot; button in the bottom left or press Ctrl/Cmd + 0</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Zoom Controls</h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Zoom In:</span> 
                    <span>Click the &quot;+&quot; button or press Ctrl/Cmd + Plus (+)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Zoom Out:</span> 
                    <span>Click the &quot;-&quot; button or press Ctrl/Cmd + Minus (-)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Reset Zoom:</span> 
                    <span>Double-click the zoom percentage or press Ctrl/Cmd + 0</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Task Management */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Task Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Task Creation & Editing</h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Create Task:</span> 
                    <span>Click the &quot;New Task&quot; button in the bottom left corner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Quick Create:</span> 
                    <span>Click on a project name in the sidebar to create a task for that project</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Edit Task:</span> 
                    <span>Click on a task to open it, then click the &quot;Edit&quot; button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Quick Edit:</span> 
                    <span>Hover on a task and click the edit (✏️) button that appears</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Task Operations</h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Move Task:</span> 
                    <span>Middle-click and drag a task to move it around the workspace</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Complete Task:</span> 
                    <span>Open a task and click &quot;Mark Complete&quot;</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Delete Task:</span> 
                    <span>Open a task and click &quot;Delete&quot;</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Change Status:</span> 
                    <span>Click on the status indicator in a task card to cycle through status options</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* View Modes */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">View Modes & Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Special Views</h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Focus Mode:</span> 
                    <span>Click &quot;Focus Mode&quot; in the header to focus on high-priority tasks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Timeline:</span> 
                    <span>Click &quot;Timeline&quot; in the header to see tasks organized by date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Analytics:</span> 
                    <span>Click &quot;Analytics&quot; in the header to view task statistics and metrics</span>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Navigation Features</h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Mini-Map:</span> 
                    <span>Appears when zoomed below 25%, click anywhere to navigate there</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Categories:</span> 
                    <span>Use the sidebar to filter tasks by category</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Search:</span> 
                    <span>Use the search bar in the header to find specific tasks</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mobile Controls */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Mobile & Touch Controls</h3>
            
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-neutral-900 dark:text-neutral-100">Touch Gestures</h4>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Long Press:</span> 
                  <span>Long press (2 seconds) on a task to select and move it</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Two Fingers:</span> 
                  <span>Use two fingers to pan around the dashboard in mobile view</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Task Options:</span> 
                  <span>Tap the three dots on a task to access task options</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Pinch Zoom:</span> 
                  <span>Pinch with two fingers to zoom in and out (where supported)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Keyboard Shortcuts</h3>
            
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Ctrl/Cmd + +</span> 
                  <span>Zoom in</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Ctrl/Cmd + -</span> 
                  <span>Zoom out</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Ctrl/Cmd + 0</span> 
                  <span>Reset zoom and view</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2 text-primary-600 dark:text-primary-400 inline-block w-32">Esc</span> 
                  <span>Close current dialog or panel</span>
                </li>
              </ul>
            </div>
          </section>

          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="btn-primary py-2 px-6"
            >
              Got it!
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
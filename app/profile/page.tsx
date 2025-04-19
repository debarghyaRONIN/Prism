"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  joinDate: string;
  completedTasks: number;
  activeTasks: number;
  skillTags: string[];
  recentActivity: {
    type: string;
    description: string;
    date: string;
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'Product Designer',
    avatar: '',
    bio: 'Passionate designer with 5+ years of experience in UI/UX and product design. Focused on creating intuitive and accessible user experiences.',
    joinDate: 'January 2023',
    completedTasks: 127,
    activeTasks: 8,
    skillTags: ['UI Design', 'UX Research', 'Prototyping', 'User Testing', 'Figma', 'Design Systems'],
    recentActivity: [
      {
        type: 'task_completed',
        description: 'Completed "Design System Components" task',
        date: '2 days ago'
      },
      {
        type: 'task_created',
        description: 'Created "User Research Plan" task',
        date: '3 days ago'
      },
      {
        type: 'comment_added',
        description: 'Commented on "Mobile App Navigation Flow"',
        date: '5 days ago'
      }
    ]
  });

  // Get initials from the user's name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
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
              className="mr-2"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div 
              {...{
                className: "bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden",
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.3 }
              } as any}
            >
              <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <div className="p-6 relative">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="h-24 w-24 rounded-full bg-white dark:bg-neutral-700 p-1 shadow-lg">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials(profile.name)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-10 text-center">
                  <h1 className="text-xl font-bold text-neutral-800 dark:text-white">{profile.name}</h1>
                  <p className="text-neutral-500 dark:text-neutral-400">{profile.role}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{profile.email}</p>
                  
                  <div className="mt-4">
                    <Link 
                      href="/profile/edit"
                      className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-md text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
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
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      Edit Profile
                    </Link>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-2">About</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm">{profile.bio}</p>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillTags.map((skill, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{profile.completedTasks}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Completed Tasks</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{profile.activeTasks}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Active Tasks</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  Member since {profile.joinDate}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Stats */}
            <motion.div 
              {...{
                className: "bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6",
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.3, delay: 0.1 }
              } as any}
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 mb-4">Task Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">Completion Rate</div>
                  <div className="text-2xl font-bold text-primary-700 dark:text-primary-300">94%</div>
                  <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">↑ 12% from last month</div>
                </div>
                
                <div className="bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-success-600 dark:text-success-400 mb-1">On-time Delivery</div>
                  <div className="text-2xl font-bold text-success-700 dark:text-success-300">87%</div>
                  <div className="text-xs text-success-600 dark:text-success-400 mt-1">↑ 5% from last month</div>
                </div>
                
                <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/30 dark:to-secondary-800/30 rounded-lg p-4">
                  <div className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">Task Efficiency</div>
                  <div className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">92%</div>
                  <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">↑ 8% from last month</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-4">Weekly Activity</h3>
                <div className="h-40 flex items-end space-x-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const height = `${Math.floor(Math.random() * 70) + 10}%`;
                    const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex justify-center">
                          <div 
                            className="w-4/5 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t-md"
                            style={{ height }}
                          ></div>
                        </div>
                        <div className="text-xs mt-2 text-neutral-600 dark:text-neutral-400">{day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div 
              {...{
                className: "bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6",
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.3, delay: 0.2 }
              } as any}
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {profile.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'task_completed' ? 'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400' :
                      activity.type === 'task_created' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' :
                      'bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-400'
                    }`}>
                      {activity.type === 'task_completed' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : activity.type === 'task_created' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-neutral-700 dark:text-neutral-300">{activity.description}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  View all activity
                </button>
              </div>
            </motion.div>
            
            {/* Projects */}
            <motion.div 
              {...{
                className: "bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6",
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.3, delay: 0.3 }
              } as any}
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 mb-4">Projects</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 mr-3"></div>
                    <span>Design System</span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">23 tasks</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-600 mr-3"></div>
                    <span>Mobile App</span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">17 tasks</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-success-400 to-success-600 mr-3"></div>
                    <span>Marketing Website</span>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">12 tasks</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    email: 'alex.johnson@example.com',
    emailNotifications: true,
    taskReminders: true,
    weeklyDigest: true,
    darkMode: true,
    timezone: 'America/New_York',
    language: 'English',
    twoFactorAuth: false
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Handle toggle change
  const handleToggleChange = (field: keyof typeof settings) => {
    setSettings({
      ...settings,
      [field]: !settings[field]
    });
  };
  
  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
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
            Back
          </button>
          
          <div className="flex space-x-4">
            <Link 
              href="/profile"
              className="text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline"
            >
              Profile
            </Link>
            <Link 
              href="/profile/edit"
              className="text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <motion.div
          {...{
            className: "max-w-3xl mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 }
          } as any}
        >
          <div className="h-24 bg-gradient-to-r from-primary-500 to-secondary-500 relative">
            <h1 className="absolute bottom-4 left-6 text-2xl font-bold text-white">Account Settings</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              {/* Email Preferences Section */}
              <div>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">Email Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {settings.email}
                      </p>
                    </div>
                    <button 
                      type="button"
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Notifications</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Receive notifications about your tasks and projects
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.emailNotifications ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
                          }`}
                          onClick={() => handleToggleChange('emailNotifications')}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                              settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Task Reminders</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Receive reminders about upcoming tasks and deadlines
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.taskReminders ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
                          }`}
                          onClick={() => handleToggleChange('taskReminders')}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                              settings.taskReminders ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Weekly Digest</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Receive a weekly summary of your tasks and progress
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.weeklyDigest ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
                          }`}
                          onClick={() => handleToggleChange('weeklyDigest')}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                              settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* App Preferences Section */}
              <div>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">App Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Dark Mode</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Toggle dark mode on or off
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.darkMode ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
                        }`}
                        onClick={() => handleToggleChange('darkMode')}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                            settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Timezone</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Set your local timezone
                        </p>
                      </div>
                      <div className="w-48">
                        <select
                          name="timezone"
                          value={settings.timezone}
                          onChange={handleSelectChange}
                          className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Paris (CET)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Language</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Select your preferred language
                        </p>
                      </div>
                      <div className="w-48">
                        <select
                          name="language"
                          value={settings.language}
                          onChange={handleSelectChange}
                          className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Chinese">Chinese</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security Section */}
              <div>
                <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">Security</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Last changed 2 months ago
                      </p>
                    </div>
                    <button 
                      type="button"
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Two-Factor Authentication</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.twoFactorAuth ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
                          }`}
                          onClick={() => handleToggleChange('twoFactorAuth')}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                              settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-error-600 dark:text-error-400">Delete Account</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Permanently delete your account and all your data
                        </p>
                      </div>
                      <button 
                        type="button"
                        className="px-3 py-1.5 bg-error-50 dark:bg-error-900 text-error-600 dark:text-error-400 text-sm font-medium rounded-md hover:bg-error-100 dark:hover:bg-error-800 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
              {savedSuccess && (
                <motion.div
                  {...{
                    className: "text-success-600 dark:text-success-400 text-sm flex items-center",
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0 }
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Settings saved successfully
                </motion.div>
              )}
              
              <div className="ml-auto">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 
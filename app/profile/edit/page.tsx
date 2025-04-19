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
  skillTags: string[];
}

export default function ProfileEditPage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'Product Designer',
    avatar: '',
    bio: 'Passionate designer with 5+ years of experience in UI/UX and product design. Focused on creating intuitive and accessible user experiences.',
    skillTags: ['UI Design', 'UX Research', 'Prototyping', 'User Testing', 'Figma', 'Design Systems']
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Get initials from the user's name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Add a new skill tag
  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skillTags.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skillTags: [...profile.skillTags, newSkill.trim()]
      });
      setNewSkill('');
    }
  };
  
  // Remove a skill tag
  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skillTags: profile.skillTags.filter(skill => skill !== skillToRemove)
    });
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
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
            Back to Profile
          </button>
          
          <Link 
            href="/profile/settings" 
            className="text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Account Settings
          </Link>
        </div>

        <motion.div
          {...{
            className: "max-w-3xl mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 }
          } as any}
        >
          <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500 relative">
            <h1 className="absolute bottom-4 left-6 text-2xl font-bold text-white">Edit Profile</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="mb-6 relative">
                  <div className="h-32 w-32 rounded-full bg-white dark:bg-neutral-700 p-1 shadow-lg">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                        {getInitials(profile.name)}
                      </div>
                    )}
                    
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700 transition-colors"
                      title="Change profile picture"
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
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Upload a new avatar
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    JPG, PNG or GIF. 1MB max.
                  </p>
                </div>
                
                <label className="inline-block bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-800 cursor-pointer transition-colors">
                  Upload Photo
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
              
              {/* Form Fields */}
              <div className="md:w-2/3">
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  {/* Role/Title */}
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={profile.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={profile.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Brief description about yourself. This will be visible on your profile.
                    </p>
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.skillTags.map((skill, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 px-2 py-1 rounded-full"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 text-neutral-500 hover:text-error-500"
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
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-l-md shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors"
                      >
                        Add
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
                  Profile updated successfully
                </motion.div>
              )}
              
              <div className="ml-auto flex space-x-3">
                <Link
                  href="/profile"
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </Link>
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
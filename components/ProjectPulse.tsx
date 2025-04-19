"use client";

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Create a client-only version of this component to avoid hydration mismatches
const ProjectPulseClient = dynamic(() => import('./ProjectPulseClient'), { 
  ssr: false,
  loading: () => (
    <div 
      className="w-full h-full rounded-full overflow-hidden"
      style={{ background: 'radial-gradient(circle, rgba(10,10,10,0.3) 0%, rgba(30,30,30,0) 70%)' }}
    />
  )
});

export default function ProjectPulse() {
  return <ProjectPulseClient />;
} 
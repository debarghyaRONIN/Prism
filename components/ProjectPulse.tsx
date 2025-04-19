"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ProjectPulse() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles with reduced count for better performance
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100; // Reduced from 200
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x0ea5e9); // primary color
    const color2 = new THREE.Color(0xd946ef); // secondary color
    const color3 = new THREE.Color(0x22c55e); // success color
    const color4 = new THREE.Color(0xf59e0b); // warning color
    
    const colorOptions = [color1, color2, color3, color4];
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a sphere
      const radius = 2 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2; // Random angle
      const phi = Math.acos((Math.random() * 2) - 1); // Random height
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Assign random colors from our palette
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = randomColor.r;
      colors[i * 3 + 1] = randomColor.g;
      colors[i * 3 + 2] = randomColor.b;
      
      // Vary particle sizes
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Simplified shader material for particles - removed complex effects
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (250.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          if (distanceToCenter > 0.5) discard;
          gl_FragColor = vec4(vColor, 0.7);
        }
      `,
      transparent: true,
      vertexColors: true
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Create glowing center sphere
    const coreGeometry = new THREE.SphereGeometry(0.4, 16, 16); // Reduced complexity
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    
    // Animation loop with reduced complexity
    const clock = new THREE.Clock();
    let frame: number;
    let frameSkip = 0; // For frame skipping to improve performance
    
    const animate = () => {
      frame = requestAnimationFrame(animate);
      
      // Skip frames for better performance (render at ~30fps instead of 60fps)
      frameSkip++;
      if (frameSkip % 2 !== 0) return;
      
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate the particle system - slower rotation
      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.z = elapsedTime * 0.02;
      
      // Pulse the core - simpler animation
      const scale = 1 + Math.sin(elapsedTime) * 0.08;
      core.scale.set(scale, scale, scale);
      
      // Simplified particle animation - avoid per-particle updates
      if (Math.floor(elapsedTime) % 3 === 0) {
        const sizes = particleGeometry.attributes.size.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          sizes[i] = Math.random() * 0.08 + 0.02;
        }
        
        particleGeometry.attributes.size.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-full overflow-hidden"
      style={{ 
        background: 'radial-gradient(circle, rgba(10,10,10,0.3) 0%, rgba(30,30,30,0) 70%)',
      }}
    />
  );
} 
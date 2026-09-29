import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
      const isClickable = clickableTags.includes(target.tagName) || 
                          target.closest('a') || 
                          target.closest('button') || 
                          target.closest('.group') ||
                          target.closest('.cursor-pointer');
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* 1. Global Ambient Aura (Deep blur trail) */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-luxury-gold/5 rounded-full pointer-events-none z-[9990] blur-[30px]"
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
      />

      {/* 2. Outer Trailing Ring with Glassmorphism */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-luxury-gold/30 rounded-full pointer-events-none z-[9998] flex items-center justify-center backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isClicking ? 0.7 : isHovering ? 1.4 : 1,
          borderColor: isHovering ? 'rgba(212, 175, 55, 0.8)' : 'rgba(212, 175, 55, 0.3)',
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.6 }}
      >
        {/* Dynamic spinner ring that activates on hover */}
        {isHovering && (
          <motion.div 
            className="w-[110%] h-[110%] border border-t-transparent border-r-transparent border-luxury-gold/60 rounded-full absolute"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        )}
      </motion.div>

      {/* 3. Core Immediate Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicking ? 0.5 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 25, mass: 0.1 }}
      />
    </>
  );
}

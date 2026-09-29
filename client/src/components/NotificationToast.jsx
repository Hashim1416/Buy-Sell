import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationToast() {
  const { notifications } = useContext(AppContext);

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return 'border-luxury-gold/50 bg-[#0F0F0F]/90 text-luxury-gold';
      case 'warning':
        return 'border-red-500/50 bg-[#0F0F0F]/90 text-red-400';
      default:
        return 'border-luxury-silver/20 bg-[#0F0F0F]/90 text-white';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-lg border backdrop-blur-md shadow-2xl flex items-center gap-3 ${getStyle(n.type)}`}
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <p className="text-xs font-semibold tracking-wider uppercase font-sans">{n.text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

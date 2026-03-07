'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatefulButtonProps {
  onClick?: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  idleText?: string;
  loadingText?: string;
  successText?: string;
}

export const Button = ({
  onClick,
  children,
  className,
  loadingText = 'Cargando...',
  successText = '¡Listo!',
}: StatefulButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (status !== 'idle') return;
    
    setStatus('loading');
    try {
      if (onClick) {
        await onClick();
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading'}
      className={cn(
        'relative h-14 min-w-[200px] overflow-hidden rounded-full px-8 py-2 font-bold tracking-[0.2em] uppercase text-[10px] transition-all duration-500',
        status === 'idle' && 'bg-slate-950 text-white hover:bg-slate-900 shadow-xl',
        status === 'loading' && 'bg-slate-800 text-white cursor-wait',
        status === 'success' && 'bg-primary text-white',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2"
          >
            {children}
          </motion.span>
        )}
        {status === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText}
          </motion.span>
        )}
        {status === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            {successText}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

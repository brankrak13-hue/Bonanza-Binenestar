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
        'relative h-14 min-w-[200px] overflow-hidden rounded-full px-10 py-2 font-bold tracking-[0.2em] uppercase text-[10px] transition-all duration-500',
        // Estado inicial: Verde Bonanza con efecto de borde (ring) al hacer hover
        status === 'idle' && 'bg-primary text-white hover:bg-primary/90 shadow-xl border border-white/10 hover:ring-4 hover:ring-primary/20 hover:ring-offset-2',
        status === 'loading' && 'bg-primary/80 text-white cursor-wait',
        status === 'success' && 'bg-accent text-white',
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

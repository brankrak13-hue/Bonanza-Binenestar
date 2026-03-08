'use client';
import { useEffect } from 'react';
import { m, stagger, useAnimate } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(' ');
  useEffect(() => {
    if (scope.current) {
      animate(
        'span',
        {
          opacity: 1,
          filter: filter ? 'blur(0px)' : 'none',
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.1),
        }
      );
    }
  }, [scope.current, animate, duration, filter]);

  const renderWords = () => {
    return (
      <m.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <m.span
              key={word + idx}
              className="opacity-0"
              style={{
                filter: filter ? 'blur(10px)' : 'none',
              }}
            >
              {word}{' '}
            </m.span>
          );
        })}
      </m.div>
    );
  };

  return (
    <div className={cn('font-normal', className)}>
      <div className="mt-4">
        <div className="leading-relaxed tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

'use client';

import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export function AnimatedLogo() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.6, 0.01, 0.05, 0.95],
        duration: 0.8
      }
    }
  };

  return (
    <div className={`flex flex-col ${inter.className}`}>
      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='flex'
      >
        {'OPEN'.split('').map((letter, index) => (
          <motion.span
            key={index}
            variants={letterAnimation}
            className='text-2xl font-medium tracking-[0.4em]'
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='-mt-2 flex'
        style={{ animationDelay: '0.5s' }}
      >
        {'STUDIO'.split('').map((letter, index) => (
          <motion.span
            key={index}
            variants={letterAnimation}
            className='text-lg font-light tracking-[0.3em]'
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

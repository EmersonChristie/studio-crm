'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: 'Every artist was first an amateur.',
    author: 'Ralph Waldo Emerson'
  },
  {
    text: 'Art enables us to find ourselves and lose ourselves at the same time.',
    author: 'Thomas Merton'
  },
  {
    text: 'Creativity takes courage.',
    author: 'Henri Matisse'
  },
  {
    text: 'Art washes away from the soul the dust of everyday life.',
    author: 'Pablo Picasso'
  },
  {
    text: 'Every child is an artist. The problem is how to remain an artist once we grow up.',
    author: 'Pablo Picasso'
  },
  {
    text: 'I dream of painting and then I paint my dream.',
    author: 'Vincent van Gogh'
  },
  {
    text: "You don't take a photograph, you make it.",
    author: 'Ansel Adams'
  }
];

export function AnimatedQuote() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = quotes.findIndex(
        (q) => q.text === currentQuote.text
      );
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * quotes.length);
      } while (nextIndex === currentIndex); // Ensure we don't show the same quote twice
      setCurrentQuote(quotes[nextIndex]);
    }, 10000);

    return () => clearInterval(timer);
  }, [currentQuote]);

  return (
    <div className='flex max-w-md flex-col items-center justify-center space-y-4'>
      <AnimatePresence mode='wait'>
        <motion.blockquote
          key={currentQuote.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut'
          }}
          className='space-y-6 text-center'
        >
          <motion.p className='text-2xl font-light uppercase leading-relaxed tracking-[0.1em]'>
            &ldquo;{currentQuote.text}&rdquo;
          </motion.p>
          <motion.footer className='text-lg tracking-[0.15em] text-zinc-400'>
            — {currentQuote.author}
          </motion.footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  );
}

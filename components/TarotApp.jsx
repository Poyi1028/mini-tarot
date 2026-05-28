'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InputScreen from './InputScreen';
import ShuffleScreen from './ShuffleScreen';
import SpreadScreen from './SpreadScreen';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function TarotApp() {
  const [screen, setScreen] = useState('input'); // input | shuffle | spread
  const [question, setQuestion] = useState('');

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink text-parchment font-serif">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="absolute inset-0"
          variants={fade}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {screen === 'input' && (
            <InputScreen
              onSubmit={(q) => {
                setQuestion(q);
                setScreen('shuffle');
              }}
            />
          )}
          {screen === 'shuffle' && <ShuffleScreen onComplete={() => setScreen('spread')} />}
          {screen === 'spread' && (
            <SpreadScreen
              question={question}
              onRestart={() => {
                setQuestion('');
                setScreen('input');
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

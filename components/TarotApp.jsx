'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, DUR, fade } from '@/lib/motion';
import InputScreen from './InputScreen';
import ShuffleScreen from './ShuffleScreen';
import SpreadScreen from './SpreadScreen';

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
          transition={{ duration: DUR.base, ease: EASE.inOut }}
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

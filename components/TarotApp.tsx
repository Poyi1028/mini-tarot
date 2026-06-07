'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, DUR, fade } from '@/lib/motion';
import HomeScreen from './HomeScreen';
import InputScreen from './InputScreen';
import ShuffleScreen from './ShuffleScreen';
import SpreadScreen from './SpreadScreen';
import DeckScreen from './DeckScreen';
import DailyScreen from './DailyScreen';

type Screen = 'home' | 'input' | 'shuffle' | 'spread' | 'deck' | 'daily';

export default function TarotApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [question, setQuestion] = useState('');
  const go = setScreen;

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
          {screen === 'home' && <HomeScreen onStart={() => go('input')} />}
          {screen === 'deck' && <DeckScreen onBack={() => go('input')} />}
          {screen === 'input' && (
            <InputScreen
              onSubmit={(q) => {
                setQuestion(q);
                go('shuffle');
              }}
              onOpenDaily={() => go('daily')}
              onOpenDeck={() => go('deck')}
              onBack={() => go('home')}
            />
          )}
          {screen === 'daily' && <DailyScreen onBack={() => go('input')} />}
          {screen === 'shuffle' && <ShuffleScreen onComplete={() => go('spread')} />}
          {screen === 'spread' && (
            <SpreadScreen
              question={question}
              onRestart={() => {
                setQuestion('');
                go('home');
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

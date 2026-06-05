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
          {screen === 'home' && <HomeScreen onStart={() => setScreen('input')} />}
          {screen === 'deck' && <DeckScreen onBack={() => setScreen('input')} />}
          {screen === 'input' && (
            <InputScreen
              onSubmit={(q) => {
                setQuestion(q);
                setScreen('shuffle');
              }}
              onOpenDaily={() => setScreen('daily')}
              onOpenDeck={() => setScreen('deck')}
              onBack={() => setScreen('home')}
            />
          )}
          {screen === 'daily' && <DailyScreen onBack={() => setScreen('input')} />}
          {screen === 'shuffle' && <ShuffleScreen onComplete={() => setScreen('spread')} />}
          {screen === 'spread' && (
            <SpreadScreen
              question={question}
              onRestart={() => {
                setQuestion('');
                setScreen('home');
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

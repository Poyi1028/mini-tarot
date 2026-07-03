'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, DUR, fade } from '@/lib/motion';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import InputScreen from './InputScreen';
import ShuffleScreen from './ShuffleScreen';
import SpreadScreen from './SpreadScreen';
import DeckScreen from './DeckScreen';

type Screen = 'splash' | 'home' | 'input' | 'shuffle' | 'spread' | 'deck';

export default function TarotApp() {
  // 開場固定從 splash 起；它自動退場到 home。之後的內部導覽都在 home/input/...
  // 之間，splash 不會重播（只有整頁重新載入才會再出現，那正是要遮字體載入的時機）。
  const [screen, setScreen] = useState<Screen>('splash');
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
          {screen === 'splash' && <SplashScreen onDone={() => go('home')} />}
          {screen === 'home' && (
            <HomeScreen
              onStart={() => go('input')}
              onOpenDeck={() => go('deck')}
            />
          )}
          {screen === 'deck' && <DeckScreen onBack={() => go('home')} />}
          {screen === 'input' && (
            <InputScreen
              onSubmit={(q) => {
                setQuestion(q);
                go('shuffle');
              }}
              onBack={() => go('home')}
            />
          )}
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

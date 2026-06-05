import { TAROT_CARDS } from './tarot-cards';
import type { Card } from './tarot-cards';

// 今日運勢的持久化：每天固定一張牌（含 50% 逆位）。第一次在當天開啟時抽出
// 並寫入 localStorage，同一天之後再開都回傳同一張；跨日才會重新抽。每位使用者
// 各自抽到自己的牌（非全站同一張）。

const STORAGE_KEY = 'mini-tarot:daily-draw';

export interface DailyDraw {
  card: Card;
  reversed: boolean;
  dateKey: string;
}

interface Stored {
  date: string;
  num: number;
  reversed: boolean;
}

// 以「本地時間」（非 UTC）產生 'YYYY-MM-DD'，避免跨時區提早／延後換日。
export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 給 UI 顯示的日期，如 2026.06.05
export function dateDisplay(dateKey: string): string {
  return dateKey.replace(/-/g, '.');
}

export function getDailyDraw(): DailyDraw {
  const today = localDateKey();

  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Stored;
        if (saved.date === today) {
          const card = TAROT_CARDS.find((c) => c.num === saved.num);
          if (card) return { card, reversed: saved.reversed, dateKey: today };
        }
      }
    } catch {
      // 毀損的資料：忽略並重抽
    }
  }

  const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  const reversed = Math.random() < 0.5;

  if (typeof window !== 'undefined') {
    try {
      const payload: Stored = { date: today, num: card.num, reversed };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // 隱私模式等 localStorage 不可用：仍照常回傳，只是不持久化
    }
  }

  return { card, reversed, dateKey: today };
}

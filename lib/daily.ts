import { TAROT_CARDS } from './tarot-cards';
import type { Card } from './tarot-cards';

// 今日運勢的持久化：每天固定一張牌（含 50% 逆位）。首頁先準備當日牌，
// 首次翻開時才寫入 localStorage；同一天之後再進首頁都維持翻開，跨日才重抽。
// 每位使用者各自抽到自己的牌（非全站同一張）。

const STORAGE_KEY = 'mini-tarot:daily-draw';

export interface DailyDraw {
  card: Card;
  reversed: boolean;
  dateKey: string;
}

export interface PreparedDailyDraw {
  draw: DailyDraw;
  alreadyDrawn: boolean;
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

function readStoredDailyDraw(): DailyDraw | null {
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

  return null;
}

function createDailyDraw(): DailyDraw {
  const today = localDateKey();
  const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  const reversed = Math.random() < 0.5;
  return { card, reversed, dateKey: today };
}

export function saveDailyDraw(draw: DailyDraw): void {
  if (typeof window !== 'undefined') {
    try {
      const payload: Stored = {
        date: draw.dateKey,
        num: draw.card.num,
        reversed: draw.reversed,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // 隱私模式等 localStorage 不可用：仍可完成本次翻牌，只是不持久化
    }
  }
}

// 首頁 mount 後準備今日牌。沒有既存結果時只先抽牌，不立即寫入；
// 使用者真正翻牌時才由 saveDailyDraw() 記錄，避免「看過首頁」被誤判為已測。
export function prepareDailyDraw(): PreparedDailyDraw {
  const stored = readStoredDailyDraw();
  if (stored) return { draw: stored, alreadyDrawn: true };
  return { draw: createDailyDraw(), alreadyDrawn: false };
}

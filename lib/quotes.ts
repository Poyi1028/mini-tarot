// Home-screen epigraphs — a small curated pool shown one-at-a-time on the new
// home (the "threshold" screen). Keep attributions exactly as the curator wrote
// them; `source` is optional (only some lines cite a work).
//
// IMPORTANT: never pick from this pool during render/SSR (Math.random in render
// causes a hydration mismatch). Pick client-side in an effect after mount — see
// HomeScreen — so the server and client first paint agree.

export interface Quote {
  text: string;
  author: string;
  source?: string;
}

export const QUOTES: ReadonlyArray<Quote> = [
  { text: '萬物皆有裂痕\n那是光照進來的地方', author: 'Leonard Cohen', source: 'Anthem' },
  { text: '願你迷路到一個明亮的地方', author: '蔣勳' },
  { text: '你不需要看清整座樓梯\n只要跨出第一步就好', author: 'Martin Luther King Jr.' },
  { text: '命運不坐在你的手掌心\n他藏在每一個你當下的選擇裡', author: 'Carl Jung' },
  { text: '生活並不是等待暴風雨過去\n而是學會在雨中跳舞', author: 'Vivian Greene' },
  { text: '凡是過去，皆為序章', author: 'Shakespeare' },
  { text: '心之所向，便是微光', author: 'Tagore' },
  { text: '我們都生活在陰溝裡\n但仍有人仰望星空', author: 'Oscar Wilde', source: '溫夫人的扇子' },
  { text: '真正重要的東西\n用眼睛是看不見的', author: 'Antoine de Saint-Exupéry', source: '小王子' },
  { text: '希望是有羽毛的事物\n棲息在靈魂裡', author: 'Emily Dickinson' },
  { text: '未經省察的人生\n不值得過', author: 'Socrates' },
];

export type Suit = 'cups' | 'pentacles' | 'swords' | 'wands';

interface BaseCard {
  num: number;
  roman: string;
  cn: string;
  en: string;
  img: string;
  keywords: string[];
  meaning: string;
}

export interface MajorCard extends BaseCard {
  arcana: 'major';
}

export interface MinorCard extends BaseCard {
  arcana: 'minor';
  suit: Suit;
}

export type Card = MajorCard | MinorCard;

// ─── Major Arcana 大阿爾克娜 (0–21) ───
export const MAJOR_ARCANA: MajorCard[] = [
  { num: 0,   roman: '0',     arcana: 'major', cn: '愚者',       en: 'The Fool',           img: '/cards/00-TheFool.png',          keywords: ['新開始', '純粹', '冒險'],         meaning: '一場未知旅程的起點。放下顧慮，順從心中的呼喚向前躍出。' },
  { num: 1,   roman: 'I',     arcana: 'major', cn: '魔術師',     en: 'The Magician',       img: '/cards/01-TheMagician.png',      keywords: ['創造', '意志', '行動'],           meaning: '你已擁有所需的全部工具。集中意念，化想像為現實。' },
  { num: 2,   roman: 'II',    arcana: 'major', cn: '女祭司',     en: 'The High Priestess', img: '/cards/02-TheHighPriestess.png', keywords: ['直覺', '神秘', '潛意識'],         meaning: '答案藏在靜默裡。傾聽內在低語，勿急於以邏輯定奪。' },
  { num: 3,   roman: 'III',   arcana: 'major', cn: '皇后',       en: 'The Empress',        img: '/cards/03-TheEmpress.png',       keywords: ['豐饒', '滋養', '感性'],           meaning: '創造力正豐盛地流動。允許自己被愛、被照顧、被孕育。' },
  { num: 4,   roman: 'IV',    arcana: 'major', cn: '皇帝',       en: 'The Emperor',        img: '/cards/04-TheEmperor.png',       keywords: ['秩序', '權威', '穩定'],           meaning: '以結構與紀律建立疆界。你是自己王國的主宰者。' },
  { num: 5,   roman: 'V',     arcana: 'major', cn: '教皇',       en: 'The Hierophant',     img: '/cards/05-TheHierophant.png',    keywords: ['傳統', '指引', '信念'],           meaning: '一位導師或既有智慧正在指引方向。傳統並非束縛，而是橋樑。' },
  { num: 6,   roman: 'VI',    arcana: 'major', cn: '戀人',       en: 'The Lovers',         img: '/cards/06-TheLovers.png',        keywords: ['結合', '抉擇', '和諧'],           meaning: '一場攸關心靈的選擇。誠實面對你真正想要的，便能找到契合。' },
  { num: 7,   roman: 'VII',   arcana: 'major', cn: '戰車',       en: 'The Chariot',        img: '/cards/07-TheChariot.png',       keywords: ['意志', '前進', '勝利'],           meaning: '駕馭內在矛盾的兩股力量，方向已明，全速前行。' },
  { num: 8,   roman: 'VIII',  arcana: 'major', cn: '力量',       en: 'Strength',           img: '/cards/08-Strength.png',         keywords: ['溫柔', '勇氣', '馴服'],           meaning: '真正的力量是以柔克剛。以慈悲，而非壓制，面對心中的猛獸。' },
  { num: 9,   roman: 'IX',    arcana: 'major', cn: '隱者',       en: 'The Hermit',         img: '/cards/09-TheHermit.png',        keywords: ['內省', '獨處', '智慧'],           meaning: '退到一旁點亮自己的燈。獨處之中，將會看見方向。' },
  { num: 10,  roman: 'X',     arcana: 'major', cn: '命運之輪',   en: 'Wheel of Fortune',   img: '/cards/10-WheelOfFortune.png',   keywords: ['轉變', '循環', '時機'],           meaning: '一切都在轉動。順應流動，無論起落，皆是此刻該經歷的。' },
  { num: 11,  roman: 'XI',    arcana: 'major', cn: '正義',       en: 'Justice',            img: '/cards/11-Justice.png',          keywords: ['平衡', '真相', '因果'],           meaning: '萬事有其衡量。坦誠以對，所種之因將以恰好的方式回應你。' },
  { num: 12,  roman: 'XII',   arcana: 'major', cn: '吊人',       en: 'The Hanged Man',     img: '/cards/12-TheHangedMan.png',     keywords: ['暫停', '轉念', '臣服'],           meaning: '此刻不必前進。倒立過來，世界會以另一種樣貌向你顯現。' },
  { num: 13,  roman: 'XIII',  arcana: 'major', cn: '死神',       en: 'Death',              img: '/cards/13-Death.png',            keywords: ['終結', '蛻變', '重生'],           meaning: '某段過往正在落幕。允許它離去，新的版本才能浮現。' },
  { num: 14,  roman: 'XIV',   arcana: 'major', cn: '節制',       en: 'Temperance',         img: '/cards/14-Temperance.png',       keywords: ['調和', '耐心', '中道'],           meaning: '不急不躁，不偏不倚。在兩極之間調出屬於你的甘露。' },
  { num: 15,  roman: 'XV',    arcana: 'major', cn: '惡魔',       en: 'The Devil',          img: '/cards/15-TheDevil.png',         keywords: ['執著', '陰影', '誘惑'],           meaning: '看清你自願戴上的鎖鏈。承認它，便能解開它。' },
  { num: 16,  roman: 'XVI',   arcana: 'major', cn: '高塔',       en: 'The Tower',          img: '/cards/16-TheTower.png',         keywords: ['突變', '崩解', '覺醒'],           meaning: '一場必要的瓦解。虛構的塔倒下，真實的地基才會顯露。' },
  { num: 17,  roman: 'XVII',  arcana: 'major', cn: '星星',       en: 'The Star',           img: '/cards/17-TheStar.png',          keywords: ['希望', '療癒', '靈感'],           meaning: '風暴之後，一顆星在指引你。相信宇宙仍在你這一邊。' },
  { num: 18,  roman: 'XVIII', arcana: 'major', cn: '月亮',       en: 'The Moon',           img: '/cards/18-TheMoon.png',          keywords: ['幻象', '潛意識', '迷霧'],         meaning: '事物未必如其所現。穿越迷霧需要直覺，而非眼睛。' },
  { num: 19,  roman: 'XIX',   arcana: 'major', cn: '太陽',       en: 'The Sun',            img: '/cards/19-TheSun.png',           keywords: ['喜悅', '豐盛', '澄明'],           meaning: '光照耀著你。允許自己被看見、被慶祝、被溫暖。' },
  { num: 20,  roman: 'XX',    arcana: 'major', cn: '審判',       en: 'Judgement',          img: '/cards/20-Judgement.png',        keywords: ['召喚', '寬恕', '覺醒'],           meaning: '一個更高的呼喚正在響起。寬恕過去的自己，回應它。' },
  { num: 21,  roman: 'XXI',   arcana: 'major', cn: '世界',       en: 'The World',          img: '/cards/21-TheWorld.png',         keywords: ['完成', '圓滿', '整合'],           meaning: '一個循環圓滿收束。你已抵達，並準備好下一場啟程。' },
];

// ─── Minor Arcana 小阿爾克娜 (四元素 × 一至十 + 宮廷牌) ───
// 牌序：Ace(1)、2–10、Page(11)侍者、Knight(12)騎士、Queen(13)王后、King(14)國王
interface SuitMeta {
  cn: string;
  en: string;
  symbol: string;
  base: number;
}

const SUIT_META: Record<Suit, SuitMeta> = {
  cups:      { cn: '聖杯', en: 'Cups',      symbol: '♥', base: 22 }, // 水 · 情感
  pentacles: { cn: '錢幣', en: 'Pentacles', symbol: '♦', base: 36 }, // 土 · 物質
  swords:    { cn: '寶劍', en: 'Swords',    symbol: '♠', base: 50 }, // 風 · 思緒
  wands:     { cn: '權杖', en: 'Wands',     symbol: '♣', base: 64 }, // 火 · 行動
};

const RANK_CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍者', '騎士', '王后', '國王'];
const RANK_EN = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

interface SuitCardData {
  keywords: string[];
  meaning: string;
}

// 每套花色 14 張的關鍵字與牌義（依牌序排列）
const SUIT_DATA: Record<Suit, SuitCardData[]> = {
  cups: [
    { keywords: ['新感情', '豐盈', '直覺'],   meaning: '一只滿溢的杯自天而降，讓心重新被愛與靈感注滿。' },
    { keywords: ['連結', '互愛', '契合'],     meaning: '兩顆心舉杯相映，一段相互滋養的關係正在締結。' },
    { keywords: ['歡聚', '友誼', '慶賀'],     meaning: '與所愛之人舉杯共舞，喜悅因分享而加倍。' },
    { keywords: ['倦怠', '內省', '錯失'],     meaning: '沉浸於不滿足之中，別讓眼前遞來的恩典悄悄溜走。' },
    { keywords: ['悲傷', '失望', '釋懷'],     meaning: '為傾倒的杯哀傷之餘，回頭仍有兩只盈滿等你拾起。' },
    { keywords: ['回憶', '童心', '重逢'],     meaning: '往日的甜美輕叩心門，純真與善意在記憶裡重新流動。' },
    { keywords: ['想像', '迷惑', '抉擇'],     meaning: '七只浮於雲端的杯各藏誘惑，看清何者為真再伸手。' },
    { keywords: ['放下', '出走', '追尋'],     meaning: '轉身離開已滿卻空虛的一切，朝更深的渴望獨自啟程。' },
    { keywords: ['滿足', '如願', '享受'],     meaning: '心願如杯列陳眼前，允許自己安然享受這份豐足。' },
    { keywords: ['圓滿', '和樂', '歸屬'],     meaning: '彩虹下的情感圓滿落定，愛在所歸之處綻放成家。' },
    { keywords: ['純情', '訊息', '創意'],     meaning: '杯中躍出的魚帶來柔軟的訊息，以孩童般的心傾聽感受。' },
    { keywords: ['浪漫', '理想', '邀約'],     meaning: '一位懷抱聖杯的騎士緩緩前來，帶著一份動人的邀約。' },
    { keywords: ['溫柔', '直覺', '包容'],     meaning: '端坐海濱的王后以深情凝視內心，以慈悲映照他人。' },
    { keywords: ['包容', '平衡', '智慧'],     meaning: '於情緒之海中穩坐，以沉靜與慈悲駕馭洶湧的浪。' },
  ],
  pentacles: [
    { keywords: ['機會', '豐盛', '實現'],     meaning: '一枚金幣自掌心展開，務實的種子正等待落地生根。' },
    { keywords: ['平衡', '彈性', '兼顧'],     meaning: '在起伏之間靈巧地拋接，以從容調度有限的時間與資源。' },
    { keywords: ['協作', '技藝', '築基'],     meaning: '眾人各司其職共築殿堂，技藝因合作而臻於精緻。' },
    { keywords: ['守成', '安全', '執守'],     meaning: '緊握所擁之物以求安穩，留心別讓掌控變成囚禁。' },
    { keywords: ['困頓', '失援', '考驗'],     meaning: '風雪中行於窗外，暫時的匱乏裡，溫暖其實近在咫尺。' },
    { keywords: ['施與受', '慷慨', '公允'],   meaning: '天秤校準了給予與接受，恩惠在流動中找到平衡。' },
    { keywords: ['耐心', '等待', '檢視'],     meaning: '倚鋤凝望結實的藤蔓，耕耘已久，靜候收成的時機。' },
    { keywords: ['專注', '磨練', '用心'],     meaning: '一錘一鑿反覆雕琢，在專注的勞作中將技藝磨至純熟。' },
    { keywords: ['富足', '自立', '優雅'],     meaning: '漫步於豐收的庭園，獨力耕耘換來從容自得的優雅。' },
    { keywords: ['富足', '家業', '傳承'],     meaning: '三代同堂於豐厚的家業之中，根基穩固，福澤綿延。' },
    { keywords: ['學習', '計畫', '機會'],     meaning: '捧著金幣專注端詳的少年，懷著務實的夢願開始耕耘。' },
    { keywords: ['踏實', '耐心', '責任'],     meaning: '騎士靜立於耕地之上，以不疾不徐的步伐穩穩前行。' },
    { keywords: ['滋養', '務實', '豐裕'],     meaning: '端坐花園的王后以雙手孕育豐饒，將愛化為實在的照顧。' },
    { keywords: ['富足', '穩健', '成就'],     meaning: '安坐於豐盛王座，以踏實的智慧守護長久累積的成就。' },
  ],
  swords: [
    { keywords: ['清晰', '真相', '突破'],     meaning: '一柄寶劍劈開迷霧，思緒在此刻變得鋒利而澄明。' },
    { keywords: ['猶疑', '平衡', '抉擇'],     meaning: '蒙眼持劍坐於海前，在僵持的兩難中需卸下防備去感受。' },
    { keywords: ['傷痛', '失落', '釋放'],     meaning: '三劍穿心，唯有讓淚落下，傷口才能開始癒合。' },
    { keywords: ['休養', '沉澱', '復元'],     meaning: '暫卸征戰之劍靜臥休養，讓疲憊的心於靜默中復元。' },
    { keywords: ['紛爭', '得失', '取捨'],     meaning: '看似贏得了爭鬥，卻要靜下來思量這場勝利是否值得。' },
    { keywords: ['過渡', '遠行', '平復'],     meaning: '渡向彼岸的小舟離開動盪，朝較為平靜的水域緩行。' },
    { keywords: ['謀略', '取巧', '獨行'],     meaning: '悄然取劍而行的身影，提醒你審視暗中進行的計策。' },
    { keywords: ['束縛', '困惑', '自限'],     meaning: '被劍環繞而蒙眼束縛，捆綁你的其實是心中的恐懼。' },
    { keywords: ['憂慮', '恐懼', '失眠'],     meaning: '深夜驚坐的身影，多數的折磨來自盤旋不去的念頭。' },
    { keywords: ['終結', '谷底', '重生'],     meaning: '十劍加身的盡頭，最黑的夜過後，黎明已在地平線醞釀。' },
    { keywords: ['機敏', '求知', '警覺'],     meaning: '持劍眺望的少年充滿好奇，以敏銳的心追索真相。' },
    { keywords: ['果決', '急進', '行動'],     meaning: '策馬疾馳的騎士直衝向前，以無畏的銳氣追逐目標。' },
    { keywords: ['理智', '明辨', '坦率'],     meaning: '高舉寶劍的王后以清明洞察一切，以真誠不阿地直言。' },
    { keywords: ['理性', '公正', '決斷'],     meaning: '端坐寶座的國王以縝密的思維與公正的判斷統御全局。' },
  ],
  wands: [
    { keywords: ['靈感', '衝勁', '創始'],     meaning: '自雲端伸出的手握住萌芽的權杖，創造的火種就此點燃。' },
    { keywords: ['規劃', '抉擇', '遠見'],     meaning: '手握地球眺望遠方，立於已有的成就上謀劃更大的版圖。' },
    { keywords: ['拓展', '遠見', '進展'],     meaning: '立於高處目送揚帆的船，付出的努力正航向更廣的天地。' },
    { keywords: ['歡慶', '安定', '和諧'],     meaning: '花環高掛的門前一片喜慶，努力的成果迎來安穩的歡聚。' },
    { keywords: ['競爭', '衝突', '磨合'],     meaning: '五杖交錯的混戰，看似紛擾，實為各展所長的較量。' },
    { keywords: ['凱旋', '榮耀', '肯定'],     meaning: '戴著桂冠凱旋而歸，努力終於贏得眾人的喝采與肯定。' },
    { keywords: ['堅守', '應戰', '立場'],     meaning: '居高臨下迎戰挑戰，守住你的立場便能護住所信之事。' },
    { keywords: ['迅捷', '行動', '消息'],     meaning: '八杖如箭破空疾飛，事態正快速推進，把握這股動能。' },
    { keywords: ['堅韌', '戒備', '不屈'],     meaning: '帶傷仍緊握權杖守候，距離終點僅差最後一分堅持。' },
    { keywords: ['負重', '責任', '堅持'],     meaning: '懷抱十杖艱難前行，背負雖沉，目的地已然在望。' },
    { keywords: ['熱忱', '好奇', '冒險'],     meaning: '凝望權杖的少年滿懷熱情，準備踏上一場嶄新的冒險。' },
    { keywords: ['熱情', '冒險', '衝勁'],     meaning: '駿馬騰躍的騎士滿載熱忱，帶著無畏的勇氣奔赴遠方。' },
    { keywords: ['自信', '熱情', '魅力'],     meaning: '高坐王座的王后散發明亮的魅力，以熱情點燃身邊的人。' },
    { keywords: ['領導', '遠見', '魄力'],     meaning: '手握權杖的國王以果敢的願景領航，將熱情化為行動。' },
  ],
};

function buildSuit(suit: Suit): MinorCard[] {
  const meta = SUIT_META[suit];
  return SUIT_DATA[suit].map((card, i) => {
    const rank = i + 1;
    const nn = String(rank).padStart(2, '0');
    return {
      num: meta.base + i,
      roman: meta.symbol,
      arcana: 'minor',
      suit,
      cn: `${meta.cn}${RANK_CN[i]}`,
      en: `${RANK_EN[i]} of ${meta.en}`,
      img: `/cards/${meta.en}${nn}.png`,
      keywords: card.keywords,
      meaning: card.meaning,
    };
  });
}

export const MINOR_ARCANA: MinorCard[] = [
  ...buildSuit('cups'),
  ...buildSuit('pentacles'),
  ...buildSuit('swords'),
  ...buildSuit('wands'),
];

// 完整 78 張塔羅牌
export const TAROT_CARDS: Card[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

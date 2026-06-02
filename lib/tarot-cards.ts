export type Suit = 'cups' | 'pentacles' | 'swords' | 'wands';

interface BaseCard {
  num: number;
  roman: string;
  cn: string;
  en: string;
  img: string;
  keywords: string[];
  meaning: string;
  reversedKeywords: string[];
  reversedMeaning: string;
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
  { num: 0,   roman: '0',     arcana: 'major', cn: '愚者',       en: 'The Fool',           img: '/cards/00-TheFool.png',          keywords: ['新開始', '純粹', '冒險'],         meaning: '一場未知旅程的起點。放下顧慮，順從心中的呼喚向前躍出。',
    reversedKeywords: ['魯莽', '猶豫', '失序'],         reversedMeaning: '躍出之前先看清腳下。莫讓衝動或恐懼把單純的開始攪成混亂。' },
  { num: 1,   roman: 'I',     arcana: 'major', cn: '魔術師',     en: 'The Magician',       img: '/cards/01-TheMagician.png',      keywords: ['創造', '意志', '行動'],           meaning: '你已擁有所需的全部工具。集中意念，化想像為現實。',
    reversedKeywords: ['操弄', '空談', '渙散'],         reversedMeaning: '力量被分散或誤用。檢視動機是否誠實，別讓才華淪為虛張聲勢。' },
  { num: 2,   roman: 'II',    arcana: 'major', cn: '女祭司',     en: 'The High Priestess', img: '/cards/02-TheHighPriestess.png', keywords: ['直覺', '神秘', '潛意識'],         meaning: '答案藏在靜默裡。傾聽內在低語，勿急於以邏輯定奪。',
    reversedKeywords: ['壓抑', '失聯', '秘密'],         reversedMeaning: '你正背過身不聽內在的聲音。重新靜下來，被忽略的直覺仍在等你。' },
  { num: 3,   roman: 'III',   arcana: 'major', cn: '皇后',       en: 'The Empress',        img: '/cards/03-TheEmpress.png',       keywords: ['豐饒', '滋養', '感性'],           meaning: '創造力正豐盛地流動。允許自己被愛、被照顧、被孕育。',
    reversedKeywords: ['耗竭', '失衡', '依賴'],         reversedMeaning: '一味付出卻忘了滋養自己。先把愛留一份給己身，源頭才不致枯竭。' },
  { num: 4,   roman: 'IV',    arcana: 'major', cn: '皇帝',       en: 'The Emperor',        img: '/cards/04-TheEmperor.png',       keywords: ['秩序', '權威', '穩定'],           meaning: '以結構與紀律建立疆界。你是自己王國的主宰者。',
    reversedKeywords: ['專斷', '失控', '僵化'],         reversedMeaning: '控制過了頭便成桎梏。鬆開緊握的韁繩，柔軟也是一種力量。' },
  { num: 5,   roman: 'V',     arcana: 'major', cn: '教皇',       en: 'The Hierophant',     img: '/cards/05-TheHierophant.png',    keywords: ['傳統', '指引', '信念'],           meaning: '一位導師或既有智慧正在指引方向。傳統並非束縛，而是橋樑。',
    reversedKeywords: ['叛逆', '教條', '質疑'],         reversedMeaning: '既有的規矩已不再合身。聽從自己的信念，走出屬於你的那條路。' },
  { num: 6,   roman: 'VI',    arcana: 'major', cn: '戀人',       en: 'The Lovers',         img: '/cards/06-TheLovers.png',        keywords: ['結合', '抉擇', '和諧'],           meaning: '一場攸關心靈的選擇。誠實面對你真正想要的，便能找到契合。',
    reversedKeywords: ['失和', '猶疑', '錯位'],         reversedMeaning: '價值與渴望出現裂縫。先修補與自己的關係，外在的契合才有根基。' },
  { num: 7,   roman: 'VII',   arcana: 'major', cn: '戰車',       en: 'The Chariot',        img: '/cards/07-TheChariot.png',       keywords: ['意志', '前進', '勝利'],           meaning: '駕馭內在矛盾的兩股力量，方向已明，全速前行。',
    reversedKeywords: ['失向', '內耗', '受阻'],         reversedMeaning: '韁繩鬆脫，方向迷失。先安定相互拉扯的內在，再談前進。' },
  { num: 8,   roman: 'VIII',  arcana: 'major', cn: '力量',       en: 'Strength',           img: '/cards/08-Strength.png',         keywords: ['溫柔', '勇氣', '馴服'],           meaning: '真正的力量是以柔克剛。以慈悲，而非壓制，面對心中的猛獸。',
    reversedKeywords: ['自疑', '焦躁', '逞強'],         reversedMeaning: '勇氣一時低落，內在的猛獸顯得難以安撫。對自己溫柔些，力量會回來。' },
  { num: 9,   roman: 'IX',    arcana: 'major', cn: '隱者',       en: 'The Hermit',         img: '/cards/09-TheHermit.png',        keywords: ['內省', '獨處', '智慧'],           meaning: '退到一旁點亮自己的燈。獨處之中，將會看見方向。',
    reversedKeywords: ['孤立', '逃避', '迷失'],         reversedMeaning: '獨處過久成了避世。是時候提燈走回人群，與世界重新連結。' },
  { num: 10,  roman: 'X',     arcana: 'major', cn: '命運之輪',   en: 'Wheel of Fortune',   img: '/cards/10-WheelOfFortune.png',   keywords: ['轉變', '循環', '時機'],           meaning: '一切都在轉動。順應流動，無論起落，皆是此刻該經歷的。',
    reversedKeywords: ['停滯', '抗拒', '低潮'],         reversedMeaning: '輪子彷彿卡住，運勢走入低點。別強行扭轉，靜待時機重新轉動。' },
  { num: 11,  roman: 'XI',    arcana: 'major', cn: '正義',       en: 'Justice',            img: '/cards/11-Justice.png',          keywords: ['平衡', '真相', '因果'],           meaning: '萬事有其衡量。坦誠以對，所種之因將以恰好的方式回應你。',
    reversedKeywords: ['失衡', '推諉', '偏私'],         reversedMeaning: '天秤傾斜，責任被閃躲。坦然面對自己的那一份，公允才能恢復。' },
  { num: 12,  roman: 'XII',   arcana: 'major', cn: '吊人',       en: 'The Hanged Man',     img: '/cards/12-TheHangedMan.png',     keywords: ['暫停', '轉念', '臣服'],           meaning: '此刻不必前進。倒立過來，世界會以另一種樣貌向你顯現。',
    reversedKeywords: ['停滯', '抗拒', '徒勞'],         reversedMeaning: '困在原地卻不肯放手。該臣服的已過期，鬆開執念才能重新落地。' },
  { num: 13,  roman: 'XIII',  arcana: 'major', cn: '死神',       en: 'Death',              img: '/cards/13-Death.png',            keywords: ['終結', '蛻變', '重生'],           meaning: '某段過往正在落幕。允許它離去，新的版本才能浮現。',
    reversedKeywords: ['抗拒', '滯留', '恐變'],         reversedMeaning: '緊抓已逝去的不放，蛻變因而卡住。允許結束，新生才有空間。' },
  { num: 14,  roman: 'XIV',   arcana: 'major', cn: '節制',       en: 'Temperance',         img: '/cards/14-Temperance.png',       keywords: ['調和', '耐心', '中道'],           meaning: '不急不躁，不偏不倚。在兩極之間調出屬於你的甘露。',
    reversedKeywords: ['失衡', '過度', '失耐'],         reversedMeaning: '節奏亂了，不是過猶就是不及。回到中道，重新校準你的步調。' },
  { num: 15,  roman: 'XV',    arcana: 'major', cn: '惡魔',       en: 'The Devil',          img: '/cards/15-TheDevil.png',         keywords: ['執著', '陰影', '誘惑'],           meaning: '看清你自願戴上的鎖鏈。承認它，便能解開它。',
    reversedKeywords: ['鬆綁', '覺醒', '掙脫'],         reversedMeaning: '你已看清那條鎖鏈其實鬆動。鼓起勇氣，是時候掙脫成癮與恐懼。' },
  { num: 16,  roman: 'XVI',   arcana: 'major', cn: '高塔',       en: 'The Tower',          img: '/cards/16-TheTower.png',         keywords: ['突變', '崩解', '覺醒'],           meaning: '一場必要的瓦解。虛構的塔倒下，真實的地基才會顯露。',
    reversedKeywords: ['延遲', '逃避', '餘震'],         reversedMeaning: '崩塌被你勉力撐住，卻只是延後。與其硬扛，不如主動拆下虛假的牆。' },
  { num: 17,  roman: 'XVII',  arcana: 'major', cn: '星星',       en: 'The Star',           img: '/cards/17-TheStar.png',          keywords: ['希望', '療癒', '靈感'],           meaning: '風暴之後，一顆星在指引你。相信宇宙仍在你這一邊。',
    reversedKeywords: ['失望', '自疑', '枯竭'],         reversedMeaning: '希望之光一時黯淡，信心動搖。星仍在天上，先溫柔地修復內在。' },
  { num: 18,  roman: 'XVIII', arcana: 'major', cn: '月亮',       en: 'The Moon',           img: '/cards/18-TheMoon.png',          keywords: ['幻象', '潛意識', '迷霧'],         meaning: '事物未必如其所現。穿越迷霧需要直覺，而非眼睛。',
    reversedKeywords: ['澄清', '釋疑', '退潮'],         reversedMeaning: '迷霧正在散去，混亂逐漸明朗。被壓抑的恐懼浮現，正好趁此看清。' },
  { num: 19,  roman: 'XIX',   arcana: 'major', cn: '太陽',       en: 'The Sun',            img: '/cards/19-TheSun.png',           keywords: ['喜悅', '豐盛', '澄明'],           meaning: '光照耀著你。允許自己被看見、被慶祝、被溫暖。',
    reversedKeywords: ['烏雲', '低落', '遮蔽'],         reversedMeaning: '陽光暫時被雲遮住，喜悅來得勉強。光並未消失，耐心等它再透出。' },
  { num: 20,  roman: 'XX',    arcana: 'major', cn: '審判',       en: 'Judgement',          img: '/cards/20-Judgement.png',        keywords: ['召喚', '寬恕', '覺醒'],           meaning: '一個更高的呼喚正在響起。寬恕過去的自己，回應它。',
    reversedKeywords: ['自責', '遲疑', '逃避'],         reversedMeaning: '困在悔恨裡，聽不見召喚。先寬恕自己，才有勇氣回應那聲呼喚。' },
  { num: 21,  roman: 'XXI',   arcana: 'major', cn: '世界',       en: 'The World',          img: '/cards/21-TheWorld.png',         keywords: ['完成', '圓滿', '整合'],           meaning: '一個循環圓滿收束。你已抵達，並準備好下一場啟程。',
    reversedKeywords: ['未竟', '滯礙', '收尾'],         reversedMeaning: '終點近在眼前卻遲遲未抵。補上欠缺的最後一步，循環才能真正圓滿。' },
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
  reversedKeywords: string[];
  reversedMeaning: string;
}

// 每套花色 14 張的關鍵字與牌義（依牌序排列）
const SUIT_DATA: Record<Suit, SuitCardData[]> = {
  cups: [
    { keywords: ['新感情', '豐盈', '直覺'],   meaning: '一只滿溢的杯自天而降，讓心重新被愛與靈感注滿。',
      reversedKeywords: ['空虛', '壓抑', '錯失'],   reversedMeaning: '杯傾水盡，情感一時乾涸。先安撫被忽略的心，泉湧才會回來。' },
    { keywords: ['連結', '互愛', '契合'],     meaning: '兩顆心舉杯相映，一段相互滋養的關係正在締結。',
      reversedKeywords: ['失衡', '誤解', '疏離'],   reversedMeaning: '兩杯之間出現裂痕。坦誠溝通，別讓小小的誤解擴成隔閡。' },
    { keywords: ['歡聚', '友誼', '慶賀'],     meaning: '與所愛之人舉杯共舞，喜悅因分享而加倍。',
      reversedKeywords: ['縱樂', '空洞', '倦怠'],   reversedMeaning: '熱鬧過後反覺空虛。歡聚雖好，仍需回到能真正滋養你的關係。' },
    { keywords: ['倦怠', '內省', '錯失'],     meaning: '沉浸於不滿足之中，別讓眼前遞來的恩典悄悄溜走。',
      reversedKeywords: ['醒覺', '接納', '轉機'],   reversedMeaning: '長久的倦怠正要鬆動。抬起頭，你終於願意接住那份遞來的恩典。' },
    { keywords: ['悲傷', '失望', '釋懷'],     meaning: '為傾倒的杯哀傷之餘，回頭仍有兩只盈滿等你拾起。',
      reversedKeywords: ['療癒', '接受', '前行'],   reversedMeaning: '淚已流盡，傷口開始癒合。轉身拾起餘下的盈滿，重新向前。' },
    { keywords: ['回憶', '童心', '重逢'],     meaning: '往日的甜美輕叩心門，純真與善意在記憶裡重新流動。',
      reversedKeywords: ['沉溺', '停滯', '放下'],   reversedMeaning: '困在舊日的美好裡不肯醒。緬懷有時，仍要把腳步交還給此刻。' },
    { keywords: ['想像', '迷惑', '抉擇'],     meaning: '七只浮於雲端的杯各藏誘惑，看清何者為真再伸手。',
      reversedKeywords: ['釐清', '取捨', '務實'],   reversedMeaning: '幻影散去，選項終於清晰。捨下浮華的誘惑，挑那只真實的杯。' },
    { keywords: ['放下', '出走', '追尋'],     meaning: '轉身離開已滿卻空虛的一切，朝更深的渴望獨自啟程。',
      reversedKeywords: ['徘徊', '不捨', '逃避'],   reversedMeaning: '想走又頻頻回頭。先看清你是奔向渴望，還是只想逃離眼前。' },
    { keywords: ['滿足', '如願', '享受'],     meaning: '心願如杯列陳眼前，允許自己安然享受這份豐足。',
      reversedKeywords: ['空乏', '貪求', '失落'],   reversedMeaning: '擁有了卻仍不滿足。問問自己真正渴望的，是否被表面的圓滿掩蓋。' },
    { keywords: ['圓滿', '和樂', '歸屬'],     meaning: '彩虹下的情感圓滿落定，愛在所歸之處綻放成家。',
      reversedKeywords: ['失和', '裂痕', '勉強'],   reversedMeaning: '看似圓滿的表面下藏著裂縫。正視被掩蓋的不和，幸福才不致虛空。' },
    { keywords: ['純情', '訊息', '創意'],     meaning: '杯中躍出的魚帶來柔軟的訊息，以孩童般的心傾聽感受。',
      reversedKeywords: ['情緒化', '幼稚', '逃避'],   reversedMeaning: '情緒淹過了理智，反應變得任性。先安頓內在的小孩，再回應世界。' },
    { keywords: ['浪漫', '理想', '邀約'],     meaning: '一位懷抱聖杯的騎士緩緩前來，帶著一份動人的邀約。',
      reversedKeywords: ['虛幻', '善變', '失信'],   reversedMeaning: '動聽的承諾未必落地。看清是真心邀約，還是只是一場浪漫的空想。' },
    { keywords: ['溫柔', '直覺', '包容'],     meaning: '端坐海濱的王后以深情凝視內心，以慈悲映照他人。',
      reversedKeywords: ['失界', '討好', '耗竭'],   reversedMeaning: '一味包容到失了界線。慈悲也需邊界，別把自己的杯付到見底。' },
    { keywords: ['包容', '平衡', '智慧'],     meaning: '於情緒之海中穩坐，以沉靜與慈悲駕馭洶湧的浪。',
      reversedKeywords: ['壓抑', '失衡', '操控'],   reversedMeaning: '表面平靜，底下情緒暗湧。誠實面對自己的感受，沉穩才不是壓抑。' },
  ],
  pentacles: [
    { keywords: ['機會', '豐盛', '實現'],     meaning: '一枚金幣自掌心展開，務實的種子正等待落地生根。',
      reversedKeywords: ['錯失', '空想', '延遲'],   reversedMeaning: '機會擺在眼前卻遲遲未握。別只在心裡盤算，落地耕耘才有收成。' },
    { keywords: ['平衡', '彈性', '兼顧'],     meaning: '在起伏之間靈巧地拋接，以從容調度有限的時間與資源。',
      reversedKeywords: ['失衡', '分身乏術', '混亂'],   reversedMeaning: '同時拋接太多顆球，快要失手。先放下一兩件，才接得穩餘下的。' },
    { keywords: ['協作', '技藝', '築基'],     meaning: '眾人各司其職共築殿堂，技藝因合作而臻於精緻。',
      reversedKeywords: ['失調', '各行其是', '草率'],   reversedMeaning: '分工亂了套，品質開始鬆動。重新對齊彼此的步調，根基才穩。' },
    { keywords: ['守成', '安全', '執守'],     meaning: '緊握所擁之物以求安穩，留心別讓掌控變成囚禁。',
      reversedKeywords: ['鬆綁', '匱乏感', '放手'],   reversedMeaning: '抓得太緊反成牢籠。鬆開對安全的執著，流動才能帶來真正的富足。' },
    { keywords: ['困頓', '失援', '考驗'],     meaning: '風雪中行於窗外，暫時的匱乏裡，溫暖其實近在咫尺。',
      reversedKeywords: ['復原', '轉機', '求援'],   reversedMeaning: '寒冬將盡，援手已在門內。放下硬撐的自尊，溫暖正等你推門。' },
    { keywords: ['施與受', '慷慨', '公允'],   meaning: '天秤校準了給予與接受，恩惠在流動中找到平衡。',
      reversedKeywords: ['失衡', '附帶條件', '虧欠'],   reversedMeaning: '給予與接受失了衡，恩惠變成負擔。釐清付出背後是否藏著條件。' },
    { keywords: ['耐心', '等待', '檢視'],     meaning: '倚鋤凝望結實的藤蔓，耕耘已久，靜候收成的時機。',
      reversedKeywords: ['急躁', '懷疑', '徒勞感'],   reversedMeaning: '等得太久而生焦躁，懷疑努力是否白費。再撐一會，根正在土裡。' },
    { keywords: ['專注', '磨練', '用心'],     meaning: '一錘一鑿反覆雕琢，在專注的勞作中將技藝磨至純熟。',
      reversedKeywords: ['完美主義', '倦怠', '失焦'],   reversedMeaning: '過度雕琢反而困住自己。容許不完美，技藝才不被執著拖垮。' },
    { keywords: ['富足', '自立', '優雅'],     meaning: '漫步於豐收的庭園，獨力耕耘換來從容自得的優雅。',
      reversedKeywords: ['孤立', '物質至上', '空虛'],   reversedMeaning: '富足卻顯孤單。在獨立自得之餘，別讓圍牆把溫暖的人也擋在外面。' },
    { keywords: ['富足', '家業', '傳承'],     meaning: '三代同堂於豐厚的家業之中，根基穩固，福澤綿延。',
      reversedKeywords: ['動盪', '價值衝突', '負擔'],   reversedMeaning: '家業或傳統成了沉重的包袱。釐清何者該守、何者該放下。' },
    { keywords: ['學習', '計畫', '機會'],     meaning: '捧著金幣專注端詳的少年，懷著務實的夢願開始耕耘。',
      reversedKeywords: ['分心', '半途', '空談'],   reversedMeaning: '夢想停在計畫裡遲遲不動。收回飄走的心，踏出務實的第一步。' },
    { keywords: ['踏實', '耐心', '責任'],     meaning: '騎士靜立於耕地之上，以不疾不徐的步伐穩穩前行。',
      reversedKeywords: ['停滯', '固執', '無趣'],   reversedMeaning: '穩到近乎停滯，步伐僵在原地。在踏實之中，也為自己留一點彈性。' },
    { keywords: ['滋養', '務實', '豐裕'],     meaning: '端坐花園的王后以雙手孕育豐饒，將愛化為實在的照顧。',
      reversedKeywords: ['失衡', '忽略自身', '物質依賴'],   reversedMeaning: '照顧四方卻冷落了自己。先把這份滋養留一份給己身。' },
    { keywords: ['富足', '穩健', '成就'],     meaning: '安坐於豐盛王座，以踏實的智慧守護長久累積的成就。',
      reversedKeywords: ['貪婪', '固守', '僵化'],   reversedMeaning: '富足之上若只剩守財，便成枷鎖。讓累積的智慧重新流動起來。' },
  ],
  swords: [
    { keywords: ['清晰', '真相', '突破'],     meaning: '一柄寶劍劈開迷霧，思緒在此刻變得鋒利而澄明。',
      reversedKeywords: ['混亂', '誤判', '受阻'],   reversedMeaning: '思緒蒙塵，劍鋒一時失準。先讓心安靜下來，澄明才會回來。' },
    { keywords: ['猶疑', '平衡', '抉擇'],     meaning: '蒙眼持劍坐於海前，在僵持的兩難中需卸下防備去感受。',
      reversedKeywords: ['鬆動', '面對', '抉擇'],   reversedMeaning: '蒙眼的布快要取下，僵局終於鬆動。鼓起勇氣，做出那個決定。' },
    { keywords: ['傷痛', '失落', '釋放'],     meaning: '三劍穿心，唯有讓淚落下，傷口才能開始癒合。',
      reversedKeywords: ['癒合', '寬恕', '走出'],   reversedMeaning: '劍正一柄柄被拔出，痛楚漸退。原諒過往，心才能重新閉合。' },
    { keywords: ['休養', '沉澱', '復元'],     meaning: '暫卸征戰之劍靜臥休養，讓疲憊的心於靜默中復元。',
      reversedKeywords: ['復出', '躁動', '倦怠'],   reversedMeaning: '休養將盡，是時候重返。但別操之過急，確認自己真的復原了。' },
    { keywords: ['紛爭', '得失', '取捨'],     meaning: '看似贏得了爭鬥，卻要靜下來思量這場勝利是否值得。',
      reversedKeywords: ['和解', '釋懷', '餘怨'],   reversedMeaning: '爭鬥終於落幕，恩怨可以放下。也可能心結未解，仍在暗自較勁。' },
    { keywords: ['過渡', '遠行', '平復'],     meaning: '渡向彼岸的小舟離開動盪，朝較為平靜的水域緩行。',
      reversedKeywords: ['滯留', '抗拒', '反覆'],   reversedMeaning: '想走卻一再被牽回原地。看清是什麼讓你遲遲不肯渡向彼岸。' },
    { keywords: ['謀略', '取巧', '獨行'],     meaning: '悄然取劍而行的身影，提醒你審視暗中進行的計策。',
      reversedKeywords: ['坦白', '識破', '收手'],   reversedMeaning: '暗中的盤算快被看穿，或良心開始不安。回到光明處，誠實以對。' },
    { keywords: ['束縛', '困惑', '自限'],     meaning: '被劍環繞而蒙眼束縛，捆綁你的其實是心中的恐懼。',
      reversedKeywords: ['鬆綁', '覺醒', '自由'],   reversedMeaning: '蒙眼鬆開，你看清束縛多半是自設。踏出那一步，並不如想像危險。' },
    { keywords: ['憂慮', '恐懼', '失眠'],     meaning: '深夜驚坐的身影，多數的折磨來自盤旋不去的念頭。',
      reversedKeywords: ['釋放', '黎明', '走出'],   reversedMeaning: '漫漫長夜將盡，焦慮逐漸鬆手。把盤旋的念頭說出口，天就亮了。' },
    { keywords: ['終結', '谷底', '重生'],     meaning: '十劍加身的盡頭，最黑的夜過後，黎明已在地平線醞釀。',
      reversedKeywords: ['復甦', '回升', '餘痛'],   reversedMeaning: '最壞的已成過去，正緩緩回升。別讓殘留的恐懼把你又拉回谷底。' },
    { keywords: ['機敏', '求知', '警覺'],     meaning: '持劍眺望的少年充滿好奇，以敏銳的心追索真相。',
      reversedKeywords: ['多疑', '碎念', '窺探'],   reversedMeaning: '敏銳走過頭成了多疑。收起刺探的目光，別讓警覺變成猜忌。' },
    { keywords: ['果決', '急進', '行動'],     meaning: '策馬疾馳的騎士直衝向前，以無畏的銳氣追逐目標。',
      reversedKeywords: ['魯莽', '失控', '草率'],   reversedMeaning: '衝得太快，已近失控。勒住韁繩，銳氣需要方向才不致莽撞。' },
    { keywords: ['理智', '明辨', '坦率'],     meaning: '高舉寶劍的王后以清明洞察一切，以真誠不阿地直言。',
      reversedKeywords: ['冷峻', '苛刻', '孤傲'],   reversedMeaning: '理智過了頭便顯冷硬。讓溫度回到言語裡，明辨不必傷人。' },
    { keywords: ['理性', '公正', '決斷'],     meaning: '端坐寶座的國王以縝密的思維與公正的判斷統御全局。',
      reversedKeywords: ['專斷', '濫權', '冷酷'],   reversedMeaning: '理性若失了慈悲便成獨裁。讓判斷裡多一分人情，權威才服人。' },
  ],
  wands: [
    { keywords: ['靈感', '衝勁', '創始'],     meaning: '自雲端伸出的手握住萌芽的權杖，創造的火種就此點燃。',
      reversedKeywords: ['延宕', '熄火', '猶豫'],   reversedMeaning: '火種點了又滅，動力卡在起點。別等萬全，先讓第一步燒起來。' },
    { keywords: ['規劃', '抉擇', '遠見'],     meaning: '手握地球眺望遠方，立於已有的成就上謀劃更大的版圖。',
      reversedKeywords: ['遲疑', '畏縮', '短視'],   reversedMeaning: '站在原地遲遲不敢拓展。看清是謹慎，還是恐懼讓你停在舒適圈。' },
    { keywords: ['拓展', '遠見', '進展'],     meaning: '立於高處目送揚帆的船，付出的努力正航向更廣的天地。',
      reversedKeywords: ['延誤', '受阻', '失耐'],   reversedMeaning: '船遲遲未歸，進展不如預期。延誤難免，別讓焦躁亂了你的航向。' },
    { keywords: ['歡慶', '安定', '和諧'],     meaning: '花環高掛的門前一片喜慶，努力的成果迎來安穩的歡聚。',
      reversedKeywords: ['失序', '不安', '勉強'],   reversedMeaning: '歡慶的表面下根基未穩。先把鬆動的地基補實，喜悅才坐得住。' },
    { keywords: ['競爭', '衝突', '磨合'],     meaning: '五杖交錯的混戰，看似紛擾，實為各展所長的較量。',
      reversedKeywords: ['平息', '內耗', '迴避'],   reversedMeaning: '混戰或將平息，或淪為無謂的內耗。把力氣用在前進，而非纏鬥。' },
    { keywords: ['凱旋', '榮耀', '肯定'],     meaning: '戴著桂冠凱旋而歸，努力終於贏得眾人的喝采與肯定。',
      reversedKeywords: ['壓力', '自疑', '失勢'],   reversedMeaning: '高處不勝寒，掌聲也成壓力。記得你為何出發，別被外界的眼光綁架。' },
    { keywords: ['堅守', '應戰', '立場'],     meaning: '居高臨下迎戰挑戰，守住你的立場便能護住所信之事。',
      reversedKeywords: ['潰守', '疲於應付', '退讓'],   reversedMeaning: '防線快要撐不住，四面受敵。分清哪些值得死守，哪些不妨放手。' },
    { keywords: ['迅捷', '行動', '消息'],     meaning: '八杖如箭破空疾飛，事態正快速推進，把握這股動能。',
      reversedKeywords: ['延宕', '失速', '亂序'],   reversedMeaning: '箭勢忽然失速，節奏被打亂。讓飛行中的事務重新對齊次序。' },
    { keywords: ['堅韌', '戒備', '不屈'],     meaning: '帶傷仍緊握權杖守候，距離終點僅差最後一分堅持。',
      reversedKeywords: ['力竭', '防備過度', '撐不住'],   reversedMeaning: '撐到力竭，戒備成了消耗。允許自己求援，獨木難撐到最後。' },
    { keywords: ['負重', '責任', '堅持'],     meaning: '懷抱十杖艱難前行，背負雖沉，目的地已然在望。',
      reversedKeywords: ['過載', '放下', '卸責'],   reversedMeaning: '十杖壓得喘不過氣。是時候分擔或放下幾根，別把所有重量都攬上身。' },
    { keywords: ['熱忱', '好奇', '冒險'],     meaning: '凝望權杖的少年滿懷熱情，準備踏上一場嶄新的冒險。',
      reversedKeywords: ['三分鐘熱度', '浮躁', '無方向'],   reversedMeaning: '熱情來得快也去得快。先找到值得投入的方向，火才燒得久。' },
    { keywords: ['熱情', '冒險', '衝勁'],     meaning: '駿馬騰躍的騎士滿載熱忱，帶著無畏的勇氣奔赴遠方。',
      reversedKeywords: ['橫衝', '善變', '受挫'],   reversedMeaning: '橫衝直撞而頻頻碰壁。把奔放的衝勁收束成方向，才不致空轉。' },
    { keywords: ['自信', '熱情', '魅力'],     meaning: '高坐王座的王后散發明亮的魅力，以熱情點燃身邊的人。',
      reversedKeywords: ['逞強', '善妒', '焦慮'],   reversedMeaning: '光芒底下藏著不安，怕被比下去。回到自己的中心，魅力本不需證明。' },
    { keywords: ['領導', '遠見', '魄力'],     meaning: '手握權杖的國王以果敢的願景領航，將熱情化為行動。',
      reversedKeywords: ['獨斷', '急躁', '高壓'],   reversedMeaning: '果敢若失了傾聽便成獨裁。放慢一拍，願景需要眾人同行才走得遠。' },
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
      reversedKeywords: card.reversedKeywords,
      reversedMeaning: card.reversedMeaning,
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

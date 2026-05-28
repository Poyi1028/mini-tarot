import Anthropic from '@anthropic-ai/sdk';

const POSITIONS = ['過 去', '現 在', '未 來'];

export async function POST(request) {
  try {
    const { question, cards } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ reading: null });
    }

    const client = new Anthropic({ apiKey });

    const cardList = cards
      .map(
        (c, i) =>
          `${POSITIONS[i]}：${c.cn}（${c.keywords.join('、')}）— ${c.meaning}`
      )
      .join('\n');

    const prompt = `你是一位語氣沉靜、富有神祕學涵養的塔羅占卜師。請以繁體中文回應，使用優雅、詩意但具體的口吻，避免老套或浮誇用語。

提問者的疑問：「${question}」

抽出的三張牌（聖三角：過去-現在-未來）：
${cardList}

請用 4 至 6 句話，串連三張牌與這個提問，給出一段流暢、有指引意義的整體解讀。不要逐張條列，不要使用 markdown 標題或項目符號，只給一段散文。語句之間以全形句號或換行分隔。直接給解讀，不要前言。`;

    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const reading =
      message.content[0]?.type === 'text' ? message.content[0].text : null;
    return Response.json({ reading: reading?.trim() ?? null });
  } catch (e) {
    console.error('Reading API error:', e);
    return Response.json({ reading: null });
  }
}

// pages/api/emoji.js
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const REST_API_SYSTEM_PROMPT = `以下の文章を一文字の絵文字に変換して以下のJSON形式で出力してください。
# 条件
* 候補をいくつか提案してください。
* それ以外のテキストは何も出力しないでください。\n

# JSON形式
\`\`\`json
[{
  "emoji": "👍",
  "name": "thumbs up",
  "reason": "候補として選定した理由を設定してください",
}]
\`\`\`

# 絵文字に変換する文章
`;

async function getEmojis(prompt) {
  console.debug(prompt);
  const response =  await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {role: 'user', content: REST_API_SYSTEM_PROMPT + prompt},
    ],
    temperature: 0,
  });
  const completion = response?.data?.choices[0]?.message?.content;
  console.debug(completion);
  return JSON.parse(completion.trim());
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const prompt = req.query.prompt;
    try {
      const emojis = await getEmojis(prompt);
      res.status(200).json({ emojis });
    } catch (e) {
      console.error(e?.response?.data || e);
      res.status(404).json(e?.response?.data || { message: 'Not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

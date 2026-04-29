import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
if (!DEEPSEEK_API_KEY) {
  console.error('错误: 请设置环境变量 DEEPSEEK_API_KEY')
  process.exit(1)
}
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const SYSTEM_PROMPT = `你是一位专业、耐心的AI医疗问诊助手。请遵循以下原则：

1. 首先声明你是AI助手，不能替代专业医生诊断
2. 基于用户描述的症状，进行系统性的问诊分析
3. 提供可能的病因分析和建议
4. 建议必要的检查项目
5. 给出生活调理和饮食建议
6. 如果症状严重，提醒用户及时就医
7. 用温暖、专业、易懂的中文回答
8. 回答结构清晰，分点列出`

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '缺少 messages 参数' })
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答，请稍后再试。'

    res.json({ reply })
  } catch (err) {
    console.error('API 请求失败:', err)
    res.status(500).json({ error: '服务器请求失败，请检查网络连接' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`后端服务已启动: http://localhost:${PORT}`)
})

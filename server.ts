import express, { Request, Response } from 'express'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY as string,
})

app.use(express.json())

app.post('/chat', async (req: Request, res: Response) => {
  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
    })

    const aiResponse = response.choices[0].message.content
    res.json({ response: aiResponse })
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    res.status(500).json({ error: 'Failed to fetch AI response' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

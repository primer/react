import OpenAI from 'openai'
import type {Config} from './config'
import {SYSTEM_PROMPT, buildUserPrompt} from './prompts'
import {retrieveContext, formatContext} from './knowledge'

let client: OpenAI | null = null

function getClient(config: Config): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiBaseUrl,
    })
  }
  return client
}

export interface AskResult {
  answer: string
  model: string
  componentsMentioned: string[]
}

export async function ask(question: string, config: Config): Promise<AskResult> {
  const openai = getClient(config)

  // Retrieve relevant context from MCP data layer
  const context = await retrieveContext(question)
  const formattedContext = formatContext(context)

  const completion = await openai.chat.completions.create({
    model: config.model,
    temperature: 0.3,
    // eslint-disable-next-line camelcase
    max_tokens: 1500,
    messages: [
      {role: 'system', content: SYSTEM_PROMPT},
      {role: 'user', content: buildUserPrompt(question, formattedContext)},
    ],
  })

  const answer = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response."

  return {
    answer,
    model: completion.model,
    componentsMentioned: context.componentDocs.map(c => c.name),
  }
}

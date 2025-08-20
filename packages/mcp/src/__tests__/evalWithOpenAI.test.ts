import 'dotenv/config'
import {OpenAI} from 'openai'
import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js'

const GPT_MODEL = 'gpt-5'

export class PrimerMcpClient {
  private static instance: PrimerMcpClient | null = null
  private transport: StdioClientTransport
  private client: Client

  private constructor() {
    this.transport = new StdioClientTransport({
      command: 'tsx',
      args: ['src/transports/stdio.ts'],
    })

    this.client = new Client(
      {
        name: 'test-primer-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      },
    )
  }

  static async getInstance(): Promise<PrimerMcpClient> {
    if (!PrimerMcpClient.instance) {
      PrimerMcpClient.instance = new PrimerMcpClient()
      await PrimerMcpClient.instance.client.connect(PrimerMcpClient.instance.transport)
    }
    return PrimerMcpClient.instance
  }

  async listTools() {
    return await this.client.listTools()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async callTool({name, args}: {name: string; args: any}) {
    return await this.client.callTool({name, arguments: args})
  }

  getClient() {
    return this.client
  }

  /** Gracefully disconnect transport/client and reset singleton */
  async teardown() {
    await this.client.close()

    PrimerMcpClient.instance = null
  }
}

const mcp = await PrimerMcpClient.getInstance()
const openai = new OpenAI({apiKey: process.env.OPEN_AI_KEY})

async function runMcpOpenAiWithPrompt(prompt: string) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const {tools} = await mcp.listTools()
  const toolUsage: Record<string, number> = {}
  let aiResponse: string | null = null

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const openAITools = tools.map((tool: any) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }))

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const messages: any[] = [{role: 'user', content: prompt}]

  // Initial OpenAI completion
  const completion = await openai.chat.completions.create({
    model: GPT_MODEL,
    messages,
    tools: openAITools,
    // eslint-disable-next-line camelcase
    tool_choice: 'auto',
  })

  // Handle tool calls if present
  const choice = completion.choices[0]

  if (choice.finish_reason === 'tool_calls') {
    messages.push({
      role: 'assistant',
      content: choice.message.content ?? '',
      refusal: choice.message.refusal ?? '',
      // eslint-disable-next-line camelcase
      tool_calls: choice.message.tool_calls ?? [],
    })
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const toolCalls: any = choice.message.tool_calls || []
    for (const toolCall of toolCalls) {
      const tool = toolCall.function
      if (tool && tool.name && tool.arguments) {
        toolUsage[tool.name] = (toolUsage[tool.name] || 0) + 1
        const toolResult = await mcp.callTool({
          name: tool.name,
          args: JSON.parse(tool.arguments),
        })
        messages.push({
          role: 'tool',
          // eslint-disable-next-line camelcase
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        })
      }
    }

    const finalResponse = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages,
    })

    aiResponse = finalResponse.choices[0].message.content
  } else {
    // Handle non-tool call response
    aiResponse = choice.message.content
  }

  return {
    toolUsage,
    aiResponse,
  }
}

// Function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  return dotProduct / (magA * magB)
}

// Function to get embedding for a text
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002', // Or your preferred embedding model
    input: text,
  })
  return response.data[0].embedding
}

const CONCURRENCY_COUNT = 3
const SIMILARITY_THRESHOLD = 0.8 // Adjust this threshold as needed

const getStats = async (prompt: string, expectedOutput: string) => {
  const runs = await Promise.all(Array.from({length: CONCURRENCY_COUNT}, () => runMcpOpenAiWithPrompt(prompt)))

  console.log(`Ran ${CONCURRENCY_COUNT} concurrent runs with the prompt: "${prompt}"`)
  console.log(runs)

  const {tools} = await mcp.listTools()

  const toolCounts: Record<string, number> = tools.reduce(
    (acc, tool: {name: string}) => {
      acc[tool.name] = 0
      return acc
    },
    {} as Record<string, number>,
  )

  for (const tool of Object.keys(toolCounts)) {
    for (const {toolUsage} of runs) {
      toolCounts[tool] += toolUsage[tool] ? 1 : 0
    }
  }

  const totalRuns = runs.length

  // Compare output
  const expected = await getEmbedding(expectedOutput)

  // Calculate cosine similarity for each run's embedding against the expected embedding
  const similarities = await Promise.all(
    runs.map(async run => {
      const actual = await getEmbedding(run.aiResponse ?? '')
      return cosineSimilarity(actual, expected)
    }),
  )

  const avgSimilarity = similarities.reduce((sum, score) => sum + score, 0) / similarities.length
  console.log('Average similarity:', avgSimilarity)

  const toolUsagePercentages = Object.entries(toolCounts).map(([tool, count]) => {
    const percent = ((count / totalRuns) * 100).toFixed(2)
    return {[tool]: `${percent}%`}
  })

  return {
    meetsSimilarityThreshold: avgSimilarity >= SIMILARITY_THRESHOLD,
    toolUsagePercentages,
  }
}

const prompt = `Only output code. Create a Primer Button that will be used to confirm deleting content.`
const expectedOutput = `<Button variant="danger">Cancel</Button>`

const stats = await getStats(prompt, expectedOutput)

console.log(stats)

await mcp.teardown()

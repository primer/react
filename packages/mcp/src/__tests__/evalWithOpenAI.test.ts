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

export async function runMcpOpenAiWithPrompt(prompt: string) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const {tools} = await mcp.listTools()
  const openai = new OpenAI({apiKey: process.env.OPEN_AI_KEY})
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

const concurrencyCount = 3

const getToolUsageStats = async (prompt: string) => {
  const runs = await Promise.all(Array.from({length: concurrencyCount}, () => runMcpOpenAiWithPrompt(prompt)))

  console.log(`Ran ${concurrencyCount} concurrent runs with the prompt: "${prompt}"`)
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
  console.log(toolCounts)
  return Object.entries(toolCounts).map(([tool, count]) => {
    const percent = ((count / totalRuns) * 100).toFixed(2)
    // return record string
    return {[tool]: `${percent}%`}
  })
}

const prompt = `Only output code. Create a Primer Button to be used to press cancel in a confirmation dialog.`

// const promompt = 'What is the best way to fix this Primer Component which is causing an Axe scanning violation `<Link href={labelLink} muted><CircleOcticon icon={CalendarIcon} size={32} /></Link>`?';

// const prompt = `An accessibility scan flagged buttons must have discernible text. Here's the code in question:
//   import {ActionList} from '@primer/react'
//    <ActionList.Item aria-disabled="true">
//     <div
//       className="position-absolute height-full width-full top-0 left-0 d-flex flex-justify-center flex-items-center border rounded-2"
//       style={{backgroundColor: 'var(--brand-color-canvas-default)', color: 'var(--brand-color-success-fg)'}}
//     >
//       {props.children}
//     </div>
//   </ActionList.Item>
//   Please provide code snippets to fix this issue.`;

const stats = await getToolUsageStats(prompt)

console.log(stats)

// Test that the aiResponse contains a button with variant danger
// if (!aiResponse?.includes('Button') || !aiResponse.includes('variant="danger"')) {
//   console.log('AI response does not contain a Primer Button with variant danger')
// }

// This type of testing would need to run concurrently and each test would need to run multiple times to gather meaningful data.
// This is because the AI's responses can be non-deterministic, and a single run might not capture the full range of behaviors.
// I think we would likely want to gather the frequency of specific tool usage and output patterns to better understand the AI's behavior.
// Playing around with testing ideas...
// - We can test how often specific tools are used in response to certain prompts
//   - We would likely need to measure by the frequency (or percent) instead of pass / fail
// - We can test specific output
//   - this might be more brittle
//   - would require setting a passing threshold
await mcp.teardown()

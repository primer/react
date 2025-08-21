import 'dotenv/config'
import {PrimerMcpClient} from './utils/PrimerMCPClient'
import {OpenAIClient} from './utils/OpenAIClient'

const CONCURRENCY_COUNT = 3
const SIMILARITY_THRESHOLD = 0.8

const openaiClient = new OpenAIClient(process.env.OPEN_AI_KEY!)
const mcp = await PrimerMcpClient.getInstance()

type ToolUsage = Record<string, number>

/**
 * Executes a prompt against OpenAI with access to Primer's MCP tools, handles tool calls, and returns the AI response and tool usage stats.
 * @param prompt - The prompt string to send to OpenAI.
 * @returns An object containing tool usage counts and the AI's response text.
 */
async function runMcpOpenAiWithPrompt(prompt: string): Promise<{toolUsage: ToolUsage; aiResponse: string | null}> {
  const {tools} = await mcp.listTools()
  const toolUsage: ToolUsage = {}

  const openAITools = tools.map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [{role: 'user', content: prompt}]
  const completion = await openaiClient.chat(messages, openAITools)

  const choice = completion.choices[0]
  let aiResponse: string | null = null

  if (choice.finish_reason === 'tool_calls') {
    messages.push({
      role: 'assistant',
      content: choice.message.content ?? '',
      refusal: choice.message.refusal ?? '',
      // eslint-disable-next-line camelcase
      tool_calls: choice.message.tool_calls ?? [],
    })

    const toolCalls = choice.message.tool_calls || []
    for (const toolCall of toolCalls) {
      const tool = (toolCall as {function?: {name: string; arguments: string}}).function
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

    const finalResponse = await openaiClient.chat(messages)
    aiResponse = finalResponse.choices[0].message.content
  } else {
    aiResponse = choice.message.content
  }

  return {toolUsage, aiResponse}
}

/**
 * Calculates the cosine similarity between two numeric vectors.
 * This metric is used to determine how similar the AI's response is to the expected output by comparing their vector embeddings.
 * @param a - First vector.
 * @param b - Second vector.
 * @returns The cosine similarity score (between -1 and 1).
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  return dotProduct / (magA * magB)
}

/**
 * Runs multiple parallel tests of a prompt against MCP, compares AI output to the expected result using embeddings and cosine similarity,
 * and summarizes the percentage of runs that used each MCP tool.
 * @param prompt - The prompt to test.
 * @param expectedOutput - The expected output text for comparison.
 * @returns Object summarizing whether average similarity meets the threshold and tool usage percentages.
 */
export async function analyzePrimerMcpAgainstOpenAI(prompt: string, expectedOutput: string) {
  const runs = await Promise.all(Array.from({length: CONCURRENCY_COUNT}, () => runMcpOpenAiWithPrompt(prompt)))
  /* eslint-disable-next-line no-console */
  console.log(`Ran ${CONCURRENCY_COUNT} concurrent runs with the prompt: "${prompt}"`)

  /* eslint-disable-next-line no-console */
  console.log(runs)

  const {tools} = await mcp.listTools()
  const toolCounts: ToolUsage = Object.fromEntries(tools.map(tool => [tool.name, 0]))

  for (const tool of Object.keys(toolCounts)) {
    for (const {toolUsage} of runs) {
      toolCounts[tool] += toolUsage[tool] ? 1 : 0
    }
  }

  const expected = await openaiClient.getEmbedding(expectedOutput)
  const similarities = await Promise.all(
    runs.map(async run => {
      const actual = await openaiClient.getEmbedding(run.aiResponse ?? '')
      return cosineSimilarity(actual, expected)
    }),
  )

  const avgSimilarity = similarities.reduce((sum, score) => sum + score, 0) / similarities.length
  /* eslint-disable-next-line no-console */
  console.log('Average similarity:', avgSimilarity)

  const toolUsagePercentages = Object.entries(toolCounts).map(([tool, count]) => ({
    [tool]: `${((count / runs.length) * 100).toFixed(2)}%`,
  }))

  return {
    meetsSimilarityThreshold: avgSimilarity >= SIMILARITY_THRESHOLD,
    toolUsagePercentages,
  }
}

// Example Usage
const prompt = `Only output code. Create a Primer Button that will be used to confirm deleting content.`
const expectedOutput = `<Button variant="danger">Cancel</Button>`

const stats = await analyzePrimerMcpAgainstOpenAI(prompt, expectedOutput)

/* eslint-disable-next-line no-console */
console.log(stats)

await mcp.teardown()

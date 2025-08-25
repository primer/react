import {OpenAI} from 'openai'

export class OpenAIClient {
  private openai: OpenAI
  private model: string

  constructor(apiKey: string, model = 'gpt-5') {
    this.openai = new OpenAI({apiKey})
    this.model = model
  }

  /**
   * Retrieves the embedding vector for a given text using OpenAI's embedding model.
   * @param text - The text to embed.
   * @returns A numeric vector representing the embedding.
   */
  async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data[0].embedding
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async chat(messages: any[], tools?: any[]) {
    return await this.openai.chat.completions.create({
      model: this.model,
      messages,
      tools,
      // eslint-disable-next-line camelcase
      tool_choice: tools ? 'auto' : undefined,
    })
  }
  // Add more methods as needed!
}

import 'dotenv/config'
import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js'

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

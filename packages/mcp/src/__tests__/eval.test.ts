import {Client} from '@modelcontextprotocol/sdk/client/index.js'
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js'

describe('MCP server tools', () => {
  let client: Client

  beforeAll(async () => {
    const transport = new StdioClientTransport({
      command: 'tsx',
      args: ['src/transports/stdio.ts'],
    })

    client = new Client(
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

    await client.connect(transport)
  })

  afterAll(async () => {
    await client.close()
  })

  it('should list the expected tools', async () => {
    const {tools} = await client.listTools()
    // Example expected: adapt to your actual tool names
    const expected = ['init', 'list_components', 'get_component']
    // If tools is an array of objects, map to names:
    const toolNames = Array.isArray(tools) ? tools.map(tool => tool.name || tool) : tools

    expect(toolNames).toEqual(expect.arrayContaining(expected))
  })
})

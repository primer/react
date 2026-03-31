import {createServer, type IncomingMessage, type ServerResponse} from 'node:http'
import {loadConfig} from './config'
import {ask} from './llm'

const config = loadConfig()

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const MAX_SIZE = 100 * 1024 // 100KB
    let size = 0
    const chunks: Uint8Array[] = []
    req.on('data', (chunk: Uint8Array) => {
      size += chunk.length
      if (size > MAX_SIZE) {
        req.destroy()
        reject(new Error('Request body too large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    json(res, 200, {status: 'ok'})
    return
  }

  // Main endpoint
  if (req.method === 'POST' && req.url === '/ask') {
    // API key auth (optional, but recommended for production)
    if (config.apiKey) {
      const authHeader = req.headers['authorization']
      if (authHeader !== `Bearer ${config.apiKey}`) {
        json(res, 401, {error: 'Unauthorized'})
        return
      }
    }

    try {
      const body = await readBody(req)
      const parsed = JSON.parse(body) as {question?: string}

      if (!parsed.question || typeof parsed.question !== 'string') {
        json(res, 400, {error: 'Missing required field: question'})
        return
      }

      if (parsed.question.length > 2000) {
        json(res, 400, {error: 'Question too long (max 2000 characters)'})
        return
      }

      const result = await ask(parsed.question, config)
      json(res, 200, result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error processing request:', error)
      json(res, 500, {error: 'Internal server error'})
    }
    return
  }

  json(res, 404, {error: 'Not found'})
})

server.listen(config.port, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`Primer API running on http://127.0.0.1:${config.port}`)
  // eslint-disable-next-line no-console
  console.log('POST /ask - Ask a question about Primer')
  // eslint-disable-next-line no-console
  console.log('GET  /health - Health check')
})

import {chromium, devices} from 'playwright'
import process from 'node:process'
import path from 'node:path'
import glob from 'fast-glob'
import * as esbuild from 'esbuild'
import {createServer, request, type Server} from 'node:http'
import {parse} from 'node:url'
import {existsSync, createReadStream} from 'node:fs'

async function benchmarks() {
  const cwd = process.cwd()
  const files = await glob('**/*.benchmarks.tsx', {
    cwd,
    ignore: ['**/node_modules/**', '**/dist/**', '**/lib/**', '**/lib-esm/**'],
  })

  await esbuild.build({
    bundle: true,
    platform: 'browser',
    entryPoints: files,
    tsconfig: path.join(cwd, 'packages', 'react', 'tsconfig.build.json'),
    outdir: 'assets',
    outbase: cwd,
    minify: true,
    define: {
      __DEV__: 'false',
    },
    alias: {
      'react-dom/client': 'react-dom/profiling',
    },
  })

  const server = createServer(async (req, res) => {
    try {
      console.log('debug: %s %s', req.method, req.url)
      if (!req.url) {
        throw new Error('Invalid URL')
      }

      const url = parse(req.url, true)
      if (!url.path) {
        throw new Error('Invalid path in URL for requested asset')
      }

      if (req.url?.startsWith('/assets')) {
        const filepath = path.join(cwd, url.path)
        if (!existsSync(filepath)) {
          res.statusCode = 404
          res.end('not found')
          return
        }

        res.writeHead(200, {
          'Content-Type': 'application/javascript',
        })
        createReadStream(filepath).pipe(res, {end: true})
      } else if (req.url?.startsWith('/benchmarks')) {
        const benchmarkPath = path.parse(url.path.split('/').slice(2).join(path.sep))
        const assetPath = path.format({
          ...benchmarkPath,
          base: '',
          ext: '.js',
        })

        res.writeHead(200, {
          'Content-Type': 'text-html',
        })
        res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Benchmark</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="/assets/${assetPath}"></script>
        </body>
        </html>
        `)
      } else {
        res.statusCode = 404
        res.end('not found')
      }
    } catch (error) {
      console.error('Error occurred handling', req.url, error)
      res.statusCode = 500
      res.end('internal server error')
    }

    // try {
    // if (req.method !== 'GET') {
    // res.statusCode = 405
    // res.end('method not allowed')
    // return
    // }

    // if (req.url?.startsWith('/benchmarks')) {
    // console.log('debug: GET %s', req.url)

    // const url = parse(req.url, true)
    // if (!url.path) {
    // throw new Error('Invalid path in URL for requested benchmark')
    // }

    // const requestedBenchmarkPath = url.path.split('/').slice(2).join(path.sep)
    // const filepath = path.join(cwd, requestedBenchmarkPath)
    // console.log(filepath)
    // if (!existsSync(filepath)) {
    // res.statusCode = 404
    // res.end('not found')
    // return
    // }

    // console.log(filepath)

    // res.writeHead(200, {
    // 'Content-Type': 'text/html',
    // })
    // res.end(`
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    // <meta charset="UTF-8">
    // <title>Benchmark</title>
    // </head>
    // <body>
    // <h1>Hello world</h1>
    // </body>
    // </html>
    // `)
    // return
    // }

    // res.statusCode = 404
    // res.end('not found')
    // } catch (err) {
    // console.error('Error occurred handling', req.url, err)
    // res.statusCode = 500
    // res.end('internal server error')
    // }
  })

  server.once('error', err => {
    console.error(err)
    process.exit(1)
  })

  await listen(server, 3000, '0.0.0.0')
  console.log('debug: server running on', `http://0.0.0.0:3000`)

  // Setup
  const browser = await chromium.launch()
  const context = await browser.newContext(devices['Desktop Chrome'])

  for (const file of files) {
    const page = await context.newPage()
    const url = new URL(`/benchmarks/${file}`, 'http://0.0.0.0:3000')
    await page.goto(url.toString())

    const results = await page.evaluate(() => {
      return window.BenchmarkRunner.runBenchmarks()
    })
    console.log(results[0].result.runs)

    await page.close()
  }

  await context.close()
  await browser.close()
  await close(server)
}

function close(server: Server): Promise<void> {
  return new Promise(resolve => {
    server.close(() => {
      resolve()
    })
  })
}

function listen(server: Server, port: number, hostname: string): Promise<void> {
  return new Promise(resolve => {
    server.listen(port, hostname, () => {
      resolve()
    })
  })
}

benchmarks().catch(error => {
  console.log(error)
  process.exit(1)
})

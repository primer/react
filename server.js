/* eslint-disable no-console */
const next = require('next')
const {createServer} = require('http')
const {existsSync} = require('fs')
const {join} = require('path')
const {parse} = require('url')

const port = parseInt(process.env.PORT, 10) || 3001
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

const staticDir = join(__dirname, 'static')

app.prepare().then(() => {
  createServer((req, res) => {
    const parsed = parse(req.url, true)
    const path = join(staticDir, parsed.pathname)
    if (existsSync(path)) {
      app.serveStatic(req, res, path)
    } else {
      handle(req, res, parsed)
    }
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

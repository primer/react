/* eslint-disable no-console */
const next = require('next')
const {createServer} = require('http')
const {existsSync} = require('fs')
const {join} = require('path')
const {parse} = require('url')

const port = parseInt(process.env.PORT, 10) || 3000
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

const deployURL = process.env.NOW_URL || ''
const deployHost = parse(deployURL).host

const staticDir = join(__dirname, 'static')

app.prepare().then(() => {
  createServer((req, res) => {
    const parsed = parse(req.url, true)
    const path = join(staticDir, parsed.pathname)
    if (existsSync(path)) {
      app.serveStatic(req, res, path)
    } else {
      const {host} = req.headers
      const baseURL = deployHost && host !== deployHost ? deployURL : ''
      // set the asset prefix to the deployed URL if the Host header differs
      app.setAssetPrefix(baseURL)
      handle(req, res, parsed)
    }
  })
  .listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

/* eslint-disable no-console */
const next = require('next')
const {createServer} = require('http')
const {parse} = require('url')
const nowConfig = require('./now.json')

const port = parseInt(process.env.PORT, 10) || 3000
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

const deployURL = process.env.NOW_URL || nowConfig.alias
const deployHost = deployURL ? parse(deployURL).host : undefined

app.prepare().then(() => {
  createServer((req, res) => {
    const parsed = parse(req.url)
    const baseURL = deployHost && parsed.host !== deployHost ? deployURL : ''
    app.setAssetPrefix(baseURL)
    handle(req, res, parsed)
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

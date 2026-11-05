import {createRequire} from 'node:module'
import fs from 'node:fs/promises'
const require = createRequire(`${process.cwd()}/package.json`)
const {chromium} = require('playwright')
const phase = process.argv[2]
const dir = `${process.cwd()}/.playwright/datatable-track-a-evidence/${phase}`
await fs.mkdir(dir, {recursive: true})
const browser = await chromium.launch({headless: true})
const context = await browser.newContext({
  viewport: {width: 1000, height: 640},
  deviceScaleFactor: 1,
  colorScheme: 'light',
  reducedMotion: 'reduce',
})
await context.addInitScript(() => {
  window.__selectionEvidence = {requests: [], delivered: []}
  const define = customElements.define.bind(customElements)
  customElements.define = (name, element, options) => {
    if (name === 'live-region') {
      const announce = element.prototype.announce
      element.prototype.announce = function (message, options) {
        window.__selectionEvidence.requests.push({message, options})
        return announce.call(this, message, options)
      }
    }
    return define(name, element, options)
  }
  const attach = HTMLElement.prototype.attachShadow
  HTMLElement.prototype.attachShadow = function (options) {
    const root = attach.call(this, options)
    if (this.localName === 'live-region')
      new MutationObserver(() => {
        const message = root.getElementById('polite')?.textContent
        if (message) window.__selectionEvidence.delivered.push(message)
      }).observe(root, {childList: true, subtree: true, characterData: true})
    return root
  }
})
const page = await context.newPage()
await page.clock.install({time: new Date('2026-11-05T20:00:00Z')})
const summaries = []
async function snapshot(name) {
  await page.waitForTimeout(500)
  await page.screenshot({path: `${dir}/${name}.png`, animations: 'disabled'})
  const aria = await page.getByRole('table').ariaSnapshot()
  await fs.writeFile(`${dir}/${name}.aria.txt`, aria + '\n')
  const client = await context.newCDPSession(page)
  const ax = await client.send('Accessibility.getFullAXTree')
  await fs.writeFile(`${dir}/${name}.ax.json`, JSON.stringify(ax, null, 2))
  await client.detach()
  const state = await page.evaluate(() => ({
    announcements: window.__selectionEvidence,
    focus: document.activeElement?.outerHTML,
    density: document.querySelector('[data-component="Table"]')?.getAttribute('data-cell-padding'),
    theme: document.body.getAttribute('data-color-mode'),
    headerRows: [...document.querySelectorAll('[data-component="Table"] > thead > tr')].map(row => ({
      html: row.outerHTML,
      ariaHidden: row.getAttribute('aria-hidden'),
    })),
  }))
  summaries.push({
    name,
    url: page.url(),
    ...state,
    axRows: ax.nodes.filter(n => !n.ignored && n.role?.value === 'row').map(n => n.name?.value),
  })
  console.log(
    name,
    JSON.stringify({
      requests: state.announcements.requests,
      delivered: state.announcements.delivered,
      axRows: summaries.at(-1).axRows,
    }),
  )
}
try {
  await page.goto(
    'http://localhost:6006/iframe.html?id=experimental-components-datatable-features--with-bulk-actions&viewMode=story&globals=colorScheme:light',
  )
  await page.getByRole('button', {name: 'Reset repositories', exact: true}).waitFor({timeout: 120000})
  await snapshot('bulk-preselected')
  await page.getByRole('button', {name: 'Reset repositories', exact: true}).click()
  await snapshot('bulk-zero')
  await page.getByRole('checkbox', {name: 'Select primer/react', exact: true}).click()
  await snapshot('bulk-one')
  await page.getByRole('checkbox', {name: 'Select primer/css', exact: true}).click()
  await snapshot('bulk-multiple')
  await page.getByRole('button', {name: 'Make internal', exact: true}).focus()
  await page.keyboard.press('Enter')
  await snapshot('bulk-cleared-keyboard')
  await page.goto(
    'http://localhost:6006/iframe.html?id=experimental-components-datatable-features--with-row-selection&viewMode=story&globals=colorScheme:light',
  )
  await page.getByRole('table').waitFor({timeout: 120000})
  await snapshot('selection-preselected')
  await page.getByRole('checkbox', {name: 'Select rows', exact: true}).focus()
  await page.keyboard.press('Space')
  await snapshot('selection-all')
  await page.keyboard.press('Space')
  await snapshot('selection-cleared')
  await fs.writeFile(
    `${dir}/results.json`,
    JSON.stringify(
      {phase, browser: browser.version(), viewport: {width: 1000, height: 640}, screens: summaries},
      null,
      2,
    ),
  )
} finally {
  await browser.close()
}

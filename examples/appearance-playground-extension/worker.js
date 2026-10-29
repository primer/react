/* global chrome */

import {appearanceCSS, appearanceVariables, defaultState, inspectPage, validateState} from './shared.js'

const catalogPromise = fetch(chrome.runtime.getURL('catalog.json')).then(response => {
  if (!response.ok) throw new Error(`Could not load presets (${response.status}).`)
  return response.json()
})
const keyFor = tabId => `preview:${tabId}`
let queue = Promise.resolve()

class UnsupportedPageError extends Error {
  constructor() {
    super('Browser-internal pages cannot be customized. Open a normal website and click the extension icon.')
    this.name = 'UnsupportedPageError'
  }
}

chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false}).catch(error => {
  console.error('Could not enable the appearance side panel:', error)
})

chrome.action.onClicked.addListener(tab => {
  chrome.sidePanel
    .open({tabId: tab.id})
    .then(() => chrome.storage.session.set({activation: {tabId: tab.id, time: Date.now()}}))
    .catch(error => {
      console.error('Could not open the appearance side panel:', error)
    })
})

async function inspect(tabId) {
  const tab = await chrome.tabs.get(tabId)
  if (tab.url && !/^(https?|file):/.test(tab.url)) throw new UnsupportedPageError()
  let result
  try {
    result = (await chrome.scripting.executeScript({target: {tabId}, func: inspectPage}))[0]
  } catch (error) {
    if (error.message.includes('Cannot access a chrome:// URL')) throw new UnsupportedPageError()
    throw error
  }
  if (!result?.documentId || !result.result) throw new Error('The active page could not be inspected.')
  const key = keyFor(tabId)
  const stored = (await chrome.storage.session.get(key))[key]
  const record = stored?.documentId === result.documentId ? stored : null
  if (stored && !record) {
    await chrome.storage.session.remove(key)
    await chrome.action.setBadgeText({tabId, text: ''})
  }
  return {
    ...result.result,
    hostMode: record?.hostMode ?? result.result.hostMode,
    documentId: result.documentId,
    state: record?.state ?? defaultState(),
    record,
  }
}

async function handle(message) {
  if (!Number.isInteger(message.tabId) || message.tabId < 0) throw new Error('Select a normal website tab first.')
  const tabId = message.tabId
  const page = await inspect(tabId)
  if (message.type === 'inspect') {
    const {record, ...result} = page
    return result
  }
  if (message.documentId !== page.documentId) {
    throw new Error('The page navigated. Reconnect before changing its appearance.')
  }
  const target = {tabId, documentIds: [page.documentId]}
  const key = keyFor(tabId)
  const previous = page.record?.css ?? ''
  if (message.type === 'reset') {
    if (previous) await chrome.scripting.removeCSS({target, css: previous, origin: 'USER'})
    await chrome.storage.session.remove(key)
    await chrome.action.setBadgeText({tabId, text: ''})
    const {record, ...result} = await inspect(tabId)
    return result
  }
  if (message.type !== 'apply') throw new Error('Unknown appearance action.')
  const catalog = await catalogPromise
  validateState(message.state, catalog)
  const css = appearanceCSS(message.state, catalog, page.hostMode, chrome.runtime.getURL('assets/w95fa.woff2'))
  if (css !== previous) {
    if (css) await chrome.scripting.insertCSS({target, css, origin: 'USER'})
    try {
      if (previous) await chrome.scripting.removeCSS({target, css: previous, origin: 'USER'})
    } catch (error) {
      if (css) await chrome.scripting.removeCSS({target, css, origin: 'USER'})
      throw error
    }
  }
  await chrome.storage.session.set({
    [key]: {documentId: page.documentId, hostMode: page.hostMode, state: message.state, css},
  })
  await chrome.action.setBadgeText({tabId, text: css ? 'ON' : ''})
  return {
    state: message.state,
    appliedVariables: Object.keys(appearanceVariables(message.state, catalog, page.hostMode).variables).length,
  }
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id || !['inspect', 'apply', 'reset'].includes(message?.type)) return false
  queue = queue
    .then(() => handle(message))
    .then(
      result => respond({ok: true, result}),
      error => {
        if (!(error instanceof UnsupportedPageError)) console.error('Appearance preview failed:', error)
        respond({
          ok: false,
          error: error.message || String(error),
          code: error instanceof UnsupportedPageError ? 'unsupported-page' : undefined,
        })
      },
    )
  return true
})

chrome.tabs.onRemoved.addListener(tabId => {
  chrome.storage.session
    .remove(keyFor(tabId))
    .catch(error => console.error('Could not clear closed-tab settings:', error))
})

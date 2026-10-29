/* global chrome */

import {appearanceVariables, defaultState, validateOverride} from './shared.js'

const element = id => document.getElementById(id)
let catalog
try {
  const response = await fetch('./catalog.json')
  if (!response.ok) throw new Error(`Could not load appearance presets (${response.status}).`)
  catalog = await response.json()
} catch (error) {
  showError(error)
  throw error
}
let state = defaultState()
let page = null
const requestedTabId = new URLSearchParams(location.search).get('tabId')
const tabId = requestedTabId === null ? NaN : Number(requestedTabId)
let generation = 0
let timer

function showError(error) {
  if (error.code === 'unsupported-page') {
    element('error').hidden = true
    element('settings').disabled = true
    element('site').textContent = 'Unsupported page'
    element('notice').textContent = error.message
    return
  }
  element('error').textContent =
    `${error.message || error} Click the extension icon on the website tab if access is needed.`
  element('error').hidden = false
  element('notice').textContent = 'Changes were not confirmed. Reconnect or reset before continuing.'
}

async function request(type, extra = {}) {
  const reply = await chrome.runtime.sendMessage({type, tabId, documentId: page?.documentId, ...extra})
  if (!reply?.ok) {
    throw Object.assign(new Error(reply?.error || 'The extension worker did not respond.'), {code: reply?.code})
  }
  return reply.result
}

function populateThemes() {
  const search = element('theme-search').value.trim().toLowerCase()
  const choices = catalog.themes.filter(theme => theme.id === state.theme || theme.name.toLowerCase().includes(search))
  element('theme').replaceChildren(...choices.map(theme => new Option(theme.name, theme.id)))
  element('theme').value = state.theme
}

function populateVariables() {
  const search = element('variable-search').value.trim().toLowerCase()
  const choices = page.variables.filter(variable => variable.name.toLowerCase().includes(search))
  element('variables').replaceChildren(
    ...choices.map(variable => new Option(`${variable.name}: ${variable.value}`, variable.name)),
  )
}

function render() {
  element('enabled').checked = state.enabled
  populateThemes()
  for (const [name, choices] of [
    ['density', catalog.densities],
    ['seriousness', catalog.seriousness],
  ]) {
    const index = choices.findIndex(choice => choice.id === state[name])
    element(name).value = index
    element(`${name}-value`).value = choices[index].name
    element(name).setAttribute('aria-valuetext', choices[index].name)
  }
  element('override-count').textContent = `(${Object.keys(state.overrides).length})`
  element('overrides').replaceChildren(
    ...Object.entries(state.overrides).map(([name, value]) => {
      const item = document.createElement('li')
      item.textContent = `${name}: ${value}`
      return item
    }),
  )
}

async function connect() {
  const version = ++generation
  clearTimeout(timer)
  element('settings').disabled = true
  element('error').hidden = true
  element('notice').textContent = 'Connecting...'
  try {
    if (!Number.isSafeInteger(tabId) || tabId < 0) {
      throw new Error('Open the controls using the extension icon on a website tab.')
    }
    const result = await request('inspect')
    if (version !== generation) return
    page = result
    state = result.state
    element('site').textContent = result.origin
    element('notice').textContent = result.primerDetected
      ? `${result.variables.length}${result.truncated ? '+' : ''} CSS variables found. ${state.enabled ? 'Preview enabled.' : 'Enable preview to try changes.'}`
      : 'Primer tokens were not detected. Preview may have little or no effect.'
    element('settings').disabled = false
    populateVariables()
    render()
  } catch (error) {
    if (version === generation) {
      page = null
      element('site').textContent = 'Not connected'
      showError(error)
    }
  }
}

async function apply() {
  const version = generation
  const settings = structuredClone(state)
  element('error').hidden = true
  element('notice').textContent = 'Applying...'
  try {
    const result = await request('apply', {state: settings})
    if (version !== generation) return
    element('notice').textContent = settings.enabled
      ? `Preview enabled: ${result.appliedVariables} variable overrides.`
      : 'Preview paused. Website styles are restored.'
  } catch (error) {
    if (version === generation) showError(error)
  }
}

function scheduleApply() {
  clearTimeout(timer)
  render()
  timer = setTimeout(apply, 120)
}

element('controls').addEventListener('submit', event => event.preventDefault())
element('theme-search').addEventListener('input', populateThemes)
element('variable-search').addEventListener('input', populateVariables)
element('enabled').addEventListener('change', () => {
  state.enabled = element('enabled').checked
  scheduleApply()
})
element('theme').addEventListener('change', () => {
  state.theme = element('theme').value
  scheduleApply()
})
element('density').addEventListener('input', () => {
  state.density = catalog.densities[Number(element('density').value)].id
  scheduleApply()
})
element('seriousness').addEventListener('input', () => {
  const profile = catalog.seriousness[Number(element('seriousness').value)]
  state.seriousness = profile.id
  state.density = profile.density
  scheduleApply()
})
element('variables').addEventListener('change', () => {
  const name = element('variables').value
  const active = appearanceVariables(state, catalog, page.hostMode).variables
  element('variable-name').value = name
  element('variable-value').value = active[name] ?? page.variables.find(variable => variable.name === name).value
})
element('set-variable').addEventListener('click', () => {
  try {
    const name = element('variable-name').value.trim()
    const value = element('variable-value').value.trim()
    validateOverride(name, value)
    state.overrides[name] = value
    scheduleApply()
  } catch (error) {
    showError(error)
  }
})
element('remove-variable').addEventListener('click', () => {
  delete state.overrides[element('variable-name').value.trim()]
  scheduleApply()
})
element('reset').addEventListener('click', async () => {
  const version = generation
  clearTimeout(timer)
  element('error').hidden = true
  try {
    const result = await request('reset')
    if (version !== generation) return
    page = result
    state = result.state
    populateVariables()
    render()
    element('notice').textContent = 'Preview removed. Original page styles restored.'
  } catch (error) {
    if (version === generation) showError(error)
  }
})
element('refresh').addEventListener('click', connect)
element('close-controls').addEventListener('click', async () => {
  clearTimeout(timer)
  try {
    await request('close-controls')
  } catch (error) {
    showError(error)
  }
})
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'session' && changes.activation?.newValue?.tabId === tabId) connect()
})
chrome.tabs.onUpdated.addListener((changedId, change) => {
  if (changedId === tabId && change.status === 'loading') {
    ++generation
    clearTimeout(timer)
    element('settings').disabled = true
    element('notice').textContent = 'Page is navigating. Preview does not carry over to a new document.'
  }
  if (changedId === tabId && change.status === 'complete') connect()
})
chrome.tabs.onRemoved.addListener(closedId => {
  if (closedId !== tabId) return
  ++generation
  clearTimeout(timer)
  page = null
  element('settings').disabled = true
  element('error').hidden = true
  element('site').textContent = 'Tab closed'
  element('notice').textContent = 'The website tab was closed. Open another website and click the extension icon.'
})
await connect()

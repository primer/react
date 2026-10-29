export function defaultState() {
  return {enabled: false, theme: 'primer', density: 'default', seriousness: 'default', overrides: {}}
}

export function validateOverride(name, value) {
  if (!/^--[a-zA-Z_][\w-]*$/.test(name)) throw new Error('Use a CSS variable name such as --borderRadius-medium.')
  if (typeof value !== 'string' || !value.trim() || value.length > 1000) {
    throw new Error('Enter a CSS value between 1 and 1000 characters.')
  }
  if (/[;{}<>@\\]/.test(value) || /\/\*|!important/i.test(value)) {
    throw new Error('Enter one CSS value, without declarations, comments, escapes or !important.')
  }
  const allowedFunctions = new Set([
    'var',
    'calc',
    'min',
    'max',
    'clamp',
    'rgb',
    'rgba',
    'hsl',
    'hsla',
    'color',
    'color-mix',
    'oklch',
    'oklab',
    'lch',
    'lab',
    'light-dark',
    'linear-gradient',
    'radial-gradient',
    'repeating-linear-gradient',
    'repeating-radial-gradient',
  ])
  for (const match of value.matchAll(/([a-zA-Z-]+)\s*\(/g)) {
    if (!allowedFunctions.has(match[1].toLowerCase())) {
      throw new Error(`CSS function ${match[1]}() is not supported. External resources are not allowed.`)
    }
  }
}

export function validateState(state, catalog) {
  if (!state || typeof state !== 'object' || Array.isArray(state) || typeof state.enabled !== 'boolean') {
    throw new Error('Invalid appearance settings.')
  }
  for (const [key, choices] of [
    ['theme', catalog.themes],
    ['density', catalog.densities],
    ['seriousness', catalog.seriousness],
  ]) {
    if (!choices.some(choice => choice.id === state[key])) throw new Error(`Unknown ${key}: ${state[key]}`)
  }
  if (!state.overrides || typeof state.overrides !== 'object' || Array.isArray(state.overrides)) {
    throw new Error('Invalid CSS-variable overrides.')
  }
  const overrides = Object.entries(state.overrides)
  if (overrides.length > 150) throw new Error('This demo supports at most 150 variable overrides.')
  for (const [name, value] of overrides) validateOverride(name, value)
}

export function appearanceVariables(state, catalog, hostMode) {
  validateState(state, catalog)
  const theme = catalog.themes.find(value => value.id === state.theme)
  const density = catalog.densities.find(value => value.id === state.density)
  const seriousness = catalog.seriousness.find(value => value.id === state.seriousness)
  const mode = theme.mode === 'host' ? hostMode : theme.mode
  return {
    mode,
    variables: {
      ...density.variables,
      ...theme.variables,
      ...seriousness[mode],
      ...state.overrides,
    },
  }
}

export function appearanceCSS(state, catalog, hostMode, fontBaseURL) {
  const {mode, variables} = appearanceVariables(state, catalog, hostMode)
  if (!state.enabled) return ''
  const declarations = Object.entries(variables).map(([name, value]) => `${name}: ${value} !important;`)
  if (state.theme !== 'primer') declarations.push(`color-scheme: ${mode} !important;`)
  if (!declarations.length) return ''
  const font = [
    {family: 'Playground W95FA', path: 'w95fa.woff2'},
    {family: 'Playground IBM VGA', path: 'ibm-vga/pxplus-ibm-vga-9x16.woff2'},
  ]
    .filter(({family}) => Object.values(variables).some(value => value.includes(family)))
    .map(
      ({family, path}) =>
        `@font-face { font-family: "${family}"; src: url("${new URL(path, fontBaseURL).href}") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }\n`,
    )
    .join('')
  return `${font}:root, :root *, :root *::before, :root *::after {\n${declarations.join('\n')}\n}`
}

export function inspectPage() {
  const nodes = [document.documentElement, document.body, ...document.querySelectorAll('[data-component]')]
    .filter(Boolean)
    .slice(0, 22)
  const variables = new Map()
  for (const node of nodes) {
    const style = getComputedStyle(node)
    for (const name of style) {
      if (name.startsWith('--') && !variables.has(name) && variables.size < 1000) {
        variables.set(name, style.getPropertyValue(name).trim())
      }
    }
  }
  const rootStyle = getComputedStyle(document.documentElement)
  const explicitMode = document.documentElement.getAttribute('data-color-mode')
  const scheme = rootStyle.colorScheme
  const hostMode =
    explicitMode === 'dark' ||
    scheme === 'dark' ||
    (explicitMode !== 'light' && scheme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light'
  return {
    origin: location.origin,
    hostMode,
    primerDetected:
      variables.has('--bgColor-default') ||
      variables.has('--color-canvas-default') ||
      variables.has('--control-medium-size'),
    variables: [...variables].sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({name, value})),
    truncated: variables.size === 1000,
  }
}

export function toggleControls(url) {
  const key = '__primerAppearancePlaygroundControls'
  const existing = globalThis[key]
  if (existing?.isConnected) {
    existing.remove()
    delete globalThis[key]
    return
  }
  if (!url) throw new Error('The appearance controls are no longer open.')
  const host = document.createElement('div')
  host.setAttribute('data-primer-appearance-controls', '')
  host.style.cssText = `
    all: initial !important;
    position: fixed !important;
    top: 16px !important;
    right: 16px !important;
    width: min(400px, calc(100vw - 32px)) !important;
    height: min(800px, calc(100dvh - 32px)) !important;
    z-index: 2147483647 !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 40px #0004 !important;
    overflow: hidden !important;
  `
  const shadow = host.attachShadow({mode: 'closed'})
  const frame = document.createElement('iframe')
  frame.src = url
  frame.title = 'Primer appearance controls'
  frame.style.cssText = 'display: block; width: 100%; height: 100%; border: 0; color-scheme: light dark;'
  shadow.append(frame)
  document.documentElement.append(host)
  globalThis[key] = host
}

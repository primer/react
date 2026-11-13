import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const browserGlobals = [
  'window',
  'document',
  'navigator',
  'location',
  'history',
  'localStorage',
  'sessionStorage',
  'HTMLElement',
  'Element',
  'Node',
  'CustomEvent',
  'MutationObserver',
  'ResizeObserver',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'matchMedia',
  'getComputedStyle',
  'CSS',
]

for (const name of browserGlobals) {
  delete globalThis[name]
}

const failures = []
async function check(label, callback) {
  try {
    await callback()
  } catch (error) {
    failures.push(new Error(`${label}: ${error.message}`, {cause: error}))
  }
}

let packageRoot
await check('Root package import', async () => {
  packageRoot = await import('@primer/react-tailwind')
})

if (packageRoot) {
  await check('Root package exports and server render', async () => {
    for (const name of ['BaseStyles', 'Button', 'TextInput', 'Overlay']) {
      const component = packageRoot[name]
      if (typeof component !== 'object' && typeof component !== 'function') {
        throw new Error(`Missing ${name} export.`)
      }
    }

    const markup = renderToStaticMarkup(
      React.createElement(
        packageRoot.BaseStyles,
        null,
        React.createElement(packageRoot.Button, {type: 'button'}, 'Consumer button'),
        React.createElement(packageRoot.TextInput, {
          'aria-label': 'Consumer input',
          defaultValue: 'Consumer value',
        }),
        React.createElement(packageRoot.Overlay, null, 'Consumer overlay'),
      ),
    )

    for (const component of ['BaseStyles', 'Button', 'TextInput', 'Overlay']) {
      if (!markup.includes(`data-component="${component}"`)) {
        throw new Error(`Server render did not produce ${component} markup.`)
      }
    }
  })

  await check('Button form types', async () => {
    const defaultButton = renderToStaticMarkup(React.createElement(packageRoot.Button, null, 'Preview'))
    const submitButton = renderToStaticMarkup(
      React.createElement(packageRoot.Button, {type: 'submit'}, 'Create account'),
    )
    if (!defaultButton.includes('type="button"') || !submitButton.includes('type="submit"')) {
      throw new Error('Button must default to type="button" and support an explicit type="submit".')
    }
  })

  await check('ThemeProvider/useTheme resolved modes and theme-dependent images', async () => {
    function ThemeImage() {
      const {colorMode, resolvedColorMode} = packageRoot.useTheme()
      return React.createElement('img', {
        src: resolvedColorMode === 'dark' ? '/night-image.svg' : '/day-image.svg',
        alt: 'Repository activity',
        'data-configured-mode': colorMode,
        'data-resolved-mode': resolvedColorMode,
      })
    }
    for (const [colorMode, resolvedColorMode] of [
      ['day', 'light'],
      ['light', 'light'],
      ['night', 'dark'],
      ['dark', 'dark'],
      ['auto', 'light'],
    ]) {
      const markup = renderToStaticMarkup(
        React.createElement(packageRoot.ThemeProvider, {colorMode}, React.createElement(ThemeImage)),
      )
      const image = resolvedColorMode === 'dark' ? '/night-image.svg' : '/day-image.svg'
      if (
        !markup.includes(`data-configured-mode="${colorMode}"`) ||
        !markup.includes(`data-resolved-mode="${resolvedColorMode}"`) ||
        !markup.includes(`src="${image}"`)
      ) {
        throw new Error(`Configured ${colorMode} must resolve to ${resolvedColorMode} and select ${image}.`)
      }
    }
  })
}

for (const [name, expectedExport] of [
  ['Button', 'Button'],
  ['TextInput', 'TextInput'],
  ['Overlay', 'Overlay'],
]) {
  await check(`${name} subpath import and server render`, async () => {
    const module = await import(`@primer/react-tailwind/${name}`)
    const component = module[expectedExport]
    if (typeof component !== 'object' && typeof component !== 'function') {
      throw new Error(`Missing ${expectedExport} export.`)
    }

    const element =
      name === 'TextInput'
        ? React.createElement(component, {'aria-label': 'Subpath input'})
        : React.createElement(component, null, 'Subpath content')
    const markup = renderToStaticMarkup(element)
    if (!markup.includes(`data-component="${name}"`)) {
      throw new Error(`Server render did not produce ${name} markup.`)
    }
  })
}

let subpathFormControl
let subpathCheckbox
await check('FormControl and Checkbox subpath imports', async () => {
  subpathFormControl = (await import('@primer/react-tailwind/FormControl')).FormControl
  subpathCheckbox = (await import('@primer/react-tailwind/Checkbox')).Checkbox
})

if (packageRoot && subpathFormControl && subpathCheckbox) {
  for (const [label, FormControl, Checkbox] of [
    ['Root FormControl and Checkbox', packageRoot.FormControl, packageRoot.Checkbox],
    ['Root FormControl and subpath Checkbox', packageRoot.FormControl, subpathCheckbox],
    ['Subpath FormControl and root Checkbox', subpathFormControl, packageRoot.Checkbox],
    ['Subpath FormControl and Checkbox', subpathFormControl, subpathCheckbox],
  ]) {
    await check(`${label} server association`, async () => {
      const markup = renderToStaticMarkup(
        React.createElement(
          FormControl,
          {id: 'packed-control'},
          React.createElement(FormControl.Label, {id: 'packed-label'}, 'Consumer checkbox'),
          React.createElement(Checkbox),
        ),
      )
      if (!markup.includes('id="packed-label"') || !markup.includes('aria-labelledby="packed-label"')) {
        throw new Error('The checkbox label was not associated before hydration.')
      }
    })
  }
}

let baseModule
let behaviorsModule
await check('Base and behaviors subpath imports', async () => {
  baseModule = await import('@primer/react-tailwind/base')
  behaviorsModule = await import('@primer/react-tailwind/behaviors')
  for (const [subpath, module, expected] of [
    ['base', baseModule, ['BasePortalProvider']],
    ['behaviors', behaviorsModule, ['usePortalContainer', 'usePortalRoot']],
  ]) {
    const actual = Object.keys(module).sort()
    if (actual.join() !== expected.join()) {
      throw new Error(
        `@primer/react-tailwind/${subpath} exports ${actual.join(', ')} instead of ${expected.join(', ')}.`,
      )
    }
    for (const name of expected) {
      if (typeof module[name] !== 'function' || Object.keys(module[name]).some(key => /^[A-Z]/.test(key))) {
        throw new Error(`@primer/react-tailwind/${subpath} ${name} must be a flat function export.`)
      }
    }
  }
})

if (packageRoot && baseModule && behaviorsModule) {
  await check('Portal provider identity and shared routing across root, component, base, and behaviors', async () => {
    const subpathPortal = (await import('@primer/react-tailwind/Portal')).Portal
    if (packageRoot.Portal.Provider !== baseModule.BasePortalProvider) {
      throw new Error('Root Portal.Provider must be the base BasePortalProvider.')
    }
    if (subpathPortal.Provider !== baseModule.BasePortalProvider) {
      throw new Error('Portal subpath Portal.Provider must be the base BasePortalProvider.')
    }

    function Probe() {
      const container = behaviorsModule.usePortalContainer()
      const root = behaviorsModule.usePortalRoot()
      return `${String(container)}:${String(root)}`
    }
    const unprovided = renderToStaticMarkup(React.createElement(Probe))
    const provided = renderToStaticMarkup(
      React.createElement(
        packageRoot.Portal.Provider,
        {container: null},
        'Inline',
        React.createElement(packageRoot.Portal, null, 'Portaled'),
        React.createElement(Probe),
      ),
    )
    if (unprovided !== 'undefined:null') {
      throw new Error(`Server portal routing without a provider rendered ${unprovided}.`)
    }
    if (provided !== 'Inlinenull:null') {
      throw new Error(`Server portal routing through a root provider rendered ${provided}.`)
    }
  })
}

if (failures.length > 0) {
  process.stderr.write(
    `Packed package import and server render validation failed:\n${failures.map(error => error.message).join('\n')}\n`,
  )
  process.exitCode = 1
}

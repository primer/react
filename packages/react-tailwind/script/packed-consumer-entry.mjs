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

if (failures.length > 0) {
  process.stderr.write(
    `Packed package import and server render validation failed:\n${failures.map(error => error.message).join('\n')}\n`,
  )
  process.exitCode = 1
}

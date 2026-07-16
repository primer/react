import {fileURLToPath} from 'node:url'
import {describe, expect, it} from 'vitest'
import {findComponentSpecs, loadComponentSpec, parseComponentSpec, parseFeatureSpec, validateComponentSpecs} from '.'

const fixturesPath = fileURLToPath(new URL('__fixtures__', import.meta.url))

describe('parseComponentSpec', () => {
  it('parses a feature-first component spec', () => {
    const result = parseComponentSpec(`
# Example spec

Example communicates status.

## Accessibility

The component MUST expose its status.

## Features

### Default

The default feature renders the status.

#### Markup

The component MUST render a status element.

#### Public API

When both values are provided, the controlled value MUST take precedence.

### Delayed appearance

The component can delay short-lived status.

#### Behavior

The component MUST remain unmounted until the delay elapses.
`)

    expect(result.valid).toBe(true)
    expect(result.diagnostics).toEqual([])
    expect(result.value).toMatchObject({
      name: 'Example',
      description: 'Example communicates status.',
      format: 'single',
      features: [
        {
          name: 'Default',
          sections: {
            markup: {
              markdown: 'The component MUST render a status element.',
            },
            publicApi: {
              markdown: 'When both values are provided, the controlled value MUST take precedence.',
            },
          },
        },
        {
          name: 'Delayed appearance',
          sections: {
            behavior: {
              markdown: 'The component MUST remain unmounted until the delay elapses.',
            },
          },
        },
      ],
    })
  })

  it('reports unsupported structure and forbidden sections', () => {
    const result = parseComponentSpec(`
# Example spec

Example communicates status.

## Features

### Loading

The loading feature renders status.

#### API

The API is documented here.

## Verification

The tests are listed here.

## SSR

The component renders on the server.
`)

    expect(result.valid).toBe(false)
    const codes = result.diagnostics.map(diagnostic => diagnostic.code)
    expect(codes).toEqual(
      expect.arrayContaining(['missing-default-feature', 'unexpected-heading', 'forbidden-heading']),
    )
    expect(codes.filter(code => code === 'forbidden-heading')).toHaveLength(2)
    expect(result.diagnostics.filter(diagnostic => diagnostic.message.includes('Verification'))).toHaveLength(1)
  })

  it('requires a component title and description', () => {
    const result = parseComponentSpec(`
# Example

## Features

### Default

The default feature exists.

#### Behavior

The feature MUST behave predictably.
`)

    expect(result.valid).toBe(false)
    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining(['invalid-title', 'empty-description']),
    )
  })
})

describe('parseFeatureSpec', () => {
  it('parses a split feature file', () => {
    const result = parseFeatureSpec(`
# Submenus

Submenus reveal related actions.

## Behavior

Arrow Right MUST open the focused submenu.

## Accessibility

The trigger MUST expose its expanded state.
`)

    expect(result.valid).toBe(true)
    expect(result.value).toMatchObject({
      name: 'Submenus',
      sections: {
        behavior: {
          markdown: 'Arrow Right MUST open the focused submenu.',
        },
        accessibility: {
          markdown: 'The trigger MUST expose its expanded state.',
        },
      },
    })
  })
})

describe('loadComponentSpec', () => {
  it('loads a single-file component spec from its component directory', async () => {
    const result = await loadComponentSpec(new URL('__fixtures__/single', import.meta.url).pathname)

    expect(result.valid).toBe(true)
    expect(result.value).toMatchObject({
      name: 'Example',
      format: 'single',
      features: [{name: 'Default'}, {name: 'Delayed appearance'}],
    })
  })

  it('loads and combines a split component spec', async () => {
    const result = await loadComponentSpec(new URL('__fixtures__/split', import.meta.url).pathname)

    expect(result.valid).toBe(true)
    expect(result.value).toMatchObject({
      name: 'Example',
      format: 'split',
      features: [{name: 'Default'}, {name: 'Submenus'}],
    })
    expect(result.value?.files).toHaveLength(3)
  })

  it('reports missing and orphaned split feature files', async () => {
    const result = await loadComponentSpec(new URL('__fixtures__/invalid-split', import.meta.url).pathname)
    const codes = result.diagnostics.map(diagnostic => diagnostic.code)

    expect(result.valid).toBe(false)
    expect(codes).toContain('missing-feature-file')
    expect(codes).toContain('invalid-feature-link')
    expect(codes).toContain('feature-title-mismatch')
    expect(codes).toContain('orphan-feature-file')
  })

  it('rejects component directories with both spec layouts', async () => {
    const result = await loadComponentSpec(new URL('__fixtures__/ambiguous', import.meta.url).pathname)

    expect(result.valid).toBe(false)
    expect(result.value).toBeNull()
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: 'ambiguous-spec',
      }),
    ])
  })

  it('reports paths without a component spec', async () => {
    const result = await loadComponentSpec(new URL('__fixtures__/missing', import.meta.url).pathname)

    expect(result.valid).toBe(false)
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: 'file-not-found',
      }),
    ])
  })
})

describe('component spec discovery', () => {
  it('finds single-file and split component specs', async () => {
    const entries = await findComponentSpecs(fixturesPath)

    expect(entries).toHaveLength(4)
    expect(entries.some(entry => entry.endsWith('/single'))).toBe(true)
    expect(entries.some(entry => entry.endsWith('/split'))).toBe(true)
    expect(entries.some(entry => entry.endsWith('/ambiguous'))).toBe(true)
  })

  it('validates every discovered component spec', async () => {
    const result = await validateComponentSpecs(fixturesPath)

    expect(result.valid).toBe(false)
    expect(result.specs).toHaveLength(3)
    expect(result.diagnostics.some(diagnostic => diagnostic.code === 'orphan-feature-file')).toBe(true)
    expect(result.diagnostics.some(diagnostic => diagnostic.code === 'ambiguous-spec')).toBe(true)
  })
})

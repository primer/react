import React from 'react'
import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {renderToString} from 'react-dom/server'
import {hydrateRoot} from 'react-dom/client'
import {page} from 'vitest/browser'
import {getContrast} from 'color2k'
import {defineTheme, primerTheme} from './defineTheme'
import {ThemeProvider} from '../next/ThemeProvider'
import {ThemeProvider as LegacyThemeProvider} from '../ThemeProvider'
import {useTheme} from '../useTheme'
import {
  Button,
  BaseStyles,
  Heading,
  TextInput,
  ActionList,
  ActionMenu,
  Portal,
  PortalContext,
  registerPortalRoot,
} from '..'
import {noodlesTheme} from '../stories/noodlesTheme'

const identity = defineTheme({
  name: 'test',
  typography: {fontFamily: {body: 'Arial, sans-serif', heading: 'Georgia, serif', monospace: 'Courier, monospace'}},
  radii: {small: '4px', medium: '8px', large: '16px'},
  colorSchemes: {
    light: {tokens: {'bgColor.default': '#fafafa'}},
    dark: {
      tokens: {
        'bgColor.default': '#111111',
        'fgColor.default': '#eeeeee',
        'borderColor.default': '#aaaaaa',
        'control.fgColor.rest': '#eeeeee',
        'control.bgColor.rest': '#222222',
        'control.bgColor.hover': '#333333',
        'control.bgColor.active': '#444444',
        'control.transparent.bgColor.hover': '#555555',
        'button.primary.bgColor.rest': '#0055aa',
        'button.primary.bgColor.hover': '#004488',
        'button.primary.bgColor.active': '#003366',
        'button.primary.bgColor.disabled': '#343a45',
        'button.primary.borderColor.disabled': '#343a45',
        'button.primary.fgColor.disabled': '#a1aab6',
      },
    },
  },
})

describe('defineTheme', () => {
  it('merges with the explicit base, copies inputs, and freezes results', () => {
    const tokens = {'fgColor.default': '#abcdef'}
    const base = defineTheme({name: 'base', radii: {small: '1px'}, colorSchemes: {dark: {tokens}}})
    const theme = defineTheme({name: 'derived', extends: base, radii: {medium: '10px'}})
    tokens['fgColor.default'] = '#000000'
    expect(theme.radii).toEqual({small: '1px', medium: '10px', large: '12px'})
    expect(theme.colorSchemes.dark.tokens['fgColor.default']).toBe('#abcdef')
    expect(theme.colorSchemes.light.tokens).toEqual({})
    expect(Object.isFrozen(theme)).toBe(true)
    expect(Object.isFrozen(theme.typography.fontFamily)).toBe(true)
    expect(Object.isFrozen(theme.colorSchemes.dark.tokens)).toBe(true)
  })

  it.each([
    ['unknown option', {name: 'test', spacing: {}}],
    ['unknown font family', {name: 'test', typography: {fontFamily: {display: 'serif'}}}],
    ['unknown radius', {name: 'test', radii: {full: '8px'}}],
    ['unknown color scheme', {name: 'test', colorSchemes: {sepia: {tokens: {}}}}],
    ['unknown color token', {name: 'test', colorSchemes: {dark: {tokens: {'bgColor.typo': '#ffffff'}}}}],
    ['colors must', {name: 'test', colorSchemes: {dark: {tokens: {'bgColor.default': 'var(--other)'}}}}],
    ['font families', {name: 'test', typography: {fontFamily: {body: '</style><script>'}}}],
    ['radii must', {name: 'test', radii: {medium: '-1px'}}],
    ['must be an object', {name: 'test', colorSchemes: {dark: null}}],
  ])('rejects malformed JavaScript inputs: %s', (message, input) => {
    expect(() => defineTheme(JSON.parse(JSON.stringify(input)))).toThrow(message)
  })
})

describe.each([
  ['next', ThemeProvider],
  ['legacy', LegacyThemeProvider],
] as const)('%s theme identity boundary', (_name, Provider) => {
  it.each(['light', 'dark', 'dark_dimmed', 'light_high_contrast'])(
    'starts explicit identities with light/dark schemes inside a %s parent',
    scheme => {
      render(
        <LegacyThemeProvider dayScheme={scheme} nightScheme={scheme} colorMode="day">
          <Provider theme={identity} colorMode="night">
            <Button>Themed</Button>
            <Provider>
              <Button>Inherited</Button>
            </Provider>
          </Provider>
          <Provider theme={primerTheme} colorMode="night">
            <Button>Primer</Button>
          </Provider>
        </LegacyThemeProvider>,
      )
      for (const name of ['Themed', 'Inherited']) {
        const button = screen.getByRole('button', {name})
        expect(button.closest('[data-primer-theme]')).toHaveAttribute('data-light-theme', 'light')
        expect(button.closest('[data-primer-theme]')).toHaveAttribute('data-dark-theme', 'dark')
        expect(getComputedStyle(button).backgroundColor).toBe('rgb(34, 34, 34)')
      }
      expect(getComputedStyle(screen.getByRole('button', {name: 'Primer'})).backgroundColor).toBe('rgb(33, 40, 48)')
    },
  )

  it.each([{dayScheme: 'light_high_contrast'}, {nightScheme: 'dark_dimmed'}])(
    'rejects unsupported explicit schemes: %j',
    schemes => {
      expect(() =>
        renderToString(
          <Provider theme={identity} {...schemes}>
            Content
          </Provider>,
        ),
      ).toThrow('dayScheme="light" and nightScheme="dark" only')
    },
  )

  it('applies semantic outputs, typography shorthands, shared radii and component states at one scope', async () => {
    render(
      <Provider theme={identity} colorMode="night">
        <BaseStyles>
          <Button>Default</Button>
          <Button aria-expanded="true">Active</Button>
          <Button variant="invisible">Invisible</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="primary" aria-expanded="true">
            Primary active
          </Button>
          <Button variant="primary" disabled>
            Primary disabled
          </Button>
          <Heading variant="medium">Heading</Heading>
          <TextInput aria-label="Input" />
        </BaseStyles>
      </Provider>,
    )
    const button = screen.getByRole('button', {name: 'Default'})
    const primary = screen.getByRole('button', {name: 'Primary'})
    expect(getComputedStyle(button).backgroundColor).toBe('rgb(34, 34, 34)')
    expect(getComputedStyle(button).color).toBe('rgb(238, 238, 238)')
    expect(getComputedStyle(button).borderTopColor).toBe('rgb(170, 170, 170)')
    expect(getComputedStyle(button).borderRadius).toBe('8px')
    expect(getComputedStyle(button).fontFamily).toBe('Arial, sans-serif')
    expect(getComputedStyle(screen.getByRole('heading')).fontFamily).toBe('Georgia, serif')
    expect(getComputedStyle(screen.getByRole('textbox')).fontFamily).toBe('Arial, sans-serif')
    expect(getComputedStyle(primary).backgroundColor).toBe('rgb(0, 85, 170)')
    await page.getByRole('button', {name: 'Invisible'}).hover()
    const invisible = screen.getByRole('button', {name: 'Invisible'})
    await waitFor(() => expect(getComputedStyle(invisible).backgroundColor).toBe('rgb(85, 85, 85)'))
    await page.getByRole('button', {name: 'Primary'}).hover()
    await waitFor(() => expect(getComputedStyle(primary).backgroundColor).toBe('rgb(0, 68, 136)'))
    expect(getComputedStyle(screen.getByRole('button', {name: 'Active'})).backgroundColor).toBe('rgb(68, 68, 68)')
    expect(getComputedStyle(screen.getByRole('button', {name: 'Primary active'})).backgroundColor).toBe(
      'rgb(0, 51, 102)',
    )
    const disabledPrimary = screen.getByRole('button', {name: 'Primary disabled'})
    expect(getComputedStyle(disabledPrimary).color).toBe('rgb(161, 170, 182)')
    expect(getComputedStyle(disabledPrimary).backgroundColor).toBe('rgb(52, 58, 69)')
  })

  it('inherits identity, switches schemes, and resets nested explicit identities to their own base', () => {
    const {rerender} = render(
      <Provider theme={identity} colorMode="night">
        <Provider>
          <Button>Inherited</Button>
        </Provider>
        <Provider theme={primerTheme}>
          <Button>Reset</Button>
        </Provider>
      </Provider>,
    )
    expect(getComputedStyle(screen.getByRole('button', {name: 'Inherited'})).backgroundColor).toBe('rgb(34, 34, 34)')
    expect(getComputedStyle(screen.getByRole('button', {name: 'Reset'})).backgroundColor).toBe('rgb(33, 40, 48)')
    rerender(
      <Provider theme={identity} colorMode="day">
        <Portal>
          <span data-testid="surface">Light</span>
        </Portal>
      </Provider>,
    )
    const surface = screen.getByTestId('surface').closest('[data-primer-theme]')
    expect(surface).toHaveAttribute('data-primer-theme', 'test')
    expect(surface && getComputedStyle(surface).getPropertyValue('--bgColor-default').trim()).toBe('#fafafa')
  })

  it('keeps source identity, context setters and explicit destinations for portals', async () => {
    const destination = document.createElement('div')
    document.body.appendChild(destination)
    registerPortalRoot(destination, `contract-${_name}`)
    function Consumer() {
      const {setColorMode, themeDefinition, theme} = useTheme()
      return (
        <button type="button" onClick={() => setColorMode('day')}>
          {themeDefinition?.name}-{String(Boolean(theme))}
        </button>
      )
    }
    const {unmount} = render(
      <Provider theme={identity} themeNonce="test-nonce" colorMode="night">
        <PortalContext.Provider value={{portalContainerName: `contract-${_name}`}}>
          <Portal>
            <Consumer />
          </Portal>
        </PortalContext.Provider>
      </Provider>,
    )
    const button = screen.getByRole('button', {name: `test-${_name === 'legacy'}`})
    expect(destination.contains(button)).toBe(true)
    expect(button.closest('[data-primer-theme]')).toHaveAttribute('data-color-mode', 'dark')
    expect(button.closest('[data-primer-theme]')?.querySelector('style')?.nonce).toBe('test-nonce')
    await userEvent.click(button)
    expect(button.closest('[data-primer-theme]')).toHaveAttribute('data-color-mode', 'light')
    unmount()
    expect(destination.childElementCount).toBe(0)
    destination.remove()
  })
})

it('themes a default-destination menu without per-use portal glue and preserves keyboard behavior', async () => {
  render(
    <ThemeProvider theme={identity} colorMode="night">
      <ActionList>
        <ActionList.LinkItem href="#" active aria-current="page">
          Current
        </ActionList.LinkItem>
      </ActionList>
      <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item>Archive</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </ThemeProvider>,
  )
  const trigger = screen.getByRole('button', {name: 'Actions'})
  await userEvent.click(trigger)
  const item = screen.getByRole('menuitem', {name: 'Archive'})
  expect(item).toHaveFocus()
  expect(item.closest('[data-primer-theme]')).toHaveAttribute('data-primer-theme', 'test')
  expect(getComputedStyle(item).color).toBe('rgb(238, 238, 238)')
  expect(
    getComputedStyle(screen.getByRole('menu').closest('[data-component="ActionMenu.Overlay"]')!).borderRadius,
  ).toBe('16px')
  expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  await userEvent.keyboard('{Escape}')
  expect(trigger).toHaveFocus()
})

it('renders automatic schemes on the server and hydrates without changing scope IDs', async () => {
  const view = (
    <ThemeProvider theme={identity} themeNonce="ssr-nonce" colorMode="auto">
      <BaseStyles>Content</BaseStyles>
    </ThemeProvider>
  )
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const html = renderToString(view)
  consoleError.mockRestore()
  expect(html).toContain('@media(prefers-color-scheme:dark)')
  expect(html).toContain('Arial, sans-serif')
  expect(html).not.toContain('&quot;')
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  const scope = host.firstElementChild?.getAttribute('data-primer-theme-scope')
  const errors: unknown[] = []
  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    await act(async () => {
      root = hydrateRoot(host, view, {onRecoverableError: error => errors.push(error)})
    })
    expect(errors).toEqual([])
    expect(host.firstElementChild).toHaveAttribute('data-primer-theme-scope', scope)
    expect(host.querySelector('style')?.nonce).toBe('ssr-nonce')
  } finally {
    await act(async () => root?.unmount())
    host.remove()
  }
})

it('measures Noodles text, primary states, focus, and control boundary contrast pairs', () => {
  const tokens = noodlesTheme.colorSchemes.dark.tokens
  const color = (token: keyof typeof tokens) => {
    const value = tokens[token]
    if (!value) throw new Error(`Missing contrast input: ${token}`)
    return value
  }
  for (const background of [
    'bgColor.default',
    'bgColor.muted',
    'control.bgColor.hover',
    'control.bgColor.active',
  ] as const) {
    expect(getContrast(color('fgColor.default'), color(background))).toBeGreaterThanOrEqual(4.5)
    expect(getContrast(color('fgColor.muted'), color(background))).toBeGreaterThanOrEqual(4.5)
  }
  for (const state of ['rest', 'hover', 'active'] as const) {
    expect(
      getContrast(color('button.primary.fgColor.rest'), color(`button.primary.bgColor.${state}`)),
    ).toBeGreaterThanOrEqual(4.5)
  }
  expect(
    getContrast(color('button.primary.fgColor.disabled'), color('button.primary.bgColor.disabled')),
  ).toBeGreaterThanOrEqual(4.5)
  expect(getContrast(color('focus.outlineColor'), color('bgColor.default'))).toBeGreaterThanOrEqual(3)
  expect(getContrast(color('borderColor.default'), color('control.bgColor.rest'))).toBeGreaterThanOrEqual(3)
})

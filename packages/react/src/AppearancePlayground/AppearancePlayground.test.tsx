import {StrictMode} from 'react'
import {renderToString} from 'react-dom/server'
import {fireEvent, render, screen, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {AppearancePlayground} from './index'
import {getPortalRoot} from '../Portal/portalRoot'
import {densityVariables, playgroundSeriousnessProfiles, seriousnessVariables} from './AppearancePlayground.tokens'

describe('AppearancePlayground', () => {
  it('forwards root attributes and protects the component identifier', () => {
    render(
      <AppearancePlayground
        id="demo"
        className="consumer"
        style={{minHeight: 0}}
        data-testid="demo"
        data-component="consumer"
      >
        <button type="button">App content</button>
      </AppearancePlayground>,
    )
    expect(screen.getByTestId('demo')).toHaveAttribute('id', 'demo')
    expect(screen.getByTestId('demo')).toHaveClass('consumer')
    expect(screen.getByTestId('demo')).toHaveStyle({minHeight: 0})
    expect(screen.getByTestId('demo')).toHaveAttribute('data-component', 'AppearancePlayground')
    expect(screen.getByRole('button', {name: 'App content'}).closest('[data-playground-appearance]')).not.toBeNull()
    expect(screen.getByRole('region', {name: 'Preview appearance'}).closest('[data-playground-appearance]')).toBeNull()
  })

  it('coordinates seriousness, permits density overrides and resets Default', () => {
    const {container} = render(<AppearancePlayground>App</AppearancePlayground>)
    const seriousness = screen.getByRole('slider', {name: 'Seriousness'})
    const density = screen.getByRole('slider', {name: 'Density'})
    fireEvent.change(seriousness, {target: {value: '4'}})
    expect(seriousness).toHaveAttribute('aria-valuetext', 'Bank security')
    expect(density).toHaveAttribute('aria-valuetext', 'Compact')
    expect(container.querySelector('style')).toHaveTextContent('--borderRadius-medium: 0px')
    fireEvent.change(density, {target: {value: '4'}})
    expect(density).toHaveAttribute('aria-valuetext', 'Very spacious')
    expect(seriousness).toHaveAttribute('aria-valuetext', 'Bank security')
    fireEvent.change(seriousness, {target: {value: '2'}})
    expect(density).toHaveAttribute('aria-valuetext', 'Default')
    expect(container.querySelector('style')).not.toHaveTextContent('--borderRadius-medium')
  })

  it('isolates sibling instances and removes registered roots when unmounted', () => {
    const {container, unmount} = render(
      <StrictMode>
        <AppearancePlayground aria-label="First">First</AppearancePlayground>
        <AppearancePlayground aria-label="Second">Second</AppearancePlayground>
      </StrictMode>,
    )
    fireEvent.change(within(screen.getByLabelText('First')).getByRole('slider', {name: 'Seriousness'}), {
      target: {value: '4'},
    })
    expect(within(screen.getByLabelText('Second')).getByRole('slider', {name: 'Seriousness'})).toHaveAttribute(
      'aria-valuetext',
      'Default',
    )
    const scopes = Array.from(container.querySelectorAll('style[data-playground-appearance-style]')).map(
      element => element.getAttribute('data-playground-appearance-style')!,
    )
    expect(new Set(scopes).size).toBe(2)
    const rootNames = [
      ...scopes.map(scope => `${scope}-portals`),
      ...screen.getAllByRole('button', {name: 'Choose theme: Primer'}).map(element => `${element.id}-picker`),
    ]
    for (const name of rootNames) expect(getPortalRoot(name)).toBeDefined()
    unmount()
    for (const name of rootNames) expect(getPortalRoot(name)).toBeUndefined()
  })

  it('can render on the server', () => {
    expect(renderToString(<AppearancePlayground>Server content</AppearancePlayground>)).toContain('Server content')
  })

  it('limits automatic spacing changes to one density step', () => {
    expect(playgroundSeriousnessProfiles.map(profile => profile.density)).toEqual([
      'spacious',
      'default',
      'default',
      'default',
      'compact',
    ])
    expect(densityVariables('spacious')['--base-size-16']).toBe('1.25rem')
    expect(densityVariables('compact')['--base-size-16']).toBe('0.75rem')
  })

  it.each(['light', 'dark'] as const)('adds distinct endpoint colors and resets in %s mode', mode => {
    const friendly = seriousnessVariables('friendly-social', mode)
    const bank = seriousnessVariables('bank-security', mode)
    expect(friendly['--button-primary-bgColor-rest']).toBe(mode === 'dark' ? '#b83b83' : '#b42a78')
    expect(friendly['--bgColor-accent-emphasis']).toBe(mode === 'dark' ? '#d6a5ff' : '#7938b7')
    expect(bank['--button-primary-bgColor-rest']).toBe(bank['--bgColor-muted'])
    expect(bank['--button-default-shadow-resting']).toContain('inset 1px 1px')
    expect(bank['--IssueLabel--backgroundColor']).toBe(bank['--bgColor-muted'])
    expect(bank['--IssueLabel--color']).toBe(bank['--fgColor-default'])
    expect(bank['--borderRadius-medium']).toBe('0px')
    expect(seriousnessVariables('default', mode)).toEqual({})
    expect(seriousnessVariables('relaxed', mode)).not.toHaveProperty('--bgColor-default')
    expect(seriousnessVariables('professional', mode)).not.toHaveProperty('--bgColor-default')
  })
})

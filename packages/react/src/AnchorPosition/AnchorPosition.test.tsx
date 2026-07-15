import {render, screen} from '@testing-library/react'
import {createRef} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {Popover, Root as BasePopoverRoot, Trigger} from '../BasePopover'
import {Anchor, Root, Target} from './AnchorPosition'

describe('AnchorPosition', () => {
  it('connects the anchor and target with a generated CSS anchor name', () => {
    render(
      <Root>
        <Anchor data-testid="anchor">Anchor</Anchor>
        <Target data-testid="target">Target</Target>
      </Root>,
    )

    const anchorName = screen.getByTestId('anchor').style.getPropertyValue('--anchor-position-name')

    expect(anchorName).toMatch(/^--anchor-position-/)
    expect(screen.getByTestId('target').style.getPropertyValue('--anchor-position-name')).toBe(anchorName)
  })

  it('uses a custom CSS anchor name', () => {
    render(
      <Root anchorName="--custom-anchor">
        <Anchor data-testid="anchor">Anchor</Anchor>
        <Target data-testid="target">Target</Target>
      </Root>,
    )

    expect(screen.getByTestId('anchor').style.getPropertyValue('--anchor-position-name')).toBe('--custom-anchor')
    expect(screen.getByTestId('target').style.getPropertyValue('--anchor-position-name')).toBe('--custom-anchor')
  })

  it('applies positioning options to the target', () => {
    render(
      <Root>
        <Anchor>Anchor</Anchor>
        <Target alignment="end" data-testid="target" fallbackStrategy="opposite-side" gap={12} placement="above">
          Target
        </Target>
      </Root>,
    )

    const target = screen.getByTestId('target')

    expect(target).toHaveAttribute('data-alignment', 'end')
    expect(target).toHaveAttribute('data-fallback-strategy', 'opposite-side')
    expect(target).toHaveAttribute('data-placement', 'above')
    expect(target.style.getPropertyValue('--anchor-position-gap')).toBe('12px')
  })

  it('forwards props and refs to polymorphic anchor and target elements', () => {
    const anchorRef = createRef<HTMLButtonElement>()
    const targetRef = createRef<HTMLElement>()

    render(
      <Root>
        <Anchor as="button" className="custom-anchor" ref={anchorRef} type="button">
          Anchor
        </Anchor>
        <Target as="section" aria-label="Target" className="custom-target" ref={targetRef}>
          Target
        </Target>
      </Root>,
    )

    expect(screen.getByRole('button', {name: 'Anchor'})).toHaveClass('custom-anchor')
    expect(screen.getByRole('region')).toHaveClass('custom-target')
    expect(anchorRef.current).toBeInstanceOf(HTMLButtonElement)
    expect(targetRef.current).toBeInstanceOf(HTMLElement)
  })

  it('composes with BasePopover', () => {
    render(
      <BasePopoverRoot>
        <Root>
          <Anchor as={Trigger}>Toggle popover</Anchor>
          <Target as={Popover} data-testid="popover">
            Popover content
          </Target>
        </Root>
      </BasePopoverRoot>,
    )

    const trigger = screen.getByRole('button', {name: 'Toggle popover'})
    const popover = screen.getByTestId('popover')

    expect(trigger).toHaveAttribute('commandfor', popover.id)
    expect(popover).toHaveAttribute('popover', 'auto')
    expect(popover.style.getPropertyValue('--anchor-position-name')).toBe(
      trigger.style.getPropertyValue('--anchor-position-name'),
    )
  })

  it('throws when Anchor or Target are rendered outside Root', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      expect(() => render(<Anchor>Anchor</Anchor>)).toThrow(
        'AnchorPosition components must be used within AnchorPosition.Root',
      )
      expect(() => render(<Target>Target</Target>)).toThrow(
        'AnchorPosition components must be used within AnchorPosition.Root',
      )
    } finally {
      consoleError.mockRestore()
    }
  })
})

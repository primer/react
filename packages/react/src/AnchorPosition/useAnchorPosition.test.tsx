import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {useAnchorPosition} from './useAnchorPosition'

function TestComponent({anchorName}: {anchorName?: `--${string}`}) {
  const {getAnchorProps, getTargetProps} = useAnchorPosition({anchorName})

  return (
    <>
      <button type="button" {...getAnchorProps()}>
        Anchor
      </button>
      <div
        {...getTargetProps({
          alignment: 'end',
          fallbackStrategy: 'opposite-side',
          gap: 12,
          placement: 'above',
        })}
      >
        Target
      </div>
    </>
  )
}

describe('useAnchorPosition', () => {
  it('returns props that connect an anchor and target', () => {
    render(<TestComponent />)

    const anchor = screen.getByRole('button', {name: 'Anchor'})
    const target = screen.getByText('Target')
    const anchorName = anchor.style.getPropertyValue('--anchor-position-name')

    expect(anchorName).toMatch(/^--anchor-position-/)
    expect(target.style.getPropertyValue('--anchor-position-name')).toBe(anchorName)
  })

  it('supports a custom anchor name and target positioning options', () => {
    render(<TestComponent anchorName="--custom-anchor" />)

    const anchor = screen.getByRole('button', {name: 'Anchor'})
    const target = screen.getByText('Target')

    expect(anchor.style.getPropertyValue('--anchor-position-name')).toBe('--custom-anchor')
    expect(target.style.getPropertyValue('--anchor-position-name')).toBe('--custom-anchor')
    expect(target.style.getPropertyValue('--anchor-position-gap')).toBe('12px')
    expect(target).toHaveAttribute('data-alignment', 'end')
    expect(target).toHaveAttribute('data-fallback-strategy', 'opposite-side')
    expect(target).toHaveAttribute('data-placement', 'above')
  })
})

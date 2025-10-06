import {render, waitFor} from '@testing-library/react'
import {it, expect, vi} from 'vitest'
import React from 'react'
import {useAnchoredPosition} from '../../hooks/useAnchoredPosition'

const Component = ({
  callback,
}: {
  callback: ({position}: {position: ReturnType<typeof useAnchoredPosition>['position']}) => void
}) => {
  const floatingElementRef = React.useRef<HTMLDivElement>(null)
  const anchorElementRef = React.useRef<HTMLButtonElement>(null)
  const {position} = useAnchoredPosition({floatingElementRef, anchorElementRef})
  callback({position})
  const floatStyle: React.CSSProperties = {
    position: 'absolute',
    height: '50px',
    width: '50px',
    ...(position
      ? {
          top: position.top,
          left: position.left,
        }
      : {top: '20px', left: '20px'}),
  }
  return (
    <div style={{position: 'absolute'}}>
      <div style={floatStyle} ref={floatingElementRef}>
        Floating element
      </div>
      <button ref={anchorElementRef} type="button">
        Click me
      </button>
    </div>
  )
}

it('should should return a position', async () => {
  const cb = vi.fn()
  render(<Component callback={cb} />)

  await waitFor(() => {
    expect(cb.mock.calls[1][0].position).toMatchSnapshot()
  })
})

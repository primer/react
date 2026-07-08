import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it} from 'vitest'
import {useFocus} from '../useFocus'
import {createRenderCounter} from '../../../utils/testing/profiler'

describe('useFocus', () => {
  it('focuses the element on the next commit', async () => {
    function Demo() {
      const focus = useFocus()
      const [show, setShow] = React.useState(false)
      const inputRef = React.useRef<HTMLInputElement>(null)
      return (
        <>
          {show ? <input ref={inputRef} data-testid="target" /> : null}
          <button
            type="button"
            onClick={() => {
              setShow(true)
              focus(inputRef)
            }}
          >
            show
          </button>
        </>
      )
    }

    render(<Demo />)
    await userEvent.click(screen.getByText('show'))
    expect(screen.getByTestId('target')).toHaveFocus()
  })

  it('does not cause a cascade — one focus call produces exactly one render', async () => {
    // Renders are caused by: initial mount (1), and the single user click that
    // sets visibility + calls focus() (2 — both setState calls are batched).
    // The previous implementation produced an extra render because the effect
    // reset focusTarget to null, triggering a second render.
    const [Wrap, counter] = createRenderCounter()

    function Demo() {
      const focus = useFocus()
      const [show, setShow] = React.useState(false)
      const inputRef = React.useRef<HTMLInputElement>(null)
      return (
        <Wrap>
          <>
            {show ? <input ref={inputRef} data-testid="target" /> : null}
            <button
              type="button"
              onClick={() => {
                setShow(true)
                focus(inputRef)
              }}
            >
              show
            </button>
          </>
        </Wrap>
      )
    }

    render(<Demo />)
    counter.reset()

    await userEvent.click(screen.getByText('show'))

    // Exactly one render from the click — no cascade from useFocus's effect.
    expect(counter.updateCount).toBe(1)
  })

  it('host component is not re-rendered by focus() when version is stable', async () => {
    // The hook should not cause the host component to render more than what
    // the user's own setState triggers. We track function-body executions
    // directly (rather than using <Profiler>) so we count this component
    // specifically rather than any wrapper subtree.
    const countedRender = vi.fn()

    let triggerFocus: (() => void) | null = null

    function Demo() {
      countedRender()
      const focus = useFocus()
      const ref = React.useRef<HTMLInputElement>(null)
      React.useEffect(() => {
        triggerFocus = () => focus(ref.current!)
        return () => {
          triggerFocus = null
        }
      }, [focus])
      return <input ref={ref} data-testid="target" />
    }

    render(<Demo />)
    expect(countedRender).toHaveBeenCalledTimes(1) // initial mount

    await act(async () => {
      triggerFocus!()
    })
    // The host re-renders once because useFocus bumps its internal version state.
    // It must NOT re-render a second time (which the old impl did when resetting state).
    expect(renderCount).toBe(2)
  })
})

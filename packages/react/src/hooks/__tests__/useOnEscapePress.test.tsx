import {render, renderHook} from '@testing-library/react'
import {StrictMode, useCallback, type PropsWithChildren} from 'react'
import {afterAll, it, expect, vi} from 'vitest'
import {userEvent} from 'vitest/browser'
import {useOnEscapePress} from '../../hooks/useOnEscapePress'

afterAll(() => {
  vi.restoreAllMocks()
})

it('should call function when user presses escape', async () => {
  const functionToCall = vi.fn()
  const Component = () => {
    useOnEscapePress(functionToCall)
    return <div>content</div>
  }

  render(<Component />)
  await userEvent.keyboard('{Escape}')
  expect(functionToCall).toHaveBeenCalledTimes(1)
})

it('updates a memoized callback without replacing the document listener', async () => {
  const onEscape = vi.fn()
  const {rerender, unmount} = renderHook(
    ({value}) => {
      const callback = useCallback(() => {
        onEscape(value)
      }, [value])
      useOnEscapePress(callback)
    },
    {
      initialProps: {
        value: 0,
      },
    },
  )
  const addListener = vi.spyOn(document, 'addEventListener')
  const removeListener = vi.spyOn(document, 'removeEventListener')

  rerender({
    value: 1,
  })
  await userEvent.keyboard('{Enter}')
  expect(onEscape).not.toHaveBeenCalled()
  await userEvent.keyboard('{Escape}')
  expect(onEscape).toHaveBeenCalledExactlyOnceWith(1)
  expect(addListener).not.toHaveBeenCalledWith('keydown', expect.any(Function))
  expect(removeListener).not.toHaveBeenCalledWith('keydown', expect.any(Function))

  unmount()
  expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function))
  await userEvent.keyboard('{Escape}')
  expect(onEscape).toHaveBeenCalledTimes(1)
})

it('preserves caller-controlled callback dependencies', async () => {
  const onEscape = vi.fn()
  const {rerender} = renderHook(
    ({value, dependency}) => {
      useOnEscapePress(() => {
        onEscape(value)
      }, [dependency])
    },
    {
      initialProps: {
        value: 0,
        dependency: 0,
      },
    },
  )

  rerender({
    value: 1,
    dependency: 0,
  })
  await userEvent.keyboard('{Escape}')
  expect(onEscape).toHaveBeenLastCalledWith(0)

  rerender({
    value: 2,
    dependency: 1,
  })
  await userEvent.keyboard('{Escape}')
  expect(onEscape).toHaveBeenLastCalledWith(2)
})

it('preserves an explicitly empty callback dependency list', async () => {
  const onEscape = vi.fn()
  const {rerender} = renderHook(
    ({value}) => {
      useOnEscapePress(() => {
        onEscape(value)
      }, [])
    },
    {
      initialProps: {
        value: 0,
      },
    },
  )

  rerender({
    value: 1,
  })
  await userEvent.keyboard('{Escape}')
  expect(onEscape).toHaveBeenCalledExactlyOnceWith(0)
})

it('preserves nested handler priority after rerendering in StrictMode', async () => {
  const calls: Array<string> = []

  function Layer({name, preventDefault, children}: PropsWithChildren<{name: string; preventDefault?: boolean}>) {
    useOnEscapePress(event => {
      calls.push(name)
      if (preventDefault) {
        event.preventDefault()
      }
    })
    return <div>{children}</div>
  }

  function Example({preventDefault}: {preventDefault?: boolean}) {
    return (
      <StrictMode>
        <Layer name="parent">
          <Layer name="child" preventDefault={preventDefault} />
        </Layer>
      </StrictMode>
    )
  }

  const {rerender, unmount} = render(<Example />)
  await userEvent.keyboard('{Escape}')
  expect(calls).toEqual(['child', 'parent'])

  calls.length = 0
  rerender(<Example preventDefault />)
  await userEvent.keyboard('{Escape}')
  expect(calls).toEqual(['child'])

  calls.length = 0
  unmount()
  await userEvent.keyboard('{Escape}')
  expect(calls).toEqual([])
})

import {describe, expect, test, vi} from 'vitest'
import {mergeProps} from '../mergeProps'

describe('mergeProps', () => {
  test('combines props and gives the second value precedence', () => {
    expect(
      mergeProps(
        {
          id: 'component-id',
          role: 'button',
        },
        {
          id: 'consumer-id',
          'aria-label': 'Example',
        },
      ),
    ).toEqual({
      id: 'consumer-id',
      role: 'button',
      'aria-label': 'Example',
    })
  })

  test('merges class names with clsx', () => {
    expect(mergeProps({className: 'component'}, {className: ['consumer', {active: true}]})).toEqual({
      className: 'component consumer active',
    })
  })

  test('shallowly merges styles and gives the second value precedence', () => {
    const componentStyle = {color: 'red', padding: 4}
    const consumerStyle = {color: 'blue'}

    const merged = mergeProps({style: componentStyle}, {style: consumerStyle})

    expect(merged.style).toEqual({color: 'blue', padding: 4})
    expect(componentStyle).toEqual({color: 'red', padding: 4})
    expect(consumerStyle).toEqual({color: 'blue'})
  })

  test('runs event handlers in order', () => {
    const calls: string[] = []
    const event = {defaultPrevented: false}
    const componentHandler = vi.fn((_event: typeof event, _value: string) => calls.push('component'))
    const consumerHandler = vi.fn((_event: typeof event, _value: string) => calls.push('consumer'))

    const merged = mergeProps({onClick: componentHandler}, {onClick: consumerHandler})
    merged.onClick(event, 'value')

    expect(calls).toEqual(['component', 'consumer'])
    expect(componentHandler).toHaveBeenCalledWith(event, 'value')
    expect(consumerHandler).toHaveBeenCalledWith(event, 'value')
  })

  test('does not run the second event handler when the first prevents the event', () => {
    const event = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true
      },
    }
    const componentHandler = vi.fn((currentEvent: typeof event) => {
      currentEvent.preventDefault()
    })
    const consumerHandler = vi.fn()

    const merged = mergeProps({onClick: componentHandler}, {onClick: consumerHandler})
    merged.onClick(event)

    expect(componentHandler).toHaveBeenCalledWith(event)
    expect(consumerHandler).not.toHaveBeenCalled()
  })

  test('composes zero-argument callbacks', () => {
    const componentHandler = vi.fn()
    const consumerHandler = vi.fn()

    const merged = mergeProps({onDismiss: componentHandler}, {onDismiss: consumerHandler})
    merged.onDismiss()

    expect(componentHandler).toHaveBeenCalledOnce()
    expect(consumerHandler).toHaveBeenCalledOnce()
  })
})

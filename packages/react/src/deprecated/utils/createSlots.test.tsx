import {render, waitFor, screen} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import type React from 'react'
import createSlots from './create-slots'

// setup a component with slots
const {Slots, Slot} = createSlots(['One', 'Two', 'Three'])
type Props = {context?: {salutation: string}}

const ComponentWithSlots: React.FC<React.PropsWithChildren<Props>> = ({context, children}) => {
  return (
    <Slots context={context}>
      {slots => (
        <div>
          {slots.One}
          <span>
            {children} {slots.Two} {slots.Three}
          </span>
        </div>
      )}
    </Slots>
  )
}
const SlotItem1: React.FC<React.PropsWithChildren<unknown>> = ({children}) => <Slot name="One">{children}</Slot>
const SlotItem2: React.FC<React.PropsWithChildren<unknown>> = ({children}) => <Slot name="Two">{children}</Slot>
const SlotItem3: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <Slot name="Three">
    {(context: Props['context']) => (
      <>
        {context?.salutation} {children}
      </>
    )}
  </Slot>
)

describe('ComponentWithSlots', () => {
  it('renders all slots', async () => {
    const {container} = render(
      <ComponentWithSlots>
        <SlotItem1>first</SlotItem1>
        <SlotItem2>second</SlotItem2>
        free form
      </ComponentWithSlots>,
    )

    await waitFor(() => screen.getByText('first'))
    expect(screen.getByText('first')).toBeInTheDocument()
    expect(container.textContent).toContain('second')
    expect(container.textContent).toContain('free form')
  })

  it('renders without any slots', async () => {
    const {container} = render(<ComponentWithSlots>free form</ComponentWithSlots>)
    expect(container.textContent).toContain('free form')
  })

  it('renders with just one slot', async () => {
    const {container} = render(
      <ComponentWithSlots>
        <SlotItem1>first</SlotItem1>
        free form
      </ComponentWithSlots>,
    )
    expect(screen.getByText('first')).toBeInTheDocument()
    expect(container.textContent).toContain('free form')
  })

  it('renders with context passed to children', async () => {
    const {container} = render(
      <ComponentWithSlots context={{salutation: 'hi'}}>
        <SlotItem3>third</SlotItem3>
        free form
      </ComponentWithSlots>,
    )
    expect(container.textContent).toContain('hi')
    expect(container.textContent).toContain('third')
    expect(container.textContent).toContain('free form')
  })
})

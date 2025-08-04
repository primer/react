import {render, waitFor} from '@testing-library/react'
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
    const component = render(
      <ComponentWithSlots>
        <SlotItem1>first</SlotItem1>
        <SlotItem2>second</SlotItem2>
        free form
      </ComponentWithSlots>,
    )

    await waitFor(() => component.getByText('first'))
    expect(component.container).toMatchSnapshot()
  })

  it('renders without any slots', async () => {
    const component = render(<ComponentWithSlots>free form</ComponentWithSlots>)
    expect(component.container).toMatchSnapshot()
  })

  it('renders with just one slot', async () => {
    const component = render(
      <ComponentWithSlots>
        <SlotItem1>first</SlotItem1>
        free form
      </ComponentWithSlots>,
    )
    expect(component.container).toMatchSnapshot()
  })

  it('renders with context passed to children', async () => {
    const component = render(
      <ComponentWithSlots context={{salutation: 'hi'}}>
        <SlotItem3>third</SlotItem3>
        free form
      </ComponentWithSlots>,
    )
    expect(component.container).toMatchSnapshot()
  })
})

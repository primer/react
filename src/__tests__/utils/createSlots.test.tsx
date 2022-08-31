import React from 'react'
import {render, waitFor} from '@testing-library/react'
import createSlots from '../../utils/create-slots'

// setup a component with slots
const {useSlots, Slot} = createSlots<'One' | 'Two' | 'Three'>()
type Props = {context?: {salutation: string}}

const ComponentWithSlots: React.FC<React.PropsWithChildren<Props>> = ({children}) => {
  const {SlotsProvider, slots} = useSlots()

  return (
    <SlotsProvider>
      <div>
        {slots.One}
        <span>
          {children} {slots.Two} {slots.Three}
        </span>
      </div>
    </SlotsProvider>
  )
}
const SlotItem1: React.FC<React.PropsWithChildren<unknown>> = ({children}) => <Slot name="One">{children}</Slot>
const SlotItem2: React.FC<React.PropsWithChildren<unknown>> = ({children}) => <Slot name="Two">{children}</Slot>

describe('ComponentWithSlots', () => {
  it('renders all slots', async () => {
    const component = render(
      <ComponentWithSlots>
        <SlotItem1>first</SlotItem1>
        <SlotItem2>second</SlotItem2>
        free form
      </ComponentWithSlots>
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
      </ComponentWithSlots>
    )
    expect(component.container).toMatchSnapshot()
  })
})

import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import type {PopoverProps} from '../Popover'
import Popover from '../Popover'

describe('Popover', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Popover className={'test-class-name'}></Popover>
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  const CARET_POSITIONS: PopoverProps['caret'][] = [
    'top',
    'bottom',
    'left',
    'right',
    'bottom-left',
    'bottom-right',
    'top-left',
    'top-right',
    'left-bottom',
    'left-top',
    'right-bottom',
    'right-top',
  ]

  for (const pos of CARET_POSITIONS) {
    it(`renders correctly for a caret position of ${pos}`, () => {
      const element = (
        <Popover caret={pos} open>
          <Popover.Content>Hello!</Popover.Content>
        </Popover>
      )

      const {container} = render(element)
      expect(container.firstChild).toBeInTheDocument()
    })
  }

  it('renders both elements as a <div>', () => {
    const {container: container1} = render(<Popover />)
    const {container: container2} = render(<Popover.Content />)
    expect(container1.firstChild).toBeInstanceOf(HTMLDivElement)
    expect(container2.firstChild).toBeInstanceOf(HTMLDivElement)
  })
})

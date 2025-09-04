import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Caret from '../internal/components/Caret'
import type {CaretProps} from '../internal/components/Caret'

describe('Caret', () => {
  it('renders <svg>', () => {
    const {container} = render(<Caret />)
    expect(container.firstChild).toHaveProperty('tagName', 'svg')
  })

  it('renders cardinal directions', () => {
    for (const location of ['top', 'right', 'bottom', 'left']) {
      expect(render(<Caret location={location as CaretProps['location']} />)).toMatchSnapshot()
    }
    for (const location of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
      expect(render(<Caret location={location as CaretProps['location']} />)).toMatchSnapshot()
    }
    for (const location of ['left-top', 'left-bottom', 'right-top', 'right-bottom']) {
      expect(render(<Caret location={location as CaretProps['location']} />)).toMatchSnapshot()
    }
  })
})

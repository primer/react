import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Caret from '../Caret'
import type {CaretProps} from '../Caret'

describe('Caret', () => {
  it('renders <svg>', () => {
    const {container} = render(<Caret />)
    expect(container.firstChild).toHaveProperty('tagName', 'svg')
  })

  it('renders cardinal directions', () => {
    for (const location of ['top', 'right', 'bottom', 'left']) {
      const {container} = HTMLRender(render(<Caret location={location as CaretProps['location']} />))
      expect(container.firstChild).toBeInTheDocument()
    }
    for (const location of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
      const {container} = HTMLRender(render(<Caret location={location as CaretProps['location']} />))
      expect(container.firstChild).toBeInTheDocument()
    }
    for (const location of ['left-top', 'left-bottom', 'right-top', 'right-bottom']) {
      const {container} = HTMLRender(render(<Caret location={location as CaretProps['location']} />))
      expect(container.firstChild).toBeInTheDocument()
    }
  })
})

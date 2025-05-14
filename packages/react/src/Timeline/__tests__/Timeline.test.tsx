import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Timeline from '..'

describe('Timeline', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<Timeline className={'test-class-name'} />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })

  it('renders with clipSidebar prop', () => {
    const {container} = render(<Timeline clipSidebar />)
    expect(container).toMatchSnapshot()
  })
})

describe('Timeline.Item', () => {
  it('renders with condensed prop', () => {
    const {container} = render(<Timeline.Item condensed />)
    expect(container).toMatchSnapshot()
  })

  it('adds the Timeline-Item class', () => {
    const {container} = render(<Timeline.Item />)
    expect(container.firstChild).toHaveClass('Timeline-Item')
  })

  it('should support `className` on the outermost element', () => {
    const {container} = render(<Timeline.Item className={'test-class-name'} />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })
})

describe('Timeline.Badge', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<Timeline.Badge className={'test-class-name'} />)
    expect(container.firstChild?.firstChild).toHaveClass('test-class-name')
  })
})

describe('Timeline.Body', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<Timeline.Body className={'test-class-name'} />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })
})

describe('Timeline.Break', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<Timeline.Break className={'test-class-name'} />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })
})

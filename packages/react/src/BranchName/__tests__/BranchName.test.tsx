import BranchName from '../BranchName'
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('BranchName', () => {
  it('renders an <a> by default', () => {
    const {container} = HTMLRender(<BranchName href="#" />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <BranchName as="span" className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders an <span> by default', () => {
    const {container} = HTMLRender(<BranchName />)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
  })

  it('requires href when as="a"', () => {
    // @ts-expect-error - href is required when as="a"
    const Element = () => <BranchName as="a" />
    expect(HTMLRender(<Element />).container.firstChild?.nodeName).toEqual('A')
  })

  it('does not allow href when as="span"', () => {
    // @ts-expect-error - href is required when as="a"
    const Element = () => <BranchName as="span" href="" />
    expect(HTMLRender(<Element />).container.firstChild?.nodeName).toEqual('SPAN')
  })
})

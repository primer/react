import BranchName from '../BranchName'
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import classes from '../BranchName.module.css'
import {implementsClassName} from '../../utils/testing'

describe('BranchName', () => {
  implementsClassName(BranchName, classes.BranchName)
  it('renders an <a> by default', () => {
    const {container} = HTMLRender(<BranchName />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <BranchName className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })
})

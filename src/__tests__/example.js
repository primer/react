import React from 'react'
// 1. uncomment this line and change "SomeComponent"
// import SomeComponent from '../SomeComponent'
import {colors} from '../theme'
import {render, renderStyles} from '../utils/testing'
import {COMMON} from '../constants'

// 2. remove this definition; it's just for eslint
function SomeComponent() {}

// 3. remove the leading "x" from this line to enable the test
describe.skip('SomeComponent', () => {
  // if applicable, ensure that this is a "system component"
  it('is a system component', () => {
    expect(SomeComponent.systemComponent).toBe(true)
  })

  // ensure that it implements common props
  it('implements common system props', () => {
    expect(SomeComponent).toImplementSystemProps(COMMON)
  })

  it('matches the snapshot', () => {
    expect(render(<SomeComponent />)).toMatchSnapshot()
  })

  // this is generally how you test that a prop renders one or more styles
  it('renders "x" prop into styles', () => {
    // use the .toMatchKeys() to test a subset of the rendered styles
    expect(renderStyles(<SomeComponent scheme="green" />)).toMatchKeys({
      'background-color': colors.green[5]
    })

    // or use .toEqual() if:
    // * your component shouldn't render any other styles; or
    // * you know the other ("base") styles that your component should
    //   render, and you can spread them into the result
    const defaultStyles = {
      color: colors.bodytext
    }
    expect(renderStyles(<SomeComponent scheme="green" />)).toEqual({
      ...defaultStyles,
      'background-color': colors.green[5]
    })
  })
})

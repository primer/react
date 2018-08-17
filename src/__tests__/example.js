import React from 'react'
// 1. uncomment this line and change "SomeComponent"
// import SomeComponent from '../SomeComponent'
import theme from '../theme'
import {render, renderStyles} from '../utils/testing'
import {COMMON} from '../system-props'

// 2. remove the leading "x" from this line to enable the test
xdescribe('SomeComponent', () => {

  // if applicable, ensure that this is a "system component"
  it('is a system component', () => {
    expect(SomeComponent.systemComponent).toBe(true)
  })

  // ensure that it implements common props
  it('implements common system props', () => {
    expect(SomeComponent).toImplementSystemProps(COMMON)
  })

  // this is generally how you test that a prop renders one or more styles
  it('renders "x" prop into styles', () => {
    expect(renderStyles(<SomeComponent scheme="green" />)).toMatchKeys({
      'background-color': theme.colors.green[5]
    })
  })

})

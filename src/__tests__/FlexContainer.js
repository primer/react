import React from 'react'
import FlexContainer from '../FlexContainer'
import {renderClasses} from '../utils/testing'

describe('FlexContainer', () => {
  it('renders wrap classes', () => {
    expect(renderClasses(<FlexContainer wrap="nowrap" />)).toEqual(['flex-nowrap', 'd-flex'])
  })

  it('renders direction classes', () => {
    expect(renderClasses(<FlexContainer direction="row" />)).toEqual(['flex-row', 'd-flex'])
  })

  it('renders justifyContent classes', () => {
    expect(renderClasses(<FlexContainer justifyContent="start" />)).toEqual(['flex-justify-start', 'd-flex'])
  })

  it('renders alignItems classes', () => {
    expect(renderClasses(<FlexContainer alignItems="start" />)).toEqual(['flex-items-start', 'd-flex'])
  })

  it('renders alignContent classes', () => {
    expect(renderClasses(<FlexContainer alignContent="start" />)).toEqual(['flex-content-start', 'd-flex'])
  })

  it('renders display classes', () => {
    expect(renderClasses(<FlexContainer display="inline-flex" />)).toEqual(['d-inline-flex'])
  })

  it('respects the "inline" prop', () => {
    expect(renderClasses(<FlexContainer inline />)).toEqual(['d-inline-flex'])
  })

  it('renders responsive display classes', () => {
    expect(renderClasses(<FlexContainer display={['flex', 'inline-flex']} />)).toEqual(['d-flex', 'd-sm-inline-flex'])
  })
})

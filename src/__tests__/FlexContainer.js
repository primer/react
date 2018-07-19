import React from 'react'
import FlexContainer from '../FlexContainer'
import {renderClasses} from '../utils/testing'

it('FlexContainer renders wrap classes', () => {
  expect(renderClasses(<FlexContainer wrap="nowrap" />)).toEqual(['flex-nowrap', 'd-flex'])
})

it('FlexContainer renders direction classes', () => {
  expect(renderClasses(<FlexContainer direction="row" />)).toEqual(['flex-row', 'd-flex'])
})

it('FlexContainer renders justifyContent classes', () => {
  expect(renderClasses(<FlexContainer justifyContent="start" />)).toEqual(['flex-justify-start', 'd-flex'])
})

it('FlexContainer renders alignItems classes', () => {
  expect(renderClasses(<FlexContainer alignItems="start" />)).toEqual(['flex-items-start', 'd-flex'])
})

it('FlexContainer renders alignContent classes', () => {
  expect(renderClasses(<FlexContainer alignContent="start" />)).toEqual(['flex-content-start', 'd-flex'])
})

it('FlexContainer renders display classes', () => {
  expect(renderClasses(<FlexContainer display="inline-flex" />)).toEqual(['d-inline-flex'])
})

it('FlexContainer renders responsive display classes', () => {
  expect(renderClasses(<FlexContainer display={["flex","inline-flex"]} />)).toEqual(['d-flex', 'd-sm-inline-flex'])
})

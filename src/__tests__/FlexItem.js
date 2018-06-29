import React from 'react'
import FlexItem from '../FlexItem'
import {renderClasses} from '../utils/testing'

it('FlexItem renders alignSelf classes', () => {
  expect(renderClasses(<FlexItem alignSelf={'center'} />)).toEqual(['flex-self-center'])
})

it('FlexItem renders flexAuto class', () => {
  expect(renderClasses(<FlexItem flexAuto />)).toEqual(['flex-auto'])
})

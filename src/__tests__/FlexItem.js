import React from 'react'
import FlexItem from '../FlexItem'
import {render, renderClasses} from '../utils/testing'

it('FlexItem renders alignSelf classes', () => {
  expect(renderClasses(<FlexItem alignSelf={'center'} />)).toEqual(['flex-self-center'])
})

it('FlexItem renders flexAuto class', () => {
  expect(renderClasses(<FlexItem flexAuto />)).toEqual(['flex-auto'])
})

it('FlexItem renders as correct tag', () => {
  expect(
    render(
      <FlexItem tag="button" alignSelf="center">
        hi
      </FlexItem>
    )
  ).toEqual(render(<button className="flex-self-center">hi</button>))
})

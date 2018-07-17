import React from 'react'
import FlexItem from '../FlexItem'
import {render, renderClasses, rendersClass} from '../utils/testing'

describe('FlexItem', () => {
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

  it('respects margin utility prop', () => {
    expect(rendersClass(<FlexItem m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<FlexItem p={4} />, 'p-4')).toEqual(true)
  })
})

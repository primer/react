import {act, render} from '@testing-library/react'
import MatchMediaMock from 'jest-matchmedia-mock'
import type {ResponsiveValue} from '../../hooks/useResponsiveValue'
import {useResponsiveValue, viewportRanges} from '../../hooks/useResponsiveValue'
import React from 'react'

let matchMedia: MatchMediaMock

beforeAll(() => {
  matchMedia = new MatchMediaMock()
})

afterEach(() => {
  matchMedia.clear()
})

it('accepts non-responsive values', () => {
  const Component = () => {
    const value = useResponsiveValue('test', 'fallback')
    return <div>{value}</div>
  }

  const {getByText} = render(<Component />)

  expect(getByText('test')).toBeInTheDocument()
})

it('returns narrow value when viewport is narrow', () => {
  const Component = () => {
    const value = useResponsiveValue({narrow: false, regular: true} as ResponsiveValue<boolean>, true)
    return <div>{JSON.stringify(value)}</div>
  }

  // Set narrow viewport
  act(() => {
    matchMedia.useMediaQuery(viewportRanges.narrow)
  })

  const {getByText} = render(<Component />)

  expect(getByText('false')).toBeInTheDocument()
})

it('returns wide value when viewport is wide', () => {
  const Component = () => {
    const value = useResponsiveValue(
      {narrow: 'narrowValue', regular: 'regularValue', wide: 'wideValue'} as ResponsiveValue<string>,
      'fallbackValue',
    )
    return <div>{value}</div>
  }

  // Set wide viewport
  act(() => {
    matchMedia.useMediaQuery(viewportRanges.wide)
  })

  const {getByText} = render(<Component />)

  expect(getByText('wideValue')).toBeInTheDocument()
})

it('returns regular value when viewport is regular', () => {
  const Component = () => {
    const value = useResponsiveValue(
      {narrow: 'narrowValue', regular: 'regularValue', wide: 'wideValue'} as ResponsiveValue<string>,
      'fallbackValue',
    )
    return <div>{value}</div>
  }

  // Set regular viewport
  act(() => {
    matchMedia.useMediaQuery(viewportRanges.regular)
  })

  const {getByText} = render(<Component />)

  expect(getByText('regularValue')).toBeInTheDocument()
})

it('returns fallback when no value is defined for current viewport', () => {
  const Component = () => {
    const value = useResponsiveValue(
      // Missing value for `regular` viewports
      {narrow: 'narrowValue', wide: 'wideValue'} as ResponsiveValue<string>,
      'fallbackValue',
    )
    return <div>{value}</div>
  }

  // Set regular viewport
  act(() => {
    matchMedia.useMediaQuery(viewportRanges.regular)
  })

  const {getByText} = render(<Component />)

  expect(getByText('fallbackValue')).toBeInTheDocument()
})

import {act, render, renderHook} from '@testing-library/react'
import {expect, it} from 'vitest'
import type {ResponsiveValue} from '../../hooks/useResponsiveValue'
import {useResponsiveValue} from '../../hooks/useResponsiveValue'
import {page} from 'vitest/browser'

it('accepts non-responsive values', () => {
  const Component = () => {
    const value = useResponsiveValue('test', 'fallback')
    return <div>{value}</div>
  }

  const {getByText} = render(<Component />)

  expect(getByText('test')).toBeInTheDocument()
})

it('preserves null as a non-responsive value instead of using the fallback', () => {
  const {result} = renderHook(() => useResponsiveValue(null, 'fallback'))

  expect(result.current).toBeNull()
})

it('can switch between responsive values and null', async () => {
  await act(async () => {
    await page.viewport(1000, 600)
  })

  const {result, rerender} = renderHook(
    ({value}: {value: ResponsiveValue<string> | null}) => useResponsiveValue(value, 'fallback'),
    {initialProps: {value: {regular: 'regularValue'} as ResponsiveValue<string> | null}},
  )

  expect(result.current).toBe('regularValue')

  rerender({value: null})
  expect(result.current).toBeNull()

  rerender({value: {regular: 'updatedValue'}})
  expect(result.current).toBe('updatedValue')
})

it('returns narrow value when viewport is narrow', async () => {
  const Component = () => {
    const value = useResponsiveValue({narrow: false, regular: true} as ResponsiveValue<boolean>, true)
    return <div>{JSON.stringify(value)}</div>
  }

  // Set narrow viewport
  await act(async () => {
    await page.viewport(600, 600)
  })

  const {getByText} = render(<Component />)

  expect(getByText('false')).toBeInTheDocument()
})

it('returns wide value when viewport is wide', async () => {
  const Component = () => {
    const value = useResponsiveValue(
      {narrow: 'narrowValue', regular: 'regularValue', wide: 'wideValue'} as ResponsiveValue<string>,
      'fallbackValue',
    )
    return <div>{value}</div>
  }

  // Set wide viewport
  await act(async () => {
    await page.viewport(1400, 600)
  })

  const {getByText} = render(<Component />)

  expect(getByText('wideValue')).toBeInTheDocument()
})

it('returns regular value when viewport is regular', async () => {
  const Component = () => {
    const value = useResponsiveValue(
      {narrow: 'narrowValue', regular: 'regularValue', wide: 'wideValue'} as ResponsiveValue<string>,
      'fallbackValue',
    )
    return <div>{value}</div>
  }

  // Set regular viewport
  await act(async () => {
    await page.viewport(1000, 600)
  })

  const {getByText} = render(<Component />)

  expect(getByText('regularValue')).toBeInTheDocument()
})

it('returns fallback when no value is defined for current viewport', async () => {
  const Component = () => {
    const value = useResponsiveValue(
      // Missing value for `regular` viewports
      {narrow: 'narrowValue', wide: 'wideValue'} as ResponsiveValue<string>,
      'fallbackValue',
    )
    return <div>{value}</div>
  }

  // Set regular viewport
  await act(async () => {
    await page.viewport(1000, 600)
  })

  const {getByText} = render(<Component />)

  expect(getByText('fallbackValue')).toBeInTheDocument()
})

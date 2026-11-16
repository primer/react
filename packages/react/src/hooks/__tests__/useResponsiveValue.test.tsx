import {act, render} from '@testing-library/react'
import {expect, it} from 'vitest'
import type {ResponsiveValue} from '../../hooks/useResponsiveValue'
import {useResponsiveValue} from '../../hooks/useResponsiveValue'
import {page} from 'vitest/browser'

it('accepts non-responsive values', async () => {
  const Component = () => {
    const value = useResponsiveValue('test', 'fallback')
    return <div>{value}</div>
  }

  render(<Component />)

  await expect.element(page.getByText('test', {exact: true})).toBeInTheDocument()
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

  render(<Component />)

  await expect.element(page.getByText('false', {exact: true})).toBeInTheDocument()
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

  render(<Component />)

  await expect.element(page.getByText('wideValue', {exact: true})).toBeInTheDocument()
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

  render(<Component />)

  await expect.element(page.getByText('regularValue', {exact: true})).toBeInTheDocument()
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

  render(<Component />)

  await expect.element(page.getByText('fallbackValue', {exact: true})).toBeInTheDocument()
})

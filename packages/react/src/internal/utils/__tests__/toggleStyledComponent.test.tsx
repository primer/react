import React from 'react'
import {render} from '@testing-library/react'
import {FeatureFlags} from '../../../FeatureFlags'
import {toggleStyledComponent} from '../toggleStyledComponent'
import styled from 'styled-components'

describe('toggleStyledComponent', () => {
  test('renders the component as `defaultAs` when flag is enabled and no `as` prop is provided', () => {
    const TestComponent = toggleStyledComponent('testFeatureFlag', 'span', ({as: BaseComponent = 'div'}) => (
      <BaseComponent />
    ))
    const {container} = render(
      <FeatureFlags flags={{testFeatureFlag: true}}>
        <TestComponent />
      </FeatureFlags>,
    )
    expect(container.firstChild).toBeInstanceOf(HTMLSpanElement)
  })

  test('renders the component as `defaultAs` when flag is disabled and no `as` prop is provided', () => {
    const TestComponent = toggleStyledComponent('testFeatureFlag', 'span', ({as: BaseComponent = 'div'}) => (
      <BaseComponent />
    ))
    const {container} = render(
      <FeatureFlags flags={{testFeatureFlag: false}}>
        <TestComponent />
      </FeatureFlags>,
    )
    expect(container.firstChild).toBeInstanceOf(HTMLSpanElement)
  })

  test('renders the `as` prop when flag is enabled', () => {
    const TestComponent = toggleStyledComponent('testFeatureFlag', 'div', () => <div />)
    const {container} = render(
      <FeatureFlags flags={{testFeatureFlag: true}}>
        <TestComponent as="button" />
      </FeatureFlags>,
    )
    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement)
  })

  test('renders a div as fallback when flag is enabled and no `as` prop is provided', () => {
    const TestComponent = toggleStyledComponent('testFeatureFlag', 'div', () => <div />)
    const {container} = render(
      <FeatureFlags flags={{testFeatureFlag: true}}>
        <TestComponent />
      </FeatureFlags>,
    )
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement)
  })

  test('renders Box with `as` if `sx` is provided and flag is enabled', () => {
    const TestComponent = toggleStyledComponent('testFeatureFlag', 'div', () => styled.div``)
    const {container} = render(
      <FeatureFlags flags={{testFeatureFlag: true}}>
        <TestComponent as="button" sx={{color: 'red'}} />
      </FeatureFlags>,
    )

    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement)
    expect(container.firstChild).toHaveStyle('color: red')
  })

  test('renders styled component when flag is disabled', () => {
    const StyledComponent = toggleStyledComponent('testFeatureFlag', 'div', styled.div.attrs({['data-styled']: true})``)
    const {container} = render(
      <FeatureFlags flags={{testFeatureFlag: false}}>
        <StyledComponent />
      </FeatureFlags>,
    )
    expect(container.firstChild).toHaveAttribute('data-styled')
  })
})

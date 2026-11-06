import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import Label from '../Label'
import {implementsClassName} from '../utils/testing'
import classes from './Label.module.css'

describe('Label', () => {
  implementsClassName(Label, classes.Label)

  it('renders data-component="Label" on the root element', async () => {
    render(<Label>Default</Label>)
    await expect.element(page.getByText('Default', {exact: true})).toHaveAttribute('data-component', 'Label')
  })

  it('renders text node child', () => {
    render(<Label>Default</Label>)
    expect(page.getByText('Default', {exact: true}).element().textContent).toEqual('Default')
  })
  it('default size is rendered as "small"', async () => {
    render(<Label>Default</Label>)

    // Expect the label to have the default size
    await expect.element(page.getByText('Default', {exact: true})).toHaveAttribute('data-size', 'small')
  })
  it('default variant is rendered as "default"', async () => {
    render(<Label>Default</Label>)

    await expect.element(page.getByText('Default', {exact: true})).toHaveAttribute('data-variant', 'default')
  })
})

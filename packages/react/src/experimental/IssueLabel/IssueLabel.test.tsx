import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {IssueLabel} from '../IssueLabel'
import {implementsClassName} from '../../utils/testing'
import classes from './IssueLabel.module.css'

describe('IssueLabel', () => {
  implementsClassName(IssueLabel, classes.IssueLabel)

  it('should default to a `span`', () => {
    render(<IssueLabel>Label</IssueLabel>)
    expect(page.getByText('Label').element()).toHaveProperty('tagName', 'SPAN')
  })

  it('should default to a `button` when `onClick` is provided', () => {
    render(<IssueLabel onClick={() => {}}>Label</IssueLabel>)
    expect(page.getByRole('button', {name: 'Label'}).element()).toHaveProperty('tagName', 'BUTTON')
  })

  it('should default to an `a` when `href` is provided', () => {
    render(<IssueLabel href="https://example.com">Label</IssueLabel>)
    expect(page.getByRole('link', {name: 'Label'}).element()).toHaveProperty('tagName', 'A')
  })

  it('should render as a custom element when `as` prop is provided', () => {
    render(<IssueLabel as="div">Label</IssueLabel>)
    expect(page.getByText('Label').element()).toHaveProperty('tagName', 'DIV')
  })

  it('should accept a custom `fillColor` for dynamic colors', () => {
    render(
      <IssueLabel data-testid="issue-label" fillColor="#59B200">
        Label
      </IssueLabel>,
    )

    const style = window.getComputedStyle(page.getByTestId('issue-label').element())

    expect(style.getPropertyValue('--label-bgColor-rest')).toBeDefined()
    expect(style.getPropertyValue('--label-bgColor-hover')).toBeDefined()
    expect(style.getPropertyValue('--label-bgColor-active')).toBeDefined()
    expect(style.getPropertyValue('--label-fgColor')).toBeDefined()
    expect(style.getPropertyValue('--label-fgColor-hover')).toBeDefined()
    expect(style.getPropertyValue('--label-fgColor-active')).toBeDefined()
  })

  it('should support `className` on outermost element', async () => {
    render(<IssueLabel className="custom-class">Label</IssueLabel>)
    await expect.element(page.getByText('Label')).toHaveClass('custom-class')
  })

  it('should support merging `style` on outermost element', async () => {
    render(<IssueLabel style={{color: 'red', backgroundColor: 'blue'}}>Label</IssueLabel>)
    await expect.element(page.getByText('Label')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(0, 0, 255)',
    })
  })

  it('should support passing extra props to the outermost element', async () => {
    render(<IssueLabel data-testid="label">Label</IssueLabel>)
    await expect.element(page.getByText('Label')).toHaveAttribute('data-testid', 'label')
  })
})

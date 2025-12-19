import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {IssueLabel} from '../IssueLabel'
import {implementsClassName} from '../../utils/testing'
import classes from './IssueLabel.module.css'

describe('IssueLabel', () => {
  implementsClassName(IssueLabel, classes.IssueLabel)

  it('should default to a `span`', () => {
    const {container} = render(<IssueLabel>Label</IssueLabel>)
    expect(container.firstChild).toHaveProperty('tagName', 'SPAN')
  })

  it('should default to a `button` when `onClick` is provided', () => {
    const {container} = render(<IssueLabel onClick={() => {}}>Label</IssueLabel>)
    expect(container.firstChild).toHaveProperty('tagName', 'BUTTON')
  })

  it('should default to an `a` when `href` is provided', () => {
    const {container} = render(<IssueLabel href="https://example.com">Label</IssueLabel>)
    expect(container.firstChild).toHaveProperty('tagName', 'A')
  })

  it('should render as a custom element when `as` prop is provided', () => {
    const {container} = render(<IssueLabel as="div">Label</IssueLabel>)
    expect(container.firstChild).toHaveProperty('tagName', 'DIV')
  })

  it('should accept a custom `fillColor` for dynamic colors', () => {
    render(
      <IssueLabel data-testid="issue-label" fillColor="#59B200">
        Label
      </IssueLabel>,
    )

    const style = window.getComputedStyle(screen.getByTestId('issue-label'))

    expect(style.getPropertyValue('--label-bgColor-rest')).toBeDefined()
    expect(style.getPropertyValue('--label-bgColor-hover')).toBeDefined()
    expect(style.getPropertyValue('--label-bgColor-active')).toBeDefined()
    expect(style.getPropertyValue('--label-fgColor')).toBeDefined()
    expect(style.getPropertyValue('--label-fgColor-hover')).toBeDefined()
    expect(style.getPropertyValue('--label-fgColor-active')).toBeDefined()
  })

  it('should support `className` on outermost element', () => {
    const {container} = render(<IssueLabel className="custom-class">Label</IssueLabel>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should support merging `style` on outermost element', () => {
    const {container} = render(<IssueLabel style={{color: 'red', backgroundColor: 'blue'}}>Label</IssueLabel>)
    expect(container.firstChild).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(0, 0, 255)',
    })
  })

  it('should support passing extra props to the outermost element', () => {
    const {container} = render(<IssueLabel data-testid="label">Label</IssueLabel>)
    expect(container.firstChild).toHaveAttribute('data-testid', 'label')
  })
})

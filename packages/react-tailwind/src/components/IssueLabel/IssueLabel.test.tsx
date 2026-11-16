import {render, screen} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {IssueLabel} from './IssueLabel'

it('uses a link when href is supplied', () => {
  render(
    <IssueLabel href="/labels/bug" variant="red">
      bug
    </IssueLabel>,
  )
  expect(screen.getByRole('link', {name: 'bug'})).toHaveAttribute('data-variant', 'red')
})

it('uses a non-submitting button when an onClick handler is supplied', () => {
  render(<IssueLabel onClick={vi.fn()}>bug</IssueLabel>)

  expect(screen.getByRole('button', {name: 'bug'})).toHaveAttribute('type', 'button')
})

it('selects a readable foreground for custom fill colors', () => {
  const {container, rerender} = render(<IssueLabel fillColor="#59B200">bug</IssueLabel>)
  const label = container.firstElementChild
  expect(label).toHaveStyle({backgroundColor: '#59B200', color: '#000'})

  rerender(<IssueLabel fillColor="#0366d6">bug</IssueLabel>)
  expect(label).toHaveStyle({backgroundColor: '#0366d6', color: '#fff'})
})

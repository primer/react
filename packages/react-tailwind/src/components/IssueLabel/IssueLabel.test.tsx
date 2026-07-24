import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {IssueLabel} from './IssueLabel'
it('uses a link when href is supplied', () => {
  render(
    <IssueLabel href="/labels/bug" variant="red">
      bug
    </IssueLabel>,
  )
  expect(screen.getByRole('link', {name: 'bug'})).toHaveAttribute('data-variant', 'red')
})

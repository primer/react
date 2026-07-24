import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {Card, CardHeading} from './Card'
it('labels section cards from a composed heading without reordering children', () => {
  render(
    <Card aria-label="Project" as="section">
      <p>First</p>
      <CardHeading>Project</CardHeading>
    </Card>,
  )
  expect(screen.getByRole('region', {name: 'Project'})).toHaveTextContent('FirstProject')
  expect(screen.getByRole('region').firstChild?.nodeName).toBe('P')
})

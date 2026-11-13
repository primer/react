import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {Blankslate, BlankslateHeading, BlankslatePrimaryAction, BlankslateVisual} from './Blankslate'
it('marks visuals decorative and preserves heading semantics', () => {
  render(
    <Blankslate border size="small">
      <BlankslateVisual data-testid="visual">◎</BlankslateVisual>
      <BlankslateHeading as="h3">No results</BlankslateHeading>
    </Blankslate>,
  )
  expect(screen.getByTestId('visual')).toHaveAttribute('aria-hidden', 'true')
  expect(screen.getByRole('heading', {level: 3})).toHaveTextContent('No results')
})

it('forwards anchor props from primary actions', () => {
  render(
    <Blankslate>
      <BlankslatePrimaryAction aria-label="Open settings" data-testid="action" href="/settings">
        Settings
      </BlankslatePrimaryAction>
    </Blankslate>,
  )

  expect(screen.getByTestId('action')).toHaveAttribute('href', '/settings')
  expect(screen.getByRole('link', {name: 'Open settings'})).toBeInTheDocument()
})

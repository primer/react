import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Button} from '../Button'
import {Details} from './Details'

describe('Details', () => {
  it('retains native disclosure keyboard behavior and forwards root props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDetailsElement>()
    render(
      <Details ref={ref} data-testid="details">
        <Button block nativeButton={false} render={<Details.Summary />}>
          More
        </Button>
        <div>Content</div>
      </Details>,
    )
    await user.click(screen.getByText('More'))
    expect(screen.getByTestId('details')).toHaveAttribute('open')
    expect(ref.current).toBe(screen.getByTestId('details'))
    expect(screen.getByText('More').closest('summary')).not.toBeNull()
  })

  it('supports a native summary without exposing the disclosure marker', () => {
    const {container} = render(
      <Details data-testid="details">
        <summary>More</summary>
        <div>Content</div>
      </Details>,
    )

    expect(container.querySelector('details')).toHaveClass(
      'primer:[&>summary]:list-none',
      'primer:[&>summary::-webkit-details-marker]:hidden',
    )
  })
})

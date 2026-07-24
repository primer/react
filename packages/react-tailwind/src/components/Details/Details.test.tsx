import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Details} from './Details'

describe('Details', () => {
  it('retains native disclosure keyboard behavior and forwards root props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDetailsElement>()
    render(
      <Details ref={ref} data-testid="details">
        <Details.Summary>More</Details.Summary>
        <div>Content</div>
      </Details>,
    )
    await user.click(screen.getByText('More'))
    expect(screen.getByTestId('details')).toHaveAttribute('open')
    expect(ref.current).toBe(screen.getByTestId('details'))
    expect(screen.getByText('More').tagName).toBe('SUMMARY')
  })
})

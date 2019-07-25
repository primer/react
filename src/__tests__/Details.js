/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react'
import Details from '../Details'
import {mount, render} from '../utils/testing'
import {COMMON} from '../constants'
import { render as hooksRender, fireEvent, getByTestId} from '@testing-library/react'

describe('Details', () => {
  it('implements system props', () => {
    expect(Details).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Details).toSetDefaultTheme()
  })

  it('Can be toggled', () => {
    const { container } = hooksRender(
      <Details open={false} data-testid='details'>
        {({open}) => <summary data-testid='summary'>{open ? 'open' : 'closed'}</summary>}
      </Details>
    )
    const summary = getByTestId(container, 'summary');
    expect(summary.textContent).toBe('closed');
    fireEvent(summary,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
    expect(getByTestId(container, 'summary').textContent).toBe('open');
  })
})

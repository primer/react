/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import Octicon, {Zap} from '@github/octicons-react'
import CircleBadge from '../CircleBadge'
import {render, renderClasses} from '../utils/testing'

describe('CircleBadge', () => {
  it('renders medium by default', () => {
    expect(renderClasses(<CircleBadge />)).toEqual(['CircleBadge', 'CircleBadge--medium'])
  })
  it('respects src prop', () => {
    expect(render(<CircleBadge src="primer.jpg" />)).toEqual(
      render(
        <div className="CircleBadge CircleBadge--medium">
          <img className="CircleBadge-icon" alt="" src="primer.jpg" />
        </div>
      )
    )
  })
  it('respects tag prop', () => {
    expect(render(<CircleBadge tag="a" src="primer.jpg" />)).toEqual(
      render(
        <a className="CircleBadge CircleBadge--medium">
          <img className="CircleBadge-icon" alt="" src="primer.jpg" />
        </a>
      )
    )
  })
  it('applies alt text', () => {
    expect(render(<CircleBadge alt="primer logo" src="primer.jpg" />)).toEqual(
      render(
        <div className="CircleBadge CircleBadge--medium">
          <img className="CircleBadge-icon" alt="primer logo" src="primer.jpg" />
        </div>
      )
    )
  })
  it('applies title', () => {
    expect(render(<CircleBadge tag="a" title="primer logo" src="primer.jpg" />)).toEqual(
      render(
        <a title="primer logo" className="CircleBadge CircleBadge--medium">
          <img className="CircleBadge-icon" alt="" src="primer.jpg" />
        </a>
      )
    )
  })
  it('adds bg class', () => {
    expect(renderClasses(<CircleBadge bg="blue" />)).toEqual(['CircleBadge', 'CircleBadge--medium', 'bg-blue'])
  })
  it('renders children', () => {
    expect(
      render(
        <CircleBadge>
          <Octicon icon={Zap} />
        </CircleBadge>
      )
    ).toEqual(
      render(
        <div className="CircleBadge CircleBadge--medium">
          <div className="CircleBadge-icon">
            <svg
              aria-hidden="true"
              aria-label={undefined}
              className="octicon"
              height={16}
              role="img"
              viewBox="0 0 10 16"
              width={10}
              style={{
                display: 'inline-block',
                fill: 'currentColor',
                userSelect: 'none',
                verticalAlign: 'text-bottom'
              }}
            >
              <path fillRule="evenodd" d="M10 7H6l3-7-9 9h4l-3 7 9-9z" />
            </svg>
          </div>
        </div>
      )
    )
  })
})

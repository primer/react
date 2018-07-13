/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import Octicon, {Zap} from '@githubprimer/octicons-react'
import CircleBadge from '../CircleBadge'
import {render, renderClasses} from '../utils/testing'

const rendersClass = (node, klass) => renderClasses(node).includes(klass)

const img = <img className="CircleBadge-icon" alt="" src="primer.jpg" />

describe('CircleBadge', () => {
  it('renders medium by default', () => {
    expect(rendersClass(<CircleBadge />, 'CircleBadge--medium')).toEqual(true)
  })
  it('respects tag prop', () => {
    expect(render(<CircleBadge tag="a">{img}</CircleBadge>)).toEqual(
      render(<a className="CircleBadge CircleBadge--medium">{img}</a>))
  })
  it('applies title', () => {
    expect(render(<CircleBadge tag="a" title="primer logo">{img}</CircleBadge>).props['title']).toEqual('primer logo')
  })
  it('adds bg class', () => {
    expect(rendersClass(<CircleBadge bg="blue" />, 'bg-blue')).toEqual(true)
  })
})

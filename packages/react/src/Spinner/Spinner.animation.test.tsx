import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Spinner from '.'
import classes from './Spinner.module.css'

describe('Spinner animation', () => {
  it('applies the rotation animation to a centered SVG group', () => {
    const {container} = render(<Spinner />)
    const svg = container.querySelector('svg')
    const animatedGroup = svg?.querySelector('g')

    expect(animatedGroup).toHaveClass(classes.SpinnerAnimation)
    expect(animatedGroup?.querySelector('circle')).toBeInTheDocument()
    expect(animatedGroup?.querySelector('path')).toBeInTheDocument()
    expect(svg).not.toHaveClass(classes.SpinnerAnimation)
  })
})

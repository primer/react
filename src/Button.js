import classnames from 'classnames'
import styled, {css} from 'styled-components'
import {
  space,
  width,
  fontSize,
  fontWeight,
  theme,
} from 'styled-system'

import {
  color,
  black,
  white,
  lighten,
  darken,
  desaturate,
  mix,
  rgba,
} from './utils'

const fg = color('bodytext')
const bg = color('gray.0')
const bg2 = color('gray.1')

const focusShadow = theme('button.focusShadow')
const activeShadow = theme('button.activeShadow')

export const sizes = {
  small: 0,
  large: 2,
}

/**
 * Looks for the 'size' prop and maps it to the sizes object above to pass
 * fontSize accordingly, e.g.
 *
 * const Foo = style.div`${buttonSize}`
 * Foo.defaultProps = {fontSize: 1}
 * <Foo/> // <Foo font-size="1"/>
 * <Foo size='small'/> // <Foo font-size="0"/>
 * <Foo size='large'/> // <Foo font-size="2"/>
 * <Foo fontSize={3}/> // <Foo font-size="3"/>
 */
export const buttonSize = (props) => {
  if ('size' in props) {
    let {size} = props
    if (!(size in sizes)) {
      throw new Error('invalid button size:', size)
    }
    return fontSize({...props, fontSize: sizes[size]})
  }
  return fontSize(props)
}

const Button = styled.button`
  appearance: none;
  text-decoration: none;
  font-family: inherit;
  line-height: 1.25;
  display: inline-block;
  padding: 0.5em 0.75em;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background-repeat: repeat-x;
  background-position: -1px -1px;
  background-size: 110% 110%;
  border: 1px solid ${rgba(black, .2)};
  border-radius: 0.25em;
  appearance: none;

  ${space}
  ${width}
  ${buttonSize}
  ${fontWeight}

  color: ${fg};
  background-color: ${bg2};
  background-image: linear-gradient(-180deg, ${bg} 0%, ${bg2} 90%);

  &:focus,
  &.focus {
    box-shadow: ${focusShadow};
  }

  &:hover,
  &.hover {
    background-color: ${darken(bg, .03)};
    background-image: linear-gradient(-180deg, ${darken(bg, .03)} 0%, ${darken(bg2, .03)} 90%);
    background-position: 0 -0.5em;
    border-color: ${rgba(black, .35)};
  }

  &:active,
  &.selected,
  [open] > & {
    background-color: ${darken(desaturate(bg, .1), .06)};
    background-image: none;
    border-color: ${rgba(black, .35)}; // repeat to avoid shift on click-drag off of button
    box-shadow: ${activeShadow};
  }

  &:disabled,
  &.disabled {
    color: ${rgba(fg, 0.4)};
    background-color: ${bg2};
    background-image: none;
    border-color: ${rgba(black, .2)}; // back to default .btn
    box-shadow: none;
  }
`

Button.defaultProps = {
  fontSize: 1,
  fontWeight: 600,
  m: 0,
}

Button.a = Button.withComponent('a')

export default Button

/**
 * Mixins for other types of buttons!
 */

export const solid = (fg, bg, bg2) => css`
  color: ${fg};
  background-color: ${bg2};
  background-image: linear-gradient(-180deg, ${bg} 0%, ${bg2} 90%);

  &:focus,
  &.focus {
    box-shadow: 0 0 0 0.2em ${rgba(bg, 0.4)};
  }

  &:hover,
  &.hover {
    background-color: ${darken(bg2, .02)};
    background-image: linear-gradient(-180deg, ${darken(bg, .02)} 0%, ${darken(bg2, .02)} 90%);
    background-position: 0 -0.5em;
    border-color: ${rgba(black, .5)};
  }

  &:active,
  &.selected,
  [open] > & {
    background-color: ${darken(mix(bg, bg2, .5), .07)};
    background-image: none;
    border-color: ${rgba(black, .5)}; // repeat to avoid shift on click-drag off of button
    box-shadow: ${activeShadow};
  }

  &:disabled,
  &.disabled {
    color: ${rgba(fg, 0.75)};
    background-color: ${mix(bg2, white, .5)};
    background-image: none;
    border-color: ${rgba(black, 0.35)}; // repeat .btn default to avoid shift on click-drag off of button
    box-shadow: none;
  }

  .Counter {
    color: ${darken(bg, .08)};
    background-color: ${white};
  }
`

export const inverse = (fg, bg, bg2) => css`
  color: ${fg};
  background-color: ${bg};
  background-image: linear-gradient(-180deg, ${bg} 0%, ${bg2} 90%);

  &:focus {
    box-shadow: 0 0 0 0.2em ${rgba(fg, .4)};
  }

  &:hover,
  &.hover {
    color: ${white};
    background-color: ${fg};
    background-image: linear-gradient(-180deg, ${lighten(fg, .1)} 0%, ${fg} 90%);
    border-color: ${rgba(black, .15)};

    .Counter {
      color: ${white};
    }
  }

  &:active,
  &.selected,
  [open] > & {
    color: ${white};
    background-color: ${darken(fg, .05)};
    background-image: none;
    border-color: ${rgba(black, .2)};
    box-shadow: ${activeShadow};
  }

  &:disabled,
  &.disabled {
    color: ${rgba(fg, 0.4)};
    background-color: ${bg2};
    background-image: none;
    border-color: ${rgba(black, .2)}; // back to default .btn
    box-shadow: none;
  }
`

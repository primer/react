import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import sx, {SxProp} from './sx'
import {get} from './constants'

type LabelProps = {
  /** The color of the label */
  variant?: LabelColorOptions
  /** How large the label is rendered */
  size?: LabelSizeKeys
} & SxProp

export type LabelColorOptions =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'attention'
  | 'severe'
  | 'danger'
  | 'done'
  | 'sponsors'

type LabelSizeKeys = 'small' | 'large'

export const variants: Record<
  LabelColorOptions,
  {
    borderColor: React.CSSProperties['color']
    color?: React.CSSProperties['color']
  }
> = {
  default: {
    borderColor: 'border.default'
  },
  primary: {
    borderColor: 'fg.default'
  },
  secondary: {
    borderColor: 'border.muted',
    color: 'fg.muted'
  },
  accent: {
    borderColor: 'accent.emphasis',
    color: 'accent.fg'
  },
  success: {
    borderColor: 'success.emphasis',
    color: 'success.fg'
  },
  attention: {
    borderColor: 'attention.emphasis',
    color: 'attention.fg'
  },
  severe: {
    borderColor: 'severe.emphasis',
    color: 'severe.fg'
  },
  danger: {
    borderColor: 'danger.emphasis',
    color: 'danger.fg'
  },
  done: {
    borderColor: 'done.fg',
    color: 'done.emphasis'
  },
  sponsors: {
    borderColor: 'sponsors.fg',
    color: 'sponsors.emphasis'
  }
}

const sizes: Record<LabelSizeKeys, {height: React.CSSProperties['height']; padding: React.CSSProperties['padding']}> = {
  small: {
    height: '20px',
    padding: '0 7px' // hard-coded to align with Primer ViewCompnents and Primer CSS
  },
  large: {
    height: '24px',
    padding: '0 10px' // hard-coded to align with Primer ViewCompnents and Primer CSS
  }
}

const Label = styled.span<LabelProps>`
  align-items: center;
  background-color: transparent;
  border-width: 1px;
  border-radius: 999px;
  border-style: solid;
  display: inline-flex;
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.0')};
  line-height: 1;
  white-space: nowrap;
  ${variant({variants})};
  ${variant({prop: 'size', variants: sizes})};
  ${sx};
`

Label.defaultProps = {
  size: 'small',
  variant: 'default'
}

export default Label

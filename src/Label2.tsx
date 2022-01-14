import React from 'react'
import styled, {css} from 'styled-components'
import {get} from './constants'

export type LabelProps = {
  /** The color of the label */
  variant?: LabelColorOptions
  /** How large the label is rendered */
  size?: LabelSizeKeys
}
interface LabelColorConfig {
  borderColor: (props: Props) => React.CSSProperties['color']
  textColor?: (props: Props) => React.CSSProperties['color']
}
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

export const labelColorMap: Record<LabelColorOptions, LabelColorConfig> = {
  default: {
    borderColor: get('colors.border.default')
  },
  primary: {
    borderColor: get('colors.fg.default')
  },
  secondary: {
    borderColor: get('colors.border.muted'),
    textColor: get('colors.fg.muted')
  },
  accent: {
    borderColor: get('colors.accent.emphasis'),
    textColor: get('colors.accent.fg')
  },
  success: {
    borderColor: get('colors.success.emphasis'),
    textColor: get('colors.success.fg')
  },
  attention: {
    borderColor: get('colors.attention.emphasis'),
    textColor: get('colors.attention.fg')
  },
  severe: {
    borderColor: get('colors.severe.emphasis'),
    textColor: get('colors.severe.fg')
  },
  danger: {
    borderColor: get('colors.danger.emphasis'),
    textColor: get('colors.danger.fg')
  },
  done: {
    borderColor: get('colors.done.fg'),
    textColor: get('colors.done.emphasis')
  },
  sponsors: {
    borderColor: get('colors.sponsors.fg'),
    textColor: get('colors.sponsors.emphasis')
  }
}

const badgeBoxStyle: Record<LabelSizeKeys, Record<'height' | 'padding', number>> = {
  small: {
    height: 20,
    padding: 7 // hard-coded to align with Primer ViewCompnents and Primer CSS
  },
  large: {
    height: 24,
    padding: 10 // hard-coded to align with Primer ViewCompnents and Primer CSS
  }
}

const LabelContainer = styled.span<Props>`
  align-items: center;
  border-width: 1px;
  border-radius: 999px;
  border-style: solid;
  display: inline-flex;
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.0')};
  line-height: 1;
  white-space: nowrap;

  ${({variant = 'default', size = 'small'}) => {
    return css`
      background-color: transparent;
      border-color: ${labelColorMap[variant].borderColor};
      color: ${labelColorMap[variant].textColor};
      height: ${badgeBoxStyle[size].height}px;
      padding: 0 ${badgeBoxStyle[size].padding}px;
    `
  }}
`

const Label: React.FC<Props> = ({children, size, ...other}) => (
  <LabelContainer size={size} {...other}>
    {children}
  </LabelContainer>
)

Label.defaultProps = {
  size: 'small',
  variant: 'default'
}

export default Label

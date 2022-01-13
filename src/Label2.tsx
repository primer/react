import React from 'react'
import styled, {css} from 'styled-components'
import {variant} from 'styled-system'
import {get} from './constants'

interface Props {
  /** The color of the label */
  scheme?: LabelColorOptions
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

type LabelSizeKeys = 'small' | 'medium' | 'large'

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

const badgeSizes: Record<LabelSizeKeys, number> = {
  small: 20,
  medium: 24,
  large: 32
}

const labelVariants = variant<
  {fontSize: number; height: string; paddingLeft: number; paddingRight: number},
  LabelSizeKeys
>({
  prop: 'size',
  variants: {
    small: {
      fontSize: 0,
      height: `${badgeSizes.small}px`,
      paddingLeft: 2,
      paddingRight: 2
    },
    medium: {
      fontSize: 0,
      height: `${badgeSizes.medium}px`,
      paddingLeft: 2,
      paddingRight: 2
    },
    large: {
      fontSize: 1,
      height: `${badgeSizes.large}px`,
      paddingLeft: 3,
      paddingRight: 3
    }
  }
})

const LabelContainer = styled.span<Props>`
  align-items: center;
  border-width: 1px;
  border-radius: 999px;
  border-style: solid;
  display: inline-flex;
  font-weight: ${get('fontWeights.bold')};
  line-height: 1;
  white-space: nowrap;
  ${labelVariants};

  ${({scheme = 'default'}) => {
    return css`
      background-color: transparent;
      border-color: ${labelColorMap[scheme].borderColor};
      color: ${labelColorMap[scheme].textColor};
    `
  }}
`

const Label: React.FC<Props> = ({children, size, ...other}) => (
  <LabelContainer size={size} {...other}>
    {children}
  </LabelContainer>
)

Label.defaultProps = {
  size: 'medium',
  scheme: 'default'
}

export default Label

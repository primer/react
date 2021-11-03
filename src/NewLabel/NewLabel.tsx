import React from 'react'
import styled, {css} from 'styled-components'
import {get} from '../constants'
import {LabelSizeKeys, labelVariants} from './_newLabelStyleUtils'

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

interface Props {
  color?: LabelColorOptions
  size?: LabelSizeKeys
  filled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadingVisual?: React.ComponentType<any>
}
interface LabelColorConfig {
  borderColor: (props: Props) => React.CSSProperties['color']
  textColor?: (props: Props) => React.CSSProperties['color']
}

interface FilledLabelColorConfig {
  bgColor: (props: Props) => React.CSSProperties['color']
  textColor?: (props: Props) => React.CSSProperties['color']
}

const labelColorMap: Record<LabelColorOptions, LabelColorConfig> = {
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

const filledLabelColorMap: Record<LabelColorOptions, FilledLabelColorConfig> = {
  default: {
    bgColor: get('colors.neutral.muted')
  },
  primary: {
    bgColor: get('colors.neutral.emphasis'),
    textColor: get('colors.fg.onEmphasis')
  },
  secondary: {
    bgColor: get('colors.neutral.subtle'),
    textColor: get('colors.fg.muted')
  },
  accent: {
    bgColor: get('colors.accent.emphasis'),
    textColor: get('colors.fg.onEmphasis')
  },
  success: {
    bgColor: get('colors.success.emphasis'),
    textColor: get('colors.fg.onEmphasis')
  },
  attention: {
    bgColor: get('colors.attention.emphasis'),
    textColor: get('colors.fg.onEmphasis')
  },
  severe: {
    bgColor: get('colors.severe.emphasis'),
    textColor: get('colors.fg.onEmphasis')
  },
  danger: {
    bgColor: get('colors.danger.emphasis'),
    textColor: get('colors.fg.onEmphasis')
  },
  done: {
    bgColor: get('colors.done.fg'),
    textColor: get('colors.fg.onEmphasis')
  },
  sponsors: {
    bgColor: get('colors.sponsors.fg'),
    textColor: get('colors.fg.onEmphasis')
  }
}

const LeadingVisualContainer = styled('span')`
  flex-shrink: 0;
  line-height: 0;
  margin-right: ${get('space.1')};
`

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

  ${({color = 'default', filled}) => {
    if (filled) {
      return css`
        background-color: ${filledLabelColorMap[color].bgColor};
        border-color: transparent;
        color: ${filledLabelColorMap[color].textColor};
      `
    } else {
      return css`
        background-color: transparent;
        border-color: ${labelColorMap[color].borderColor};
        color: ${labelColorMap[color].textColor};
      `
    }
  }}
`

const NewLabel: React.FC<Props> = ({children, leadingVisual: LeadingVisual, ...other}) => (
  <LabelContainer {...other}>
    {LeadingVisual && (
      <LeadingVisualContainer>
        <LeadingVisual />
      </LeadingVisualContainer>
    )}
    {children}
  </LabelContainer>
)

NewLabel.defaultProps = {
  size: 'md',
  color: 'default'
}

export default NewLabel

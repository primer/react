// @ts-ignore @styled-system/prop-types does not provide type definitions
import systemPropTypes from '@styled-system/prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {width, WidthProps} from 'styled-system'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const Bar = styled.span<{progress?: string | number} & SystemCommonProps>`
  width: ${props => (props.progress ? `${props.progress}%` : 0)};
  ${COMMON}
`

const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px'
}

const ProgressContainer = styled.span<
  {
    inline?: boolean
    barSize?: keyof typeof sizeMap
  } & WidthProps &
    SystemCommonProps &
    SxProp
>`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  overflow: hidden;
  background-color: ${get('colors.gray.2')};
  border-radius: ${get('radii.1')};
  height: ${props => sizeMap[props.barSize || 'default']};
  ${COMMON}
  ${width}
  ${sx};
`

export type ProgressBarProps = ComponentProps<typeof ProgressContainer> & ComponentProps<typeof Bar>

function ProgressBar({progress, bg, theme, ...rest}: ProgressBarProps) {
  return (
    <ProgressContainer theme={theme} {...rest}>
      <Bar progress={progress} bg={bg} theme={theme} />
    </ProgressContainer>
  )
}

ProgressBar.defaultProps = {
  bg: 'green.5',
  barSize: 'default',
  theme
}

ProgressBar.propTypes = {
  ...COMMON.propTypes,
  barSize: PropTypes.oneOf(['small', 'default', 'large']),
  inline: PropTypes.bool,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ...sx.propTypes,
  theme: PropTypes.object,
  width: systemPropTypes.layout.width
}

export default ProgressBar

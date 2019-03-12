import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'

const colorStyles = ({scheme, ...props}) => {
  return {
    color:
      scheme === 'gray-light'
        ? get('colors.gray.9')(props)
        : scheme === 'gray'
          ? get('colors.white')(props)
          : get('colors.gray.6')(props)
  }
}

const bgStyles = ({scheme, ...props}) => {
  return {
    backgroundColor:
      scheme === 'gray-light'
        ? get('colors.blackfade15')(props)
        : scheme === 'gray'
          ? get('colors.gray.5')(props)
          : get('colors.counter.bg')(props)
  }
}

const CounterLabel = styled.div`
  display: inline-block;
  padding: 2px 5px;
  font-size: ${get('fontSizes.0')}px;
  font-weight: ${get('fontWeights.bold')};
  line-height: ${get('lineHeights.condensedUltra')};
  border-radius: 20px;
  ${colorStyles};
  ${bgStyles};
  ${COMMON};

  &:empty {
    visibility: hidden;
  }
`

CounterLabel.defaultProps = {
  theme,
  as: 'span'
}

CounterLabel.propTypes = {
  children: PropTypes.node,
  scheme: PropTypes.oneOf(['gray', 'gray-light']),
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default CounterLabel

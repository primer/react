import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'

const schemeMap = {
  green: {color: 'colors.green.8', bg: 'colors.green.1', borderColor: 'colors.blackfade15'},
  red: {color: 'colors.red.9', bg: 'colors.red.1', borderColor: 'colors.blackfade15'},
  yellow: {color: 'colors.yellow.9', bg: 'colors.yellow.1', borderColor: 'colors.blackfade15'},
  base: {color: 'colors.blue.8', bg: 'colors.blue.1', borderColor: 'colors.blackfade15'} //TODO put in correct border color
}

const Flash = styled.div`
  position: relative;
  padding: ${get('space.3')}px;
  color: ${props => get(schemeMap[props.scheme] ? schemeMap[props.scheme].color : '')};
  background-color: ${props => get(schemeMap[props.scheme] ? schemeMap[props.scheme].bg : '')};
  border-color: ${props => get(schemeMap[props.scheme] ? schemeMap[props.scheme].borderColor : '')};
  border-style: solid;
  border-width: ${props => props.full ? '1px 0px' : '1px'};
  border-radius: ${props => props.full ? '0' : '3px'};

  p:last-child {
    margin-bottom: 0;
  }
  ${COMMON}
`

Flash.defaultProps = {
  theme,
  scheme: 'base'
}

Flash.propTypes = {
  children: PropTypes.node,
  full: PropTypes.bool,
  scheme: PropTypes.oneOf(Object.keys(schemeMap)),
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Flash

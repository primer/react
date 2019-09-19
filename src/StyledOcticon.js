import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Box from './Box'
import {COMMON} from './constants'
import theme from './theme'

function StyledOcticon({icon: Icon, size, ...rest}) {
  return (
    <Box {...rest}>
      <Icon size={size} {...rest} />
    </Box>
  )
}

StyledOcticon.defaultProps = {
  theme
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  theme: PropTypes.object,
  icon: PropTypes.node.isRequired
}

export default StyledOcticon

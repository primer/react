import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

const Wrapper = styled.span(COMMON)

const StyledOcticon = ({icon: Icon, rest}) => {
  return (
    <Wrapper {...rest}>
      <Icon />
    </Wrapper>
  )
}

StyledOcticon.defaultProps = {
  theme
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  theme: PropTypes.object
}

export default StyledOcticon

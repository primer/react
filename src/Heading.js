import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON, get} from './constants'
import Deprecated from './utils/Deprecated'
import theme from './theme'

// remove all of this when Heading is deprecated
const StyledHeading = styled.h2`
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.5')};
  margin: 0;
  ${TYPOGRAPHY} ${COMMON};
`

export const Heading = props => {
  return (
    <Deprecated componentName="Heading" version="20.0.0" message="Use the H1, H2, H3, H4, H5, H6 components instead">
      <StyledHeading {...props} />
    </Deprecated>
  )
}

Heading.defaultProps = {
  theme
}

Heading.propTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes
}
//

const HeadingInternal = styled.h2`
  font-weight: ${get('fontWeights.bold')};
  margin: 0;
  ${TYPOGRAPHY} ${COMMON};
`

HeadingInternal.defaultProps = {
  theme
}

HeadingInternal.propTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes
}

function withHeading(level) {
  const WithHeading = ({as, ...props}) => (
    <HeadingInternal
      as={level}
      fontSize={[`mobileHeadingSizes.${level}`, `mobileHeadingSizes.${level}`, `headingSizes.${level}`]}
      {...props}
    />
  )
  WithHeading.propTypes = HeadingInternal.propTypes
  WithHeading.defaultProps = HeadingInternal.defaultProps
  return WithHeading
}

export const H1 = withHeading('h1')
export const H2 = withHeading('h2')
export const H3 = withHeading('h3')
export const H4 = withHeading('h4')
export const H5 = withHeading('h5')
export const H6 = withHeading('h6')

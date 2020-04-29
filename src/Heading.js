import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON, get} from './constants'
import theme from './theme'

export const Heading = styled.h2`
  font-weight: ${get('fontWeights.bold')};
  margin: 0;
  ${TYPOGRAPHY} ${COMMON};
`

export const H1 = (props) => <Heading as='h1' fontSize={['mobileHeadingSizes.h1', 'mobileHeadingSizes.h1', 'headingSizes.h1']} {...props} />
export const H2 = (props) => <Heading as='h2' fontSize={['mobileHeadingSizes.h2', 'mobileHeadingSizes.h2', 'headingSizes.h2']} {...props}/>
export const H3 = (props) => <Heading as='h3' fontSize={['mobileHeadingSizes.h3', 'mobileHeadingSizes.h3', 'headingSizes.h3']} {...props}/>
export const H4 = (props) => <Heading as='h4' fontSize={['mobileHeadingSizes.h4', 'mobileHeadingSizes.h4', 'headingSizes.h4']} {...props}/>
export const H5 = (props) => <Heading as='h5' fontSize={['mobileHeadingSizes.h5', 'mobileHeadingSizes.h5', 'headingSizes.h5']} {...props}/>
export const H6 = (props) => <Heading as='h6' fontSize={['mobileHeadingSizes.h6', 'mobileHeadingSizes.h6', 'headingSizes.h6']} {...props}/>

Heading.defaultProps = {
  theme,
  as: 'h2'
}

Heading.propTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes
}


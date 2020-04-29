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

export const H1 = (props) => <Heading as='h1' {...props} fontSize={['mobileHeadingSizes.h1', 'mobileHeadingSizes.h1', 'headingSizes.h1']} />
export const H2 = (props) => <Heading as='h2' fontSize={['22px', '22px', '24px']} {...props}/>
export const H3 = (props) => <Heading as='h3' fontSize={['18px', '18px', '20px']} {...props}/>
export const H4 = (props) => <Heading as='h4' fontSize='16px' {...props}/>
export const H5 = (props) => <Heading as='h5' fontSize='14px' {...props}/>
export const H6 = (props) => <Heading as='h6' fontSize='12px' {...props}/>

Heading.defaultProps = {
  theme,
  as: 'h2'
}

Heading.propTypes = {
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes
}


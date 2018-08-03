import React from 'react'
import Button from './Button'
import {withSystemProps, COMMON} from './system-props'

const ButtonLink = props => <Button {...props} linkStyle />

export default withSystemProps(ButtonLink, COMMON)

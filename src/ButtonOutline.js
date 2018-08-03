import React from 'react'
import Button from './Button'
import {withSystemProps, COMMON} from './system-props'

const ButtonOutline = props => <Button {...props} scheme="outline" />

export default withSystemProps(ButtonOutline, COMMON)

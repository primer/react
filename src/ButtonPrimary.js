import React from 'react'
import Button from './Button'
import {withSystemProps, COMMON} from './system-props'

const ButtonPrimary = props => <Button {...props} scheme="primary" />

export default withSystemProps(ButtonPrimary, COMMON)

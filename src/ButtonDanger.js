import React from 'react'
import Button from './Button'
import {withSystemProps, COMMON} from './system-props'

const ButtonDanger = props => <Button {...props} scheme="danger" />

export default withSystemProps(ButtonDanger, COMMON)

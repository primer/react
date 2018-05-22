import React from 'react'
import mapWithClassnames from './system-classnames'

const Box = props => <div {...mapWithClassnames(props, 'd-flex')} />

export default Flex

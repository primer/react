import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {spacing} from './mappers'

const FlexItem = ({tag: Tag = 'div', children, flexAuto, alignSelf, ...rest}) => {
  const {className} = spacing(rest)
  const classes = classnames(className, {'flex-auto': flexAuto}, alignSelf && `flex-self-${alignSelf}`)
  return <Tag className={classes}>{children}</Tag>
}

FlexItem.propTypes = {
  alignSelf: PropTypes.oneOf(['auto', 'start', 'end', 'center', 'baseline', 'stretch']),
  children: PropTypes.node,
  flexAuto: PropTypes.bool,
  tag: PropTypes.string
}

export default FlexItem

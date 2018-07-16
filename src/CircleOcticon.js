import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Octicon from '@githubprimer/octicons-react'
import {mapWhitespaceProps} from './props'
import {colors} from './theme'

export default function CircleOcticon(props) {
  const {size, bg, color, className, ...rest} = mapWhitespaceProps(props)
  const classes = classnames(
    className,
    'circle d-flex flex-items-center flex-justify-center',
    bg && `bg-${bg}`,
    color && `text-${color}`
  )
  return (
    <div style={{width: `${size}px`, height: `${size}px`}} className={classes}>
      <Octicon size={size} {...rest} />
    </div>
  )
}

CircleOcticon.defaultProps = {
  size: 32
}

CircleOcticon.propTypes = {
  ...Octicon.propTypes,
  bg: PropTypes.oneOf(Object.keys(colors.bg)),
  color: PropTypes.oneOf(Object.keys(colors)),
  // FIXME: we should be able to infer the size from the
  // rendered Octicon so that we can support
  // size={'small|medium|large'}
  size: PropTypes.number
}

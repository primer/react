import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Octicon from '@githubprimer/octicons-react'
import {composeWithPropTypes} from './props'
import {bg, color, spacing} from './mappers'

const mapProps = composeWithPropTypes(bg, color, spacing)

export default function CircleOcticon(props) {
  const {size, className, ...rest} = mapProps(props)
  const classes = classnames(
    className,
    'circle d-flex flex-items-center flex-justify-center'
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
  ...mapProps.propTypes,
  // FIXME: we should be able to infer the size from the
  // rendered Octicon so that we can support
  // size={'small|medium|large'}
  size: PropTypes.number
}

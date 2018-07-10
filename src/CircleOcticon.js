import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Octicon from '@github/octicons-react'

const CircleOcticon = ({size, bg, color, ...rest}) => {
  const className = classnames(
    'circle d-flex flex-items-center flex-justify-center',
    bg && `bg-${bg}`,
    color && `text-${color}`
  )
  return (
    <div style={{width: `${size}px`, height: `${size}px`}} className={className}>
      <Octicon size={size} {...rest} />
    </div>
  )
}

CircleOcticon.defaultProps = {
  size: 32
}

CircleOcticon.propTypes = {
  ...Octicon.propTypes,
  // FIXME: we should be able to infer the size from the
  // rendered Octicon so that we can support
  // size={'small|medium|large'}
  size: PropTypes.number
}

export default CircleOcticon

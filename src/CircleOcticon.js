import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Octicon from '@githubprimer/octicons-react'

const CircleOcticon = ({size, bg, color, ...rest}) => {
  const className = classnames(
    'circle d-flex flex-items-center flex-justify-center',
    bg ? `bg-${bg}` : null,
    color ? `text-${color}` : null
  )
  return (
    <div style={{width: `${size}px`, height: `${size}px`}} className={className}>
      <Octicon size={size} {...rest} />
    </div>
  )
}

CircleOcticon.propTypes = {
  ...Octicon.propTypes,
  // FIXME: we should be able to infer the size from the
  // rendered Octicon so that we can support
  // size={'small|medium|large'}
  size: PropTypes.number
}

export default CircleOcticon

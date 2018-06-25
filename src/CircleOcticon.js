import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Octicon from '@github/octicons-react'

const CircleOcticon = ({name, size, bg, color}) => {
  const wrapperClasses = [
    'circle d-flex flex-items-center flex-justify-center',
    bg ? `bg-${bg}` : null,
    color ? `text-${color}` : null,
  ]
  return (
    <div style={{width: `${size}px`, height: `${size}px`}} className={classnames(wrapperClasses)}>
      <Octicon name={name} size={size}/>
    </div>
  )
}


CircleOcticon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number
}

export default CircleOcticon

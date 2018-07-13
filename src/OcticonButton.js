import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Octicon from '@githubprimer/octicons-react'
import {mapWhitespaceProps} from './props'

export default function OcticonButton({disabled, icon, label, onClick, size, ...rest}) {
  const {className} = mapWhitespaceProps(rest)
  const buttonProps = {
    'aria-label': label,
    className: classnames('btn-link text-inherit', className),
    disabled,
    onClick
  }
  const octiconProps = {icon, size}
  return (
    <button {...buttonProps}>
      <Octicon {...octiconProps} />
    </button>
  )
}

OcticonButton.defaultProps = {
  label: ''
}

OcticonButton.propTypes = {
  disabled: PropTypes.bool,
  icon: Octicon.propTypes.icon,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  size: Octicon.propTypes.size
}

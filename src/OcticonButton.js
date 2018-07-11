import React from 'react'
import PropTypes from 'prop-types'
import Octicon from '@github/octicons-react'

export default function OcticonButton({disabled, icon, label, onClick, size}) {
  const buttonProps = {'aria-label': label, disabled, onClick}
  const octiconProps = {icon, size}
  return <button {...buttonProps}><Octicon {...octiconProps} /></button>
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

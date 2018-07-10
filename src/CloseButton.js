import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import Octicon, {X} from '@github/octicons-react'

const closeIcon = <Octicon icon={X} />

export default function CloseButton(props) {
  return (
    <Button {...props} scheme="octicon">
      {closeIcon}
    </Button>
  )
}

CloseButton.defaultProps = {
  label: 'Close'
}

CloseButton.propTypes = {
  ...Button.propTypes,
  label: PropTypes.string.isRequired
}

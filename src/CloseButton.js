import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import Octicon, {X} from '@github/octicons-react'

export default function CloseButton(props) {
  return (
    <Button {...props}>
      <Octicon icon={X} />
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

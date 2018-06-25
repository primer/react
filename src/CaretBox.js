import React from 'react'
import PropTypes from 'prop-types'
import Box from './Box'
import Caret from './Caret'
import {colors} from './theme'

const borderValuesByName = {
  ...colors.border,
  true: colors.gray[2], // default
}

const bgValuesByName = colors.bg

export default function CaretBox(props) {
  const {
    bg,
    border,
    caret: location,
    children,
    ...boxProps
  } = props

  const borderColorName = Array.isArray(border)
    ? border.filter(value => (value in borderValuesByName)).pop()
    : border

  const caretProps = {
    location,
    borderColor: borderValuesByName[borderColorName],
    fill: bgValuesByName[bg]
  }

  return (
    <Box {...boxProps} bg={bg} border={border}>
      {children}
      <Caret {...caretProps} />
    </Box>
  )
}

CaretBox.propTypes = {
  ...Box.propTypes,
  caret: Caret.propTypes.location
}

CaretBox.defaultProps = {
  ...Box.defaultProps,
  position: 'relative'
}

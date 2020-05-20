import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import BorderBox from './BorderBox'
import Caret from './Caret'
import {COMMON, LAYOUT, POSITION} from './constants'
import sx from './sx'

const Popover = (props) => {
  // don't destructure these, just grab them
  const {bg, borderColor, borderWidth, borderStyle, relative, open} = props
  const {caret, children, ...boxProps} = props
  const caretProps = {bg, borderColor, borderWidth, borderStyle, location: caret}
  return (
    <BorderBox sx={{position: relative ? 'relative' : 'absolute'}} zIndex="100" ml="auto" mr="auto" p={4} width="232px" display={open ? 'block' : 'none'} {...boxProps}>
      {children}
      <Caret {...caretProps} />
    </BorderBox>
  )
}

Popover.defaultProps = {
  theme,
  open: true,
}

Popover.propTypes = {
  ...BorderBox.propTypes,
  relative: PropTypes.bool,
  open: PropTypes.bool,
  theme: PropTypes.object
}

// Popover.Content.defaultProps = {
//   caret: 'top',
//   theme
// }

// Popover.Content.propTypes = {
//   ...BorderBox.propTypes,
//   caret: Caret.propTypes.location,
// }

// Popover.Content.displayName = 'Popover.Content'

export default Popover

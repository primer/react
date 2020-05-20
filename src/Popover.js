import React from 'react'
import PropTypes from 'prop-types'
import theme from './theme'
import BorderBox from './BorderBox'
import Caret from './Caret'

const Popover = styled.div`
  position: ${props => props.relative ? 'relative' : 'absolute'};
  z-index: 100;
  display: ${props => props.open ? 'block' : 'none'};
  ${COMMON};
  ${LAYOUT};
  ${POSITION};
  ${sx};
`

Popover.Content = (props) => {
    const {bg, borderColor, borderWidth, borderStyle} = props
    const {caret, children, ...boxProps} = props
    const caretProps = {bg, borderColor, borderWidth, borderStyle, location: caret}
    return (
      <BorderBox p={4} mr="auto" ml="auto" width="232px" {...boxProps}>
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
Popover.Content.defaultProps = {
  caret: 'top',
  theme
}

Popover.Content.propTypes = {
  ...BorderBox.propTypes,
  caret: Caret.propTypes.location,
}

Popover.Content.displayName = 'Popover.Content'

export default Popover

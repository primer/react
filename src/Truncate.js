import styled from 'styled-components'
import {variant, maxWidth} from 'styled-system'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'

const truncateVariants = variant({
  variants: {
    target: {
      display: 'inline-block',
      verticalAlign: 'top'
    }
  }
})

const Truncate = styled('div')`
  ${TYPOGRAPHY}
  ${COMMON}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${truncateVariants}
  ${maxWidth}
`

Truncate.defaultProps = {
  as: 'div',
  maxWidth: 125,
  theme
}

Truncate.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  maxWidth: PropTypes.number,
  theme: PropTypes.object,
  title: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['target'])
}

export default Truncate

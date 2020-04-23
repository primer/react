import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import {variant} from 'styled-system'

const variants = variant({
  variants: {
    success: {
      backgroundColor: 'flash.success.bg',
      borderColor: 'flash.success.border'
    },
    danger: {
      color: 'flash.danger.text',
      backgroundColor: 'flash.danger.bg',
      borderColor: 'flash.danger.border'
    },
    warning: {
      backgroundColor: 'flash.warning.bg',
      borderColor: 'flash.warning.border'
    },
    default: {
      backgroundColor: 'flash.default.bg',
      borderColor: 'flash.default.border'
    },
  }
})

const getIconColor = (variant, theme) => get(`colors.flash.${variant}.icon`)(theme)


const Flash = styled.div`
  position: relative;
  color: ${get('colors.text.grayDark')};
  padding: ${get('space.3')};
  border-style: solid;
  border-width: ${props => (props.full ? '1px 0px' : '1px')};
  border-radius: ${props => (props.full ? '0' : '3px')};
  margin-top: ${props => (props.full ? '-1px' : '0')};

  p:last-child {
    margin-bottom: 0;
  }

  svg {
    color: ${props => getIconColor(props.variant, props.theme)};
    margin-right: ${get('space.2')};
  }

  ${COMMON};
  ${variants}
`

Flash.defaultProps = {
  theme,
  variant: 'default'
}

Flash.propTypes = {
  children: PropTypes.node,
  full: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'warning', 'success', 'danger']),
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Flash

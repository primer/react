import classnames from 'classnames'
import PropTypes from 'prop-types'
import systemPropTypes from '@styled-system/prop-types'
import styled, {css} from 'styled-components'
import {variant, layout} from 'styled-system'
import {COMMON, get} from './constants'
import theme from './theme'

const sizeVariants = variant({
  variants: {
    small: {
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px'
    },
    large: {
      px: 2,
      py: '10px',
      fontSize: 3
    }
  }
})

const TextInput = styled.input.attrs(({autocomplete, theme, variant, block, className, ...rest}) => ({
  className: classnames(className, 'form-control'),
  autoComplete: autocomplete,
  type: 'text',
  ...rest
}))`
  min-height: 34px;
  padding: 6px ${get('space.2')}px;
  font-size: ${get('fontSizes.2')}px;
  line-height: 20px;
  color: ${get('colors.gray.9')};
  vertical-align: middle;
  background-color: ${get('colors.white')};
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.
  border: 1px solid ${get('colors.gray.3')};
  border-radius: ${get('radii.1')}px;
  outline: none;
  box-shadow: ${get('shadows.formControl')};

  &:focus {
    border-color: ${get('colors.blue.4')};
    outline: none;
    box-shadow: ${get('shadows.formControl')}, ${get('shadows.formControlFocus')};
  }

  ${sizeVariants}

  ${props =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}

  // Ensures inputs don't zoom on mobile but are body-font size on desktop
  @media (max-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')}px;
  }
  ${COMMON};
  ${layout.width}
`

TextInput.defaultProps = {theme}

TextInput.propTypes = {
  autocomplete: PropTypes.string,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  theme: PropTypes.object,
  value: PropTypes.string,
  variant: PropTypes.oneOf(['small', 'large']),
  ...COMMON.propTypes,
  width: systemPropTypes.layout.width
}

export default TextInput

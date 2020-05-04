import PropTypes from 'prop-types'
import styled from 'styled-components'
import classnames from 'classnames'
import {COMMON, LAYOUT, POSITION, get} from './constants'
import theme from './theme'
import BorderBox from './BorderBox'
import sx from './sx'

const Popover = styled.div.attrs(({className, caret}) => {
  return {
    className: classnames(className, `caret-pos--${caret}`)
  }
})`
  position: ${props => (props.relative ? 'relative' : 'absolute')};
  z-index: 100;
  display: ${props => (props.open ? 'block' : 'none')};

  ${COMMON};
  ${LAYOUT};
  ${POSITION};
  ${sx};
`

Popover.Content = styled(BorderBox)`
  position: relative;
  width: 232px;
  margin-right: auto;
  margin-left: auto;
  padding: ${get('space.4')};
  background-color: ${get('colors.white')};

  ${COMMON};
  ${LAYOUT};

  // Carets
  &::before,
  &::after {
    position: absolute;
    left: 50%;
    display: inline-block;
    content: '';
  }

  &::before {
    top: -${get('space.3')};
    margin-left: -9px;
    border: ${get('space.2')} solid transparent; // TODO: solid?
    border-bottom-color: ${get('popovers.colors.caret')};
  }

  &::after {
    top: -14px;
    margin-left: -${get('space.2')};
    border: 7px solid transparent; // todo: solid
    border-bottom-color: ${get('colors.white')};
  }

  // Bottom-oriented carets
  ${Popover}.caret-pos--bottom & ,
  ${Popover}.caret-pos--bottom-right & ,
  ${Popover}.caret-pos--bottom-left & {
    &::before,
    &::after {
      top: auto;
      border-bottom-color: transparent;
    }

    &::before {
      bottom: -${get('space.3')};
      border-top-color: ${get('popovers.colors.caret')};
    }

    &::after {
      bottom: -14px;
      // stylelint-disable-next-line primer/borders
      border-top-color: ${get('colors.white')};
    }
  }

  // Top & Bottom: Right-oriented carets
  ${Popover}.caret-pos--top-right & ,
  ${Popover}.caret-pos--bottom-right & {
    right: -9px;
    margin-right: 0;

    &::before,
    &::after {
      left: auto;
      margin-left: 0;
    }

    &::before {
      right: 20px;
    }

    &::after {
      right: 21px;
    }
  }

  // Top & Bottom: Left-oriented carets
  ${Popover}.caret-pos--top-left & ,
  ${Popover}.caret-pos--bottom-left & {
    left: -9px;
    margin-left: 0;

    &::before,
    &::after {
      left: ${get('space.4')};
      margin-left: 0;
    }

    &::after {
      left: calc(${get('space.4')} + 1px);
    }
  }

  // Right- & Left-oriented carets
  ${Popover}.caret-pos--right & ,
  ${Popover}.caret-pos--right-top & ,
  ${Popover}.caret-pos--right-bottom & ,
  ${Popover}.caret-pos--left & ,
  ${Popover}.caret-pos--left-top & ,
  ${Popover}.caret-pos--left-bottom & {
    &::before,
    &::after {
      top: 50%;
      left: auto;
      margin-left: 0;
      border-bottom-color: transparent;
    }

    &::before {
      // stylelint-disable-next-line primer/spacing
      margin-top: calc((${get('space.2')} + 1px) * -1);
    }

    &::after {
      margin-top: -${get('space.2')};
    }
  }

  // Right-oriented carets
  ${Popover}.caret-pos--right & ,
  ${Popover}.caret-pos--right-top & ,
  ${Popover}.caret-pos--right-bottom & {
    &::before {
      right: -${get('space.3')};
      border-left-color: ${get('popovers.colors.caret')};
    }

    &::after {
      right: -14px;
      // stylelint-disable-next-line primer/borders
      border-left-color: ${get('colors.white')};
    }
  }

  // Left-oriented carets
  ${Popover}.caret-pos--left & ,
  ${Popover}.caret-pos--left-top & ,
  ${Popover}.caret-pos--left-bottom & {
    &::before {
      left: -${get('space.3')};
      border-right-color: ${get('popovers.colors.caret')};
    }

    &::after {
      left: -14px;
      // stylelint-disable-next-line primer/borders
      border-right-color: ${get('colors.white')};
    }
  }

  // Right & Left: Top-oriented carets
  ${Popover}.caret-pos--right-top & ,
  ${Popover}.caret-pos--left-top & {
    &::before,
    &::after {
      top: ${get('space.4')};
    }
  }

  // Right & Left: Bottom-oriented carets
  ${Popover}.caret-pos--right-bottom & ,
  ${Popover}.caret-pos--left-bottom & {
    &::before,
    &::after {
      top: auto;
    }

    &::before {
      bottom: ${get('space.3')};
    }

    &::after {
      bottom: calc(${get('space.3')} + 1px);
    }
  }

  ${sx};
`

Popover.CARET_POSITIONS = [
  'top',
  'bottom',
  'left',
  'right',
  'bottom-left',
  'bottom-right',
  'top-left',
  'top-right',
  'left-bottom',
  'left-top',
  'right-bottom',
  'right-top'
]

Popover.defaultProps = {
  caret: 'top',
  theme
}

Popover.propTypes = {
  as: PropTypes.elementType,
  caret: PropTypes.oneOf(Popover.CARET_POSITIONS),
  open: PropTypes.bool,
  relative: PropTypes.bool,
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  ...POSITION.propTypes,
  ...sx.propTypes
}

Popover.Content.defaultProps = {
  theme
}

Popover.Content.propTypes = {
  as: PropTypes.elementType,
  theme: PropTypes.object,
  ...BorderBox.propTypes,
  ...sx.propTypes
}

Popover.Content.displayName = 'Popover.Content'

export default Popover

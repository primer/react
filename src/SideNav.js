import React from 'react'
import styled, {css} from 'styled-components'
import classnames from 'classnames'
import PropTypes from './DocPropTypes'
import {COMMON, get} from './constants'
import theme from './theme'
import elementType from './utils/elementType'
import Link from './Link'
import BorderBox from './BorderBox'

function SideNavBase({variant, className, bordered, children, ...props}) {
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal'
  const newClassName = classnames(className, `variant-${variantClassName}`)

  if (!bordered) {
    props = {...props, border: 'none'}
  }

  return (
    <BorderBox as="nav" className={newClassName} {...props}>
      {children}
    </BorderBox>
  )
}

const SideNav = styled(SideNavBase)`
  background-color: ${get('colors.gray.0')};

  ${props =>
    props.bordered &&
    css`
      // Remove duplicate borders from nested SideNavs
      & > & {
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    `}

  ${COMMON};
`

SideNav.Link = styled(Link).attrs(props => {
  const isReactRouter = typeof props.to === 'string'
  if (isReactRouter || props.selected) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {'aria-current': 'page'}
  } else {
    return {}
  }
})`
  position: relative;
  display: block;
  ${props =>
    props.variant === 'full' &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `}
  width: 100%;
  text-align: left;
  font-size: ${get('fontSizes.1')};

  & > ${SideNav} {
    border-bottom: none;
  }

  ${SideNav}.variant-normal > & {
    color: ${get('colors.gray.6')};
    padding: ${get('space.3')};
    border: 0;
    border-top: ${get('borders.1')} ${get('colors.gray.2')};

    &:first-child {
      border-top: 0;
    }

    // Bar on the left
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 3px;
      pointer-events: none;
      content: '';
    }

    &:hover,
    &:focus {
      color: ${get('colors.gray.9')};
      text-decoration: none;
      background-color: ${get('colors.gray.1')};
      outline: none;

      // Bar on the left
      &::before {
        background-color: ${get('colors.gray.4')};
      }
    }

    &:active {
      background-color: ${get('colors.white')};
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      font-weight: ${get('fontWeights.semibold')};
      color: ${get('colors.gray.9')};
      background-color: ${get('colors.white')};

      // Bar on the left
      &::before {
        background-color: ${get('colors.orange.5')};
      }
    }
  }

  ${SideNav}.variant-lightweight > & {
    padding: ${get('space.1')} 0;
    color: ${get('colors.blue.5')};

    &:hover,
    &:focus {
      color: ${get('colors.gray.9')};
      text-decoration: none;
      outline: none;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      color: ${get('colors.gray.9')};
      font-weight: ${get('fontWeights.semibold')};
    }
  }
`

SideNav.defaultProps = {
  theme,
  bordered: false,
  variant: 'normal'
}

SideNav.propTypes = PropTypes.doc({
  system: [COMMON],
  inherited: [BorderBox],
  own: {
    as: elementType.desc('Sets the HTML tag for the element'),
    bordered: PropTypes.bool.desc('Renders the component with a border'),
    children: PropTypes.node.hidden,
    theme: PropTypes.object.hidden,
    variant: PropTypes.oneOf(['normal', 'lightweight']).desc(
      'Set to `lightweight` to render [in a lightweight style](#lightweight-variant)'
    )
  }
})

SideNav.Link.defaultProps = {
  theme,
  selected: false,
  variant: 'normal'
}

SideNav.Link.propTypes = PropTypes.doc({
  system: [],
  inherited: [Link],
  own: {
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).desc('Sets the HTML tag for the element'),
    selected: PropTypes.bool.desc(
      'Sets the link as selected, giving it a different style and setting the `aria-current` attribute'
    ),
    theme: PropTypes.object.hidden,
    variant: PropTypes.oneOf(['normal', 'full']).desc(
      'Set to `full` to render a [full variant](#full-variant), suitable for including icons and labels'
    )
  }
})

export default SideNav

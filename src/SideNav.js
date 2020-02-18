import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import classnames from 'classnames'
import {COMMON, LAYOUT, FLEX, get} from './constants'
import theme from './theme'
import elementType from './utils/elementType'
import Link from './Link'
import Box from './Box'
import BorderBox from './BorderBox'

function SideNavBase({variant, className, border, children, ...props}) {
  const BoxComponent = border ? BorderBox : Box
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal'
  const newClassName = classnames(className, `variant-${variantClassName}`)

  return (
    <BoxComponent as="nav" className={newClassName} {...props}>
      {children}
    </BoxComponent>
  )
}

const SideNav = styled(SideNavBase)`
  background-color: ${get('colors.gray.0')};

  ${props =>
    props.border &&
    css`
      ${SideNav} > & {
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    `}

  ${LAYOUT};
`

// const SideNavOld = styled.nav.attrs(props => {
//   const variantClassName = props.variant === 'lightweight' ? 'lightweight' : 'normal'
//   return {
//     className:
//   }
// })`
//   ${props =>
//     props.border &&
//     css`
//       border: ${get('borders.1')} ${get('colors.gray.2')};

//       // nested SideNavs should only have a top border
//       ${SideNav} > & {
//         border: 0;
//         border-top: ${get('borders.1')} ${get('colors.gray.2')};
//       }
//     `};

//   ${COMMON};
//   ${LAYOUT};
// `

SideNav.Link = styled(Link).attrs(props => {
  const attrs = {}

  if (props.full) {
    attrs['display'] = 'flex'
    attrs['alignItems'] = 'center'
    attrs['justifyContent'] = 'space-between'
  }

  const isReactRouter = typeof props.to === 'string'
  if (isReactRouter) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    attrs['aria-current'] = 'page'
  } else if (props.selected) {
    attrs['aria-current'] = 'page'
  }

  return attrs
})`
  position: relative;
  display: block;
  width: 100%;
  text-align: left;
  // These wasn't in the original primer/css version?
  font-size: ${get('fontSizes.1')};

  & > ${SideNav} {
    border-bottom: none;
  }

  ${COMMON};
  ${FLEX};

  ${SideNav}.variant-normal > & {
    color: ${get('colors.gray.6')};
    padding: ${get('space.3')};
    border: 0;
    border-top: ${get('borders.1')} ${get('colors.gray.2')};

    &:first-child {
      border-top: 0;
    }

    &:last-child {
      // makes sure there is a "bottom border" in case the list is not long enough
      // stylelint-disable-next-line primer/box-shadow
      box-shadow: 0 1px 0 ${get('colors.gray.2')};
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
        background-color: ${get('colors.orange.7')};
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
  theme
}

SideNav.propTypes = {
  as: elementType,
  children: PropTypes.node,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['normal', 'lightweight']),
  ...COMMON.propTypes,
  ...LAYOUT.propTypes
}

SideNav.Link.defaultProps = {
  theme,
  variant: 'normal'
}

SideNav.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  full: PropTypes.bool,
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...COMMON.propTypes,
  ...FLEX.propTypes
}

export default SideNav

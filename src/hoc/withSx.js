import React from 'react'
import {useTheme} from 'styled-components'
import css from '@styled-system/css'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const withSx = Component => {
  function SxWrapper({sx, children, ...props}) {
    const ctxTheme = useTheme()
    if (!sx) {
      return <Component {...props}>{children}</Component>
    }

    const extraProps = {}
    const compiled = css(sx)(props.theme || ctxTheme)
    if (props.style) {
      extraProps.style = Object.assign({}, props.style, compiled)
    } else {
      extraProps.style = compiled
    }

    return (
      <Component {...props} {...extraProps}>
        {children}
      </Component>
    )
  }

  SxWrapper.displayName = `withSx(${getDisplayName(Component)})`

  return SxWrapper
}

export default withSx

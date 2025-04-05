import React from 'react'
import Box from '../../Box'
import {defaultSxProp} from '../../utils/defaultSxProp'

type CSSModulesProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | React.ComponentType<any>
  sx?: React.CSSProperties
}

/**
 * Utility to toggle rendering a Box component that receives sx props
 * or a "plain" component based on the provided `as` prop. Other props will be passed through to an element or component created with the `as` prop.
 *
 * @param sx - the sx prop to check against the default sx prop
 * @param defaultAs - the default component to use when `as` is not provided
 */
export function toggleSxComponent<T, P extends CSSModulesProps>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultAs?: string | React.ComponentType<any>,
) {
  const Wrapper = React.forwardRef<T, P>(function Wrapper(
    {as: BaseComponent = defaultAs || 'div', sx: sxProp = defaultSxProp, ...rest},
    ref,
  ) {
    if (sxProp !== defaultSxProp) {
      return <Box as={BaseComponent} {...rest} sx={sxProp} ref={ref} />
    }
    return <BaseComponent {...rest} ref={ref} />
  })

  return Wrapper
}

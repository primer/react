import React from 'react'
import {useFeatureFlag} from '../../FeatureFlags'
import Box from '../../Box'
import {defaultSxProp} from '../../utils/defaultSxProp'

type CSSModulesProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | React.ComponentType<any>
  sx?: React.CSSProperties
}

/**
 * Utility to toggle rendering a styled component or a "plain" component based
 * on the provided `as` prop. When the provided feature flag is enabled, the
 * props will be passed through to an element or component created with the `as`
 * prop. When it is disabled, the provided styled component is used instead.
 *
 * @param flag - the feature flag that will control whether or not the provided
 * styled component is used
 * @param defaultAs - the default component to use when `as` is not provided
 * @param Component - the styled component that will be used if the feature flag
 * is disabled
 */
export function toggleStyledComponent<T, P extends CSSModulesProps>(
  flag: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultAs: string | React.ComponentType<any>,
  Component: React.ComponentType<P>,
) {
  const Wrapper = React.forwardRef<T, P>(function Wrapper(
    {as: BaseComponent = defaultAs, sx: sxProp = defaultSxProp, ...rest},
    ref,
  ) {
    const enabled = useFeatureFlag(flag)
    if (enabled) {
      if (sxProp !== defaultSxProp) {
        return <Box as={BaseComponent} {...rest} sx={sxProp} ref={ref} />
      }
      return <BaseComponent {...rest} ref={ref} />
    }
    return <Component as={BaseComponent} {...(rest as unknown as P)} sx={sxProp} ref={ref} />
  })

  return Wrapper
}

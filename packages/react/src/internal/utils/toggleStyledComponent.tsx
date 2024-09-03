import React from 'react'
import {useFeatureFlag} from '../../FeatureFlags'

type CSSModulesProps = {
  as?: string | React.ComponentType<any>
}

/**
 * Utility to toggle rendering a styled component or a "plain" component based
 * on the provided `as` prop. When the provided feature flag is enabled, the
 * props will be passed through to an element or component created with the `as`
 * prop. When it is disabled, the provided styled component is used instead.
 *
 * @param flag - the feature flag that will control whether or not the provided
 * styled component is used
 * @param Component - the styled component that will be used if the feature flag
 * is disabled
 */
export function toggleStyledComponent<T, P extends CSSModulesProps>(flag: string, Component: React.ComponentType<P>) {
  const Wrapper = React.forwardRef<T, P>(function Wrapper({as: BaseComponent = 'div', ...rest}, ref) {
    const enabled = useFeatureFlag(flag)
    if (enabled) {
      return <BaseComponent {...rest} ref={ref} />
    }
    return <Component as={BaseComponent} {...(rest as P)} ref={ref} />
  })

  return Wrapper
}

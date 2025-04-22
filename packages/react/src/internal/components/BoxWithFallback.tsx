import React from 'react'
import Box from '../../Box'
import {defaultSxProp} from '../../utils/defaultSxProp'
import type {StyledComponent} from 'styled-components'
import {includesSystemProps} from '../../utils/includeSystemProps'

const BoxWithFallback = React.forwardRef(function BoxWithFallback(
  {as: BaseComponent = 'div', sx = defaultSxProp, ...rest},
  ref,
) {
  if (sx !== defaultSxProp || includesSystemProps(rest)) {
    return <Box {...rest} ref={ref} as={BaseComponent} sx={sx} />
  }
  return <BaseComponent {...rest} ref={ref} />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as StyledComponent<'div', any, React.ComponentPropsWithoutRef<typeof Box>, never>

export {BoxWithFallback}

import React from 'react'
import Box from '../../Box'
import {defaultSxProp} from '../../utils/defaultSxProp'

type BoxWithFallbackProps = React.ComponentPropsWithoutRef<typeof Box>

function BoxWithFallback({as: BaseComponent = 'div', sx = defaultSxProp, ...rest}: BoxWithFallbackProps) {
  if (sx !== defaultSxProp) {
    return <Box {...rest} as={BaseComponent} sx={sx} />
  }
  return <BaseComponent {...rest} />
}

export {BoxWithFallback}
export type {BoxWithFallbackProps}

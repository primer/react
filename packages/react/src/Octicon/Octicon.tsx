import type {IconProps} from '@primer/octicons-react'
import React from 'react'

/**
 * @deprecated Use the icon component directly from `@primer/octicons-react` instead
 */
export type OcticonProps = {icon: React.ElementType; as?: React.ElementType} & IconProps

/**
 * @deprecated Use the icon component directly from `@primer/octicons-react` instead
 */
const Octicon = React.forwardRef((props: OcticonProps, ref: React.Ref<SVGSVGElement>) => {
  const {icon: IconComponent, ...rest} = props
  return <IconComponent {...rest} ref={ref} />
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Octicon.__SLOT__ = Symbol('DEPRECATED_Octicon')

export default Octicon

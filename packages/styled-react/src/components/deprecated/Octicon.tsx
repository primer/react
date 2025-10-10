import {Octicon as PrimerOcticon, type OcticonProps as PrimerOcticonProps} from '@primer/react/deprecated'
import styled from 'styled-components'
import {type SxProp, sx} from '../../sx'
import {forwardRef} from 'react'

/**
 * @deprecated Use the icon component directly from `@primer/octicons-react` instead
 */
export type OcticonProps = PrimerOcticonProps & SxProp & {color?: string}

/**
 * @deprecated Use the icon component directly from `@primer/octicons-react` instead
 */
const StyledOcticon = styled(PrimerOcticon).withConfig<OcticonProps>({
  shouldForwardProp(prop) {
    return prop !== 'sx'
  },
})`
  ${({color, sx: sxProp}) => sx({sx: {color, ...sxProp}})}
`

const Octicon = forwardRef(({as, ...props}: OcticonProps, ref) => {
  return <StyledOcticon {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Octicon.__SLOT__ = PrimerOcticon.__SLOT__

export default Octicon
export {Octicon}

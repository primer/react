import {forwardRef} from 'react'
import {Heading as PrimerHeading, type HeadingProps as PrimerHeadingProps} from '@primer/react'
import {Box} from './Box'
import type {SxProp} from '../sx'

type HeadingProps = PrimerHeadingProps & SxProp

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(props, ref) {
  return <Box as={PrimerHeading} ref={ref} {...props} />
})

export {Heading, type HeadingProps}

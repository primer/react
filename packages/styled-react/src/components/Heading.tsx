import {Heading as PrimerHeading} from '@primer/react'
import type {HeadingProps as PrimerHeadingProps} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {ForwardRefComponent} from '../polymorphic'
import type {SxProp} from '../sx'

type HeadingProps = PrimerHeadingProps & SxProp

const Heading = forwardRef(function Heading(props, ref) {
  return <Box ref={ref} as={PrimerHeading} {...props} />
}) as ForwardRefComponent<'h2', HeadingProps>

export {Heading, type HeadingProps}

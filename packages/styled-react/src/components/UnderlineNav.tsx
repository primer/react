import React, {type PropsWithChildren} from 'react'
import {UnderlineNav as PrimerUnderlineNav, Box} from '@primer/react'
import type {
  UnderlineNavProps as PrimerUnderlineNavProps,
  UnderlineNavItemProps as PrimerUnderlineNavItemProps,
} from '@primer/react'
import type {SxProp} from '../sx'

type UnderlineNavProps = PropsWithChildren<PrimerUnderlineNavProps> & SxProp

const UnderlineNavImpl = React.forwardRef<HTMLDivElement, UnderlineNavProps>((props, ref) => {
  return <Box as={PrimerUnderlineNav} ref={ref} {...props} />
})

type UnderlineNavItemProps = PropsWithChildren<PrimerUnderlineNavItemProps> & SxProp

const UnderlineNavItem = React.forwardRef<HTMLAnchorElement, UnderlineNavItemProps>((props, ref) => {
  return <Box as={PrimerUnderlineNav.Item} ref={ref} {...props} />
})

// TODO: figure out why we need a type assertion here and try to remove it
const UnderlineNav = Object.assign(UnderlineNavImpl, {
  Item: UnderlineNavItem,
})

export {UnderlineNav}
export type {UnderlineNavProps, UnderlineNavItemProps}

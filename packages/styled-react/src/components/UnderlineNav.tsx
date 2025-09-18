import React, {type PropsWithChildren, type ComponentProps} from 'react'
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

const UnderlineNav = Object.assign(UnderlineNavImpl, {
  Item: UnderlineNavItem as React.FC<React.PropsWithChildren<ComponentProps<typeof PrimerUnderlineNav.Item>> & SxProp>,
})

export {UnderlineNav}
export type {UnderlineNavProps, UnderlineNavItemProps}

import React from 'react'
import classes from './ButtonGroup.module.css'
import {clsx} from 'clsx'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {useProvidedRefOrCreate} from '../hooks'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'
import type {SxProp} from '../sx'

export type ButtonGroupProps = {
  /** The role of the group */
  role?: string
  /** className passed in for styling */
  className?: string
} & SxProp

const ButtonGroup = React.forwardRef<HTMLElement, ButtonGroupProps>(function ButtonGroup(
  {className, role, sx, ...rest},
  forwardRef,
) {
  const buttonRef = useProvidedRefOrCreate(forwardRef as React.RefObject<HTMLDivElement>)

  useFocusZone({
    containerRef: buttonRef,
    disabled: role !== 'toolbar',
    bindKeys: FocusKeys.ArrowHorizontal,
    focusOutBehavior: 'wrap',
  })

  if (sx !== defaultSxProp) {
    return (
      <Box as="div" className={clsx(className, classes.ButtonGroup)} role={role} {...rest} sx={sx} ref={buttonRef} />
    )
  }

  return <div ref={buttonRef} className={clsx(className, classes.ButtonGroup)} role={role} {...rest} />
}) as PolymorphicForwardRefComponent<'div', ButtonGroupProps>

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup

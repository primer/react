import React, {type PropsWithChildren} from 'react'
import classes from './ButtonGroup.module.css'
import {clsx} from 'clsx'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {useProvidedRefOrCreate} from '../hooks'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type ButtonGroupProps = PropsWithChildren<{
  /** The role of the group */
  role?: string
  /** className passed in for styling */
  className?: string
}>

const ButtonGroup = React.forwardRef(function ButtonGroup(
  {as: BaseComponent = 'div', children, className, role, ...rest},
  forwardRef,
) {
  const buttons = React.Children.map(children, (child, index) => <div key={index}>{child}</div>)
  const buttonRef = useProvidedRefOrCreate(forwardRef as React.RefObject<HTMLDivElement>)

  useFocusZone({
    containerRef: buttonRef,
    disabled: role !== 'toolbar',
    bindKeys: FocusKeys.ArrowHorizontal,
    focusOutBehavior: 'wrap',
  })

  return (
    <BaseComponent {...rest} ref={buttonRef} className={clsx(className, classes.ButtonGroup)} role={role}>
      {buttons}
    </BaseComponent>
  )
}) as PolymorphicForwardRefComponent<'div', ButtonGroupProps>

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup

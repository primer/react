import React, {useRef, type PropsWithChildren} from 'react'
import classes from './ButtonGroup.module.css'
import {clsx} from 'clsx'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {useCombinedRefs} from '../hooks'
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
  const buttonRef = useRef<HTMLDivElement>(null)
  const combinedRef = useCombinedRefs(buttonRef, forwardRef)

  useFocusZone({
    containerRef: buttonRef,
    disabled: role !== 'toolbar',
    bindKeys: FocusKeys.ArrowHorizontal,
    focusOutBehavior: 'wrap',
  })

  return (
    <BaseComponent ref={combinedRef} className={clsx(className, classes.ButtonGroup)} role={role} {...rest}>
      {buttons}
    </BaseComponent>
  )
}) as PolymorphicForwardRefComponent<'div', ButtonGroupProps>

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup

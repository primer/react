import React, {useRef, type PropsWithChildren} from 'react'
import classes from './ButtonGroup.module.css'
import {clsx} from 'clsx'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {useMergedRefs, useProvidedRefOrCreate} from '../hooks'
import {useFeatureFlag} from '../FeatureFlags'
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
  const mergedRefEnabled = useFeatureFlag('primer_react_merged_forwarded_refs')
  const internalRef = useRef<HTMLDivElement>(null)
  const mergedRef = useMergedRefs(internalRef, forwardRef)
  const providedOrCreatedRef = useProvidedRefOrCreate(forwardRef as React.RefObject<HTMLDivElement | null>)
  const buttonRef = mergedRefEnabled ? internalRef : providedOrCreatedRef
  const appliedRef = mergedRefEnabled ? mergedRef : providedOrCreatedRef
  const buttons = React.Children.map(children, (child, index) => (
    <div key={index} className={classes.Item}>
      {child}
    </div>
  ))

  useFocusZone({
    containerRef: buttonRef,
    disabled: role !== 'toolbar',
    bindKeys: FocusKeys.ArrowHorizontal,
    focusOutBehavior: 'wrap',
  })

  return (
    <BaseComponent
      // @ts-expect-error it needs a non nullable ref
      ref={appliedRef}
      className={clsx(className, classes.ButtonGroup)}
      role={role}
      {...rest}
      data-component="ButtonGroup"
    >
      {buttons}
    </BaseComponent>
  )
}) as PolymorphicForwardRefComponent<'div', ButtonGroupProps>

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup

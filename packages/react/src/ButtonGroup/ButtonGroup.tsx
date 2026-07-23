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
  const buttonRef = useRef<HTMLDivElement>(null)
  const mergedRef = useMergedRefs(buttonRef, forwardRef)
  // Feature-flag scaffolding for `primer_react_merged_forwarded_refs`.
  // At graduation: remove the three declarations below, and replace all instances of `readRef` with `buttonRef` and `appliedRef` with `mergedRef`.
  const providedOrCreatedRef = useProvidedRefOrCreate(forwardRef as React.RefObject<HTMLDivElement | null>)
  const readRef = mergedRefEnabled ? buttonRef : providedOrCreatedRef
  const appliedRef = mergedRefEnabled ? mergedRef : providedOrCreatedRef
  const buttons = React.Children.map(children, (child, index) => (
    <div key={index} className={classes.Item}>
      {child}
    </div>
  ))

  useFocusZone({
    containerRef: readRef,
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

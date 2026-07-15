import React, {createContext, useContext} from 'react'
import {mergeProps} from '../utils/mergeProps'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {useAnchorPosition} from './useAnchorPosition'
import type {
  Alignment,
  AnchorName,
  AnchorPositionTargetOptions,
  FallbackStrategy,
  Placement,
  UseAnchorPositionConfig,
  UseAnchorPositionReturn,
} from './useAnchorPosition'

type RootProps = React.PropsWithChildren<UseAnchorPositionConfig>

type AnchorProps = React.ComponentPropsWithoutRef<'div'>

type TargetProps = React.ComponentPropsWithoutRef<'div'> & AnchorPositionTargetOptions

const AnchorPositionContext = createContext<UseAnchorPositionReturn | null>(null)

function useAnchorPositionContext() {
  const context = useContext(AnchorPositionContext)
  if (context) {
    return context
  }
  throw new Error('AnchorPosition components must be used within AnchorPosition.Root')
}

function Root({anchorName: customAnchorName, children}: RootProps) {
  const value = useAnchorPosition({anchorName: customAnchorName})

  return <AnchorPositionContext.Provider value={value}>{children}</AnchorPositionContext.Provider>
}

const Anchor = React.forwardRef(function Anchor({as: Component = 'div', ...rest}, forwardedRef) {
  const {getAnchorProps} = useAnchorPositionContext()
  const anchorProps = getAnchorProps()

  return <Component {...mergeProps(anchorProps, rest)} ref={forwardedRef} />
}) as PolymorphicForwardRefComponent<'div', AnchorProps>

const Target = React.forwardRef(function Target(
  {as: Component = 'div', alignment = 'start', fallbackStrategy = 'default', gap, placement = 'below', ...rest},
  forwardedRef,
) {
  const {getTargetProps} = useAnchorPositionContext()
  const targetProps = getTargetProps({
    alignment,
    fallbackStrategy,
    gap,
    placement,
  })

  return <Component {...mergeProps(targetProps, rest)} ref={forwardedRef} />
}) as PolymorphicForwardRefComponent<'div', TargetProps>

export {Root, Anchor, Target}
export type {RootProps, AnchorProps, TargetProps, AnchorName, Placement, Alignment, FallbackStrategy}

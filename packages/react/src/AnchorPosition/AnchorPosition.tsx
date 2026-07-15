import React, {createContext, useContext} from 'react'
import {useRender} from '../hooks/useRender'
import type {RenderComponentProps, RenderProp} from '../hooks/useRender'
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

type AnchorProps = RenderComponentProps<'div'>

type TargetProps = RenderComponentProps<'div'> & AnchorPositionTargetOptions

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

type AnchorInternalProps = AnchorProps & {
  as?: React.ElementType
}

const Anchor = React.forwardRef<HTMLElement, AnchorInternalProps>(function Anchor(
  {as: Component, render, ...rest},
  forwardedRef,
) {
  const {getAnchorProps} = useAnchorPositionContext()

  return useRender({
    defaultTagName: 'div',
    render: resolveRenderProp(Component, render),
    props: mergeProps(getAnchorProps(), rest),
    ref: forwardedRef,
  })
}) as PolymorphicForwardRefComponent<'div', AnchorProps>

type TargetInternalProps = TargetProps & {
  as?: React.ElementType
}

const Target = React.forwardRef<HTMLElement, TargetInternalProps>(function Target(
  {as: Component, alignment = 'start', fallbackStrategy = 'default', gap, placement = 'below', render, ...rest},
  forwardedRef,
) {
  const {getTargetProps} = useAnchorPositionContext()

  return useRender({
    defaultTagName: 'div',
    render: resolveRenderProp(Component, render),
    props: mergeProps(
      getTargetProps({
        alignment,
        fallbackStrategy,
        gap,
        placement,
      }),
      rest,
    ),
    ref: forwardedRef,
  })
}) as PolymorphicForwardRefComponent<'div', TargetProps>

function resolveRenderProp(
  Component: React.ElementType | undefined,
  render: RenderProp<React.ComponentPropsWithRef<'div'>> | undefined,
) {
  if (Component && render) {
    throw new Error('AnchorPosition components cannot use both `as` and `render`')
  }

  return render ?? (Component ? React.createElement(Component) : undefined)
}

export {Root, Anchor, Target}
export type {RootProps, AnchorProps, TargetProps, AnchorName, Placement, Alignment, FallbackStrategy}

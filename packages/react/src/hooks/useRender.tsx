import React from 'react'
import {isExperimentalReactVersion, reactMajorVersion} from '../utils/environment'
import {mergeProps} from '../utils/mergeProps'
import {useMergedRefs} from './useMergedRefs'

type EmptyState = Record<never, never>

type RenderFunction<Props, State extends object> = (props: Props, state: State) => React.ReactElement

type RenderProp<Props, State extends object = EmptyState> = React.ReactElement | RenderFunction<Props, State>

type RenderElementProps<Element extends React.ElementType> = React.ComponentPropsWithRef<Element>

type RenderComponentProps<
  Element extends React.ElementType,
  State extends object = EmptyState,
  RenderFunctionProps = RenderElementProps<Element>,
> = Omit<React.ComponentPropsWithoutRef<Element>, 'render'> & {
  /**
   * Replaces the default rendered element or composes the component with another component.
   */
  render?: RenderProp<RenderFunctionProps, State>
}

type UseRenderParameters<DefaultElement extends React.ElementType, State extends object = EmptyState> = {
  /**
   * The element rendered when `render` is not provided.
   */
  defaultTagName: DefaultElement
  /**
   * The element or render function used to replace the default element.
   */
  render?: RenderProp<RenderElementProps<DefaultElement>, State>
  /**
   * Props applied to the rendered element.
   */
  props: RenderElementProps<DefaultElement>
  /**
   * An additional ref applied to the rendered HTML element.
   */
  ref?: React.Ref<HTMLElement>
} & (keyof State extends never ? {state?: State} : {state: State})

const supportsRefAsProp = reactMajorVersion >= 19 || isExperimentalReactVersion

/**
 * Renders a default element or composes its props and ref with a custom element.
 */
function useRender<DefaultElement extends React.ElementType, State extends object = EmptyState>({
  defaultTagName,
  render,
  props,
  state,
  ref,
}: UseRenderParameters<DefaultElement, State>): React.ReactElement {
  const renderElement = React.isValidElement(render) ? render : null
  const propsRef = (props as {ref?: React.Ref<HTMLElement>}).ref
  const renderElementRef = renderElement ? getElementRef(renderElement) : undefined
  const componentRef = useMergedRefs(propsRef, ref)
  const mergedRef = useMergedRefs(componentRef, renderElementRef)
  const propsWithRef = {
    ...props,
    ref: mergedRef,
  } as RenderElementProps<DefaultElement>

  if (typeof render === 'function') {
    return render(propsWithRef, state ?? ({} as State))
  }

  if (render !== undefined && !renderElement) {
    throw new Error('useRender expected `render` to be a React element or function')
  }

  if (renderElement) {
    const element = renderElement as React.ReactElement<Record<string, unknown>>
    const mergedProps = mergeProps(propsWithRef as Record<string, unknown>, element.props)

    return React.cloneElement(element, {
      ...mergedProps,
      ref: mergedRef,
    })
  }

  return React.createElement(defaultTagName, propsWithRef)
}

function getElementRef(element: React.ReactElement): React.Ref<HTMLElement> | undefined {
  if (supportsRefAsProp) {
    return (element.props as {ref?: React.Ref<HTMLElement>}).ref
  }

  return (element as React.ReactElement & {ref?: React.Ref<HTMLElement>}).ref
}

export {useRender}
export type {RenderComponentProps, RenderElementProps, RenderFunction, RenderProp, UseRenderParameters}

import React from 'react'
import {useRender} from './useRender'
import type {RenderComponentProps} from './useRender'

type ExampleState = {
  disabled: boolean
}

type ExampleProps = RenderComponentProps<'button', ExampleState>

const Example = React.forwardRef<HTMLButtonElement, ExampleProps>(function Example({render, ...rest}, forwardedRef) {
  return useRender({
    defaultTagName: 'button',
    props: rest,
    ref: forwardedRef,
    render,
    state: {
      disabled: rest.disabled ?? false,
    },
  })
})

export function shouldAcceptDefaultElementProps() {
  return <Example disabled type="button" />
}

export function shouldAcceptATypeCheckedRenderElement() {
  return <Example render={<a href="/example">Example</a>} />
}

export function shouldTypeRenderFunctionPropsAndState() {
  return (
    <Example
      render={(props, state) => {
        props.disabled
        state.disabled

        // @ts-expect-error href is not a button prop
        props.href

        return <button type="button" {...props} data-disabled={state.disabled} />
      }}
    />
  )
}

export function shouldRejectInvalidDefaultElementProps() {
  // @ts-expect-error href is not a button prop
  return <Example href="/example" />
}

export function shouldRequireStateWhenStateHasProperties() {
  function MissingState() {
    // @ts-expect-error state is required when it has properties
    return useRender<'button', ExampleState>({
      defaultTagName: 'button',
      props: {
        children: 'Missing state',
        type: 'button',
      },
      render: props => <button type="button" {...props} />,
    })
  }

  return <MissingState />
}

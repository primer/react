import {render} from '@testing-library/react'
import React, {useState} from 'react'
import {useProvidedStateOrCreate} from '../../hooks/useProvidedStateOrCreate'

it('will use the provided state', () => {
  const Component = () => {
    const [state, setState] = useState('foo')
    const [combinedState] = useProvidedStateOrCreate(state, setState, 'bar')
    return <div>{combinedState}</div>
  }

  const doc = render(<Component />)
  expect(doc.baseElement.textContent).toEqual('foo')
})

it('will set state correctly when provided a set state method', () => {
  const Component = () => {
    const [state, setState] = useState('foo')
    const [combinedState, setCombinedState] = useProvidedStateOrCreate(state, setState, 'bar')
    if (combinedState !== 'baz') setCombinedState('baz')
    return <div>{combinedState}</div>
  }

  const doc = render(<Component />)
  expect(doc.baseElement.textContent).toEqual('baz')
})

it('if not provided a state, will use an internal state', () => {
  const Component = () => {
    const state = undefined
    const setState = undefined
    const [combinedState, setCombinedState] = useProvidedStateOrCreate(state, setState, '')
    if (combinedState !== 'bar') setCombinedState('bar')
    return <div>{combinedState}</div>
  }

  const doc = render(<Component />)
  expect(doc.baseElement.textContent).toEqual('bar')
})

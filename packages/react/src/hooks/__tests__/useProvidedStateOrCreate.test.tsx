import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {it, expect} from 'vitest'
import {useProvidedStateOrCreate} from '../../hooks/useProvidedStateOrCreate'
import {useState} from 'react'

it('will use the provided state', async () => {
  const Component = () => {
    const [state, setState] = useState('foo')
    const [combinedState] = useProvidedStateOrCreate(state, setState, 'bar')
    return <div>{combinedState}</div>
  }

  render(<Component />)
  await expect.element(page.getByText('foo', {exact: true})).toBeInTheDocument()
})

it('will set state correctly when provided a set state method', async () => {
  const Component = () => {
    const [state, setState] = useState('foo')
    const [combinedState, setCombinedState] = useProvidedStateOrCreate(state, setState, 'bar')
    if (combinedState !== 'baz') setCombinedState('baz')
    return <div>{combinedState}</div>
  }

  render(<Component />)
  await expect.element(page.getByText('baz', {exact: true})).toBeInTheDocument()
})

it('if not provided a state, will use an internal state', async () => {
  const Component = () => {
    const state = undefined
    const setState = undefined
    const [combinedState, setCombinedState] = useProvidedStateOrCreate(state, setState, '')
    if (combinedState !== 'bar') setCombinedState('bar')
    return <div>{combinedState}</div>
  }

  render(<Component />)
  await expect.element(page.getByText('bar', {exact: true})).toBeInTheDocument()
})

import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, test, vi} from 'vitest'
import type React from 'react'
import {useState} from 'react'
import {useControllableState} from '../useControllableState'

describe('useControllableState', () => {
  test('uncontrolled', async () => {
    const {getByTestId} = render(<TextInput />)
    const input = getByTestId('input')
    await userEvent.type(input, 'test')
    expect(input).toHaveValue('test')
  })

  test('controlled', async () => {
    const {getByTestId} = render(<ControlledTextInput />)
    const input = getByTestId('input')
    await userEvent.type(input, 'test')
    expect(input).toHaveValue('test')
  })

  test('controlled to uncontrolled', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const {getByTestId} = render(<Toggle defaultControlled />)
    await userEvent.click(getByTestId('toggle'))

    expect(error).toHaveBeenCalled()
    expect(warn).toHaveBeenCalled()

    error.mockRestore()
    warn.mockRestore()
  })

  test('uncontrolled to controlled', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const {getByTestId} = render(<Toggle defaultControlled={false} />)
    await userEvent.click(getByTestId('toggle'))

    expect(warn).toHaveBeenCalled()

    warn.mockRestore()
  })
})

function TextInput({onChange, value: controlledValue}: {onChange?: (value: string) => void; value?: string}) {
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue: '',
    onChange,
  })

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value)
  }

  return <input data-testid="input" type="text" onChange={handleOnChange} value={value} />
}

function ControlledTextInput() {
  const [value, setValue] = useState('')
  return <TextInput value={value} onChange={setValue} />
}

function Toggle({defaultControlled}: {defaultControlled: boolean}) {
  const [value, setValue] = useState('')
  const [controlled, setControlled] = useState(defaultControlled)
  return (
    <>
      <TextInput value={controlled ? value : undefined} onChange={controlled ? setValue : undefined} />
      <button
        data-testid="toggle"
        type="button"
        onClick={() => {
          setControlled(!controlled)
        }}
      >
        toggle
      </button>
    </>
  )
}

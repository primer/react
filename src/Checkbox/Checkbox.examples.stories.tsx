import React, {useRef, useState} from 'react'
import {Box, Checkbox} from '..'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {action} from '@storybook/addon-actions'
import FormControl from '../FormControl'

export default {
  title: 'Components/Checkbox/Examples',
}

export const Controlled = () => {
  const [isChecked, setChecked] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    action('Change event triggered')()
  }

  return (
    <Box as="form">
      <FormControl>
        <Checkbox value="default" onChange={handleChange} checked={isChecked} />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </Box>
  )
}

export const Uncontrolled = () => {
  const checkboxRef = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false
    }
  }, [])

  return (
    <Box as="form">
      <FormControl>
        <Checkbox ref={checkboxRef} />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </Box>
  )
}

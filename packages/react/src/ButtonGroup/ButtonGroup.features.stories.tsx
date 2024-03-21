import React, {useState} from 'react'
import ButtonGroup from './ButtonGroup'
import {IconButton, Button} from '../Button'
import {PlusIcon, DashIcon} from '@primer/octicons-react'

export default {
  title: 'Components/ButtonGroup/Features',
}

export const IconButtons = () => (
  <ButtonGroup>
    <IconButton icon={PlusIcon} aria-label="Add" />
    <IconButton icon={DashIcon} aria-label="Subtract" />
  </ButtonGroup>
)

export const LoadingButtons = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
  }
  return (
    <ButtonGroup>
      <Button loading={isLoading} onClick={handleClick}>
        Button 1
      </Button>
      <Button onClick={handleClick}>Button 2</Button>
      <Button onClick={handleClick}>Button 3</Button>
    </ButtonGroup>
  )
}

import {DashIcon, PlusIcon} from '@primer/octicons-react'
import {ComponentMeta} from '@storybook/react'
import React from 'react'
import {IconButton} from '../Button'
import ButtonGroup from './ButtonGroup'

export default {
  title: 'Components/ButtonGroup/Features',
  component: ButtonGroup,
} as ComponentMeta<typeof ButtonGroup>

export const IconButtons = () => (
  <ButtonGroup>
    <IconButton icon={PlusIcon} aria-label="Add" />
    <IconButton icon={DashIcon} aria-label="Subtract" />
  </ButtonGroup>
)

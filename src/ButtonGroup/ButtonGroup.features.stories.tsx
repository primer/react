import React from 'react'
import {ComponentMeta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {IconButton} from '../Button'
import {PlusIcon, DashIcon} from '@primer/octicons-react'

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

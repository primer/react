import React from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {IconButton} from '../Button'
import {PlusIcon, DashIcon} from '@primer/octicons-react'

export default {
  title: 'Components/ButtonGroup/Features',
  component: ButtonGroup,
} as Meta<typeof ButtonGroup>

export const IconButtons = () => (
  <ButtonGroup>
    {/* We can remove these unsafe props after we resolve https://github.com/primer/react/issues/4129 */}
    <IconButton unsafeDisableTooltip={true} icon={PlusIcon} aria-label="Add" />
    <IconButton unsafeDisableTooltip={true} icon={DashIcon} aria-label="Subtract" />
  </ButtonGroup>
)

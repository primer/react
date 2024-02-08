import React from 'react'
import {ComponentMeta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {Button, IconButton} from '../Button'
import {PlusIcon, DashIcon} from '@primer/octicons-react'
import {Tooltip as TooltipV2} from '../drafts'
import {Tooltip} from '..'
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

export const IconButtonsWithTooltip = () => (
  <ButtonGroup>
    <Tooltip text="Add" direction="s">
      <IconButton icon={PlusIcon} aria-label="Add" />
    </Tooltip>
    <Tooltip text="Subtract" direction="s">
      <IconButton icon={DashIcon} aria-label="Subtract" />
    </Tooltip>
  </ButtonGroup>
)

export const ButtonGroupWithTooltip = () => (
  <ButtonGroup>
    <Tooltip text="Add" direction="s">
      <Button>Add</Button>
    </Tooltip>
    <Tooltip text="Subtract" direction="s">
      <Button>Subtract</Button>
    </Tooltip>
  </ButtonGroup>
)

export const LinksWithTooltip = () => (
  <ButtonGroup>
    <Tooltip text="Add" direction="s">
      <Button as="a" href="https://primer.style">
        Add
      </Button>
    </Tooltip>
    <Tooltip text="Subtract" direction="s">
      <Button as="a" href="https://primer.style">
        Subtract
      </Button>
    </Tooltip>
  </ButtonGroup>
)

export const IconButtonsWithTooltip2 = () => (
  <ButtonGroup>
    <TooltipV2 text="Add" type="label">
      <IconButton icon={PlusIcon} aria-label="Add" />
    </TooltipV2>
    <TooltipV2 text="Subtract" type="label">
      <IconButton icon={DashIcon} aria-label="Subtract" />
    </TooltipV2>
  </ButtonGroup>
)

export const LinksWithTooltip2 = () => (
  <ButtonGroup>
    <TooltipV2 text="Add" type="label">
      <IconButton as="a" icon={PlusIcon} aria-label="Add" href="https://primer.style" />
    </TooltipV2>
    <TooltipV2 text="Subtract" type="label">
      <IconButton as="a" icon={DashIcon} aria-label="Subtract" href="https://primer.style" />
    </TooltipV2>
  </ButtonGroup>
)

export const ButtonGroupWithTooltip2 = () => (
  <ButtonGroup>
    <TooltipV2 text="Add">
      <Button>Add</Button>
    </TooltipV2>
    <TooltipV2 text="Subtract">
      <Button>Subtract</Button>
    </TooltipV2>
  </ButtonGroup>
)

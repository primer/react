import React from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {Button, IconButton} from '../Button'
import {PlusIcon, DashIcon, CopilotIcon} from '@primer/octicons-react'
import {Tooltip as TooltipV2} from '../drafts'
import {Box, Tooltip, ThemeProvider, BaseStyles} from '..'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup/DevOnly',
  component: ButtonGroup,
  decorators: [
    Story => {
      // Add some padding to the wrapper box to make sure tooltip v1 is always in the viewport
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box padding={5}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
}

export default meta

export const IconButtonsWithTooltip1 = () => (
  <ButtonGroup>
    <Tooltip text="Add" direction="s">
      <IconButton icon={PlusIcon} aria-label="Add" />
    </Tooltip>
    <Tooltip text="Subtract" direction="s">
      <IconButton icon={DashIcon} aria-label="Subtract" />
    </Tooltip>
  </ButtonGroup>
)

export const LinksWithTooltip1 = () => (
  <ButtonGroup>
    <Tooltip text="Additonal text for link 1" direction="s">
      <Button as="a" href="https://primer.style">
        Sample Link 1
      </Button>
    </Tooltip>
    <Tooltip text="Additonal text for link 2" direction="s">
      <Button as="a" href="https://primer.style">
        Sample Link 2
      </Button>
    </Tooltip>
  </ButtonGroup>
)

export const LinksWithTooltip2 = () => (
  <ButtonGroup>
    <TooltipV2 text="Additonal text for link 1" direction="s">
      <Button as="a" href="https://primer.style">
        Sample Link 1
      </Button>
    </TooltipV2>
    <TooltipV2 text="Additonal text for link 2" direction="s">
      <Button as="a" href="https://primer.style">
        Sample Link 2
      </Button>
    </TooltipV2>
  </ButtonGroup>
)

export const LinkAndButtonWithTooltip1 = () => (
  <ButtonGroup sx={{pl: 2}}>
    <Tooltip text="Additional info about the link">
      <Button as="a" href="https://primer.style">
        Link
      </Button>
    </Tooltip>
    <Tooltip text="Open GitHub Copilot chat" direction="s">
      <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
    </Tooltip>
  </ButtonGroup>
)

export const ButtonAndLinkWithTooltip1 = () => (
  <ButtonGroup sx={{pl: 2}}>
    <Tooltip text="Open GitHub Copilot chat" direction="se">
      <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
    </Tooltip>
    <Tooltip text="Additional info about the link">
      <Button as="a" href="https://primer.style">
        Link
      </Button>
    </Tooltip>
  </ButtonGroup>
)

export const LinkAndButtonWithTooltip2 = () => (
  <ButtonGroup sx={{pl: 2}}>
    <TooltipV2 text="Additional info about the link">
      <Button as="a" href="https://primer.style">
        Link
      </Button>
    </TooltipV2>
    <TooltipV2 text="Open GitHub Copilot chat" direction="s">
      <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
    </TooltipV2>
  </ButtonGroup>
)

export const ButtonAndLinkWithTooltip2 = () => (
  <ButtonGroup sx={{pl: 2}}>
    <TooltipV2 text="Open GitHub Copilot chat" direction="s">
      <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
    </TooltipV2>
    <TooltipV2 text="Additional info about the link">
      <Button as="a" href="https://primer.style">
        Link
      </Button>
    </TooltipV2>
  </ButtonGroup>
)

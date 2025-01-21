import React from 'react'
import type {Meta} from '@storybook/react'
import ButtonGroup from './ButtonGroup'
import {Button, IconButton, LinkButton} from '../Button'
import {CopilotIcon} from '@primer/octicons-react'
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

export const LinkAndButtonWithTooltip2 = () => (
  <ButtonGroup sx={{pl: 2}}>
    <Tooltip text="Additional info about the link">
      <Button as="a" href="https://primer.style">
        Link
      </Button>
    </Tooltip>
    <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
  </ButtonGroup>
)

export const ButtonAndLinkWithTooltip2 = () => (
  <ButtonGroup sx={{pl: 2}}>
    <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
    <Tooltip text="Additional info about the link">
      <Button as="a" href="https://primer.style">
        Link
      </Button>
    </Tooltip>
  </ButtonGroup>
)

export const ButtonGroupSingleButton = () => (
  <ButtonGroup>
    <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
    <div></div>
  </ButtonGroup>
)

export const LinkButtonWithIconButtons = () => (
  <ButtonGroup>
    <LinkButton size="small" sx={{color: 'deeppink'}} href="https://primer.style">
      Small link
    </LinkButton>
    <Button className="testCustomClassnameColor">Pink link</Button>
    <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
    <IconButton icon={CopilotIcon} aria-label="Open GitHub Copilot chat" />
  </ButtonGroup>
)

export const SxProp = () => (
  <ButtonGroup sx={{border: '1px solid red'}}>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)

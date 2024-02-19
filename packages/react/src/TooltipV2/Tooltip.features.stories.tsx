import React from 'react'
import {IconButton, Button, Box, Link, Octicon, ActionMenu, ActionList} from '..'
import {Tooltip} from './Tooltip'
import {SearchIcon, BookIcon, CheckIcon, TriangleDownIcon, GitBranchIcon} from '@primer/octicons-react'

export default {
  title: 'Components/TooltipV2/Features',
  component: Tooltip,
}

export const AnchorHasMargin = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Tooltip is still centered">
      <Button sx={{marginLeft: 3}}>Button has 16px margin Left</Button>
    </Tooltip>
  </Box>
)

export const LabelType = () => (
  <Box>
    <Tooltip text="Contribution Documentation for 'Primer React'" type="label">
      <Link href="https://github.com/primer/react/contributor-docs/CONTRIBUTING.md" sx={{ml: 1, color: 'fg.muted'}}>
        <Octicon icon={BookIcon} sx={{color: 'fg.muted'}} />
      </Link>
    </Tooltip>
  </Box>
)

// As a supplementary description for a button
export const DescriptionType = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Supplementary text" direction="n">
      <Button>Save</Button>
    </Tooltip>
  </Box>
)

// As a supplementary description for an IconButton
export const IconButtonWithDescription = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Supplementary text for icon button" direction="e">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)

export const AllDirections = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip direction="n" text="Supplementary text">
      <Button>North</Button>
    </Tooltip>
    <Tooltip direction="s" text="Supplementary text">
      <Button>South</Button>
    </Tooltip>
    <Tooltip direction="e" text="Supplementary text">
      <Button>East</Button>
    </Tooltip>
    <Tooltip direction="w" text="Supplementary text">
      <Button>West</Button>
    </Tooltip>
    <Tooltip direction="ne" text="Supplementary text">
      <Button>North East</Button>
    </Tooltip>
    <Tooltip direction="nw" text="Supplementary text">
      <Button>North West</Button>
    </Tooltip>
    <Tooltip direction="se" text="Supplementary text">
      <Button>Southeast</Button>
    </Tooltip>
    <Tooltip direction="sw" text="Supplementary text">
      <Button>Southwest</Button>
    </Tooltip>
  </Box>
)

export const MultilineText = () => (
  <Box>
    <Tooltip
      direction="e"
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
    >
      <Button>Multiline East</Button>
    </Tooltip>
  </Box>
)

export const CalculatedDirection = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip direction="w" text="But appears in the east direction due to not having enough space in the west">
      <Button>West</Button>
    </Tooltip>

    <Tooltip text="The direction here is north by default but there is not enough space in the north therefore the tooltip appears in the south">
      <Button>North</Button>
    </Tooltip>
  </Box>
)

export const OnActionMenuAnchor = () => (
  <Box sx={{display: 'flex', padding: 5, gap: 2}}>
    <ActionMenu>
      <ActionMenu.Anchor>
        <Tooltip text="Supplementary text to add here" direction="n">
          <Button leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
            ActionMenu.Anchor w/ t
          </Button>
        </Tooltip>
      </ActionMenu.Anchor>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <ActionMenu>
      <Tooltip text="Supplementary text to add here" direction="n">
        <ActionMenu.Button leadingVisual={GitBranchIcon}>ActionMenu.Button w/ t</ActionMenu.Button>
      </Tooltip>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <ActionMenu>
      <ActionMenu.Anchor>
        <Button leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
          ActionMenu.Anchor
        </Button>
      </ActionMenu.Anchor>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <ActionMenu>
      <ActionMenu.Button leadingVisual={GitBranchIcon}>ActionMenu.Button</ActionMenu.Button>

      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  </Box>
)

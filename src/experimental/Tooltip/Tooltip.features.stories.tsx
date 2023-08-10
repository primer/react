import React from 'react'

import {IconButton, Button, Box, Link, StyledOcticon, ActionMenu, ActionList} from '../..'
import {Tooltip} from './Tooltip'
import {SearchIcon, BookIcon, CheckIcon, TriangleDownIcon, GitBranchIcon} from '@primer/octicons-react'

export default {
  title: 'Experimental/Components/Tooltip/Features',
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
        <StyledOcticon icon={BookIcon} sx={{color: 'fg.muted'}} />
      </Link>
    </Tooltip>
  </Box>
)

export const WithNativeButtonLabelType = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Vegetarian" direction="e" type="label">
      <button>🥦</button>
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

// As a label type tooltip for an IconButton
// This is not a correct use as we will have tooltip on icon buttons by default issue reference https://github.com/primer/react/issues/2008
// export const IconButtonWitLabel = () => (
//   <Box sx={{p: 5}}>
//     <Tooltip text="Search on tooltip" direction="e" type="label">
//       <IconButton icon={SearchIcon} aria-label="Search" />
//     </Tooltip>
//   </Box>
// )

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
      <Button>Multiline South</Button>
    </Tooltip>
  </Box>
)

export const CalculatedDirection = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip direction="w" text="But appears on east due to not having enough space">
      <Button>West</Button>
    </Tooltip>

    <Tooltip text="The direction here is north by default but there is not enough space on the north therefore the tooltip appears on the south">
      <Button>North</Button>
    </Tooltip>
  </Box>
)

export const NoDelay = () => (
  <Tooltip noDelay text="Supplemetary text" direction="se">
    <Button>Button</Button>
  </Tooltip>
)

export const OnActionMenuAnchor = () => (
  <Box sx={{display: 'flex', padding: 5, gap: 2}}>
    <ActionMenu>
      <ActionMenu.Anchor>
        <Tooltip text="Supplementary text to add here" direction="n">
          <Button leadingIcon={GitBranchIcon} trailingAction={TriangleDownIcon}>
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
        <ActionMenu.Button leadingIcon={GitBranchIcon}>ActionMenu.Button w/ t</ActionMenu.Button>
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
        <Button leadingIcon={GitBranchIcon} trailingAction={TriangleDownIcon}>
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
      <ActionMenu.Button leadingIcon={GitBranchIcon}>ActionMenu.Button</ActionMenu.Button>

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

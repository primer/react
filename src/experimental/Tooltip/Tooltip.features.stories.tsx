import React from 'react'

import {IconButton, Button, Box} from '../..'
import {Tooltip} from './Tooltip'
import {SearchIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Experimental/Tooltip/Features',
  component: Tooltip,
}

// As a label for an icon button
export const TooltipLabelTypeTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Vegetarian" type="label">
      <Button sx={{marginLeft: 3}}>🥦</Button>
    </Tooltip>
  </Box>
)

// As a label for an IconButton
export const TooltipNativeHTMLButton = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Vegetarian" direction="e" type="label">
      <button>🥦</button>
    </Tooltip>
  </Box>
)

// As a supplementary description for a button
export const TooltipDescriptionTypeTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Supplementary text" direction="n">
      <Button>Save</Button>
    </Tooltip>
  </Box>
)

// As a label type tooltip for an IconButton
// This is not a correct use as we will have tooltip on icon buttons by default issue reference https://github.com/primer/react/issues/2008
// export const TooltipIconButtonWitLabel = () => (
//   <Box sx={{p: 5}}>
//     <Tooltip text="Search on tooltip" direction="e" type="label">
//       <IconButton icon={SearchIcon} aria-label="Search" />
//     </Tooltip>
//   </Box>
// )

// As a supplementary description for an IconButton
export const TooltipIconButtonWithDescription = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Supplementary text for icon button" direction="e">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)

export const TooltipWithDirection = () => (
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
    <Tooltip
      direction="s"
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
    >
      <Button>Multiline South</Button>
    </Tooltip>
  </Box>
)

export const TooltipWithCalculatedDirection = () => (
  <Box sx={{padding: 5, display: 'flex', gap: '8px'}}>
    <Tooltip direction="w" text="But appears on east due to not having enough space">
      <Button>West</Button>
    </Tooltip>

    <Tooltip text="The direction here is north by default but there is not enough space on the north therefore the tooltip appears on the south">
      <Button>North</Button>
    </Tooltip>
  </Box>
)

export const TooltipNoDelay = () => (
  <Tooltip noDelay text="Supplemetary text" direction="se">
    <Button>Button</Button>
  </Tooltip>
)

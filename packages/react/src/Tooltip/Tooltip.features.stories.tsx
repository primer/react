import type {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, IconButton, Button} from '..'
import Box from '../Box'
import Tooltip from './Tooltip'
import {SearchIcon} from '@primer/octicons-react'

/* Tooltip v1 */

export default {
  title: 'Deprecated/Components/Tooltip/Features',
  component: Tooltip,

  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

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

export const IconButtonTooltip = () => (
  <Box sx={{p: 5}}>
    <Tooltip text="Search">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </Box>
)

import type {Meta} from '@storybook/react-vite'
import {ThemeProvider} from '../ThemeProvider'
import BaseStyles from '../BaseStyles'
import {IconButton, Button} from '..'
import Tooltip from './Tooltip'
import {SearchIcon} from '@primer/octicons-react'
import classes from './Tooltip.features.stories.module.css'

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
  <div className={classes.AllDirectionsRow}>
    <Tooltip direction="n" aria-label="Supplementary text">
      <Button>North</Button>
    </Tooltip>
    <Tooltip direction="s" aria-label="Supplementary text">
      <Button>South</Button>
    </Tooltip>
    <Tooltip direction="e" aria-label="Supplementary text">
      <Button>East</Button>
    </Tooltip>
    <Tooltip direction="w" aria-label="Supplementary text">
      <Button>West</Button>
    </Tooltip>
    <Tooltip direction="ne" aria-label="Supplementary text">
      <Button>North East</Button>
    </Tooltip>
    <Tooltip direction="nw" aria-label="Supplementary text">
      <Button>North West</Button>
    </Tooltip>
    <Tooltip direction="se" aria-label="Supplementary text">
      <Button>Southeast</Button>
    </Tooltip>
    <Tooltip direction="sw" aria-label="Supplementary text">
      <Button>Southwest</Button>
    </Tooltip>
  </div>
)

export const IconButtonTooltip = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip aria-label="Search">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </div>
)

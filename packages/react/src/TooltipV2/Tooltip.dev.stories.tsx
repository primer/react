import {Button} from '..'
import {Tooltip} from './Tooltip'
import classes from './Tooltip.dev.stories.module.css'

export default {
  title: 'Components/TooltipV2/Dev',
  component: Tooltip,
}

// Description type, north direction by default
export const Default = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="This tooltip has a red background and a larger font size." className={classes.Popover}>
      <Button>Delete</Button>
    </Tooltip>
  </div>
)

import {Button} from '..'
import {Tooltip} from './Tooltip'
import classes from './Tooltip.stories.module.css'

export default {
  title: 'Components/TooltipV2',
  component: Tooltip,
}

// Description type, north direction by default
export const Default = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="This change can't be undone.">
      <Button>Delete</Button>
    </Tooltip>
  </div>
)

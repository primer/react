import {Button, Box} from '..'
import {Tooltip} from './Tooltip'

export default {
  title: 'Components/TooltipV2/Dev',
  component: Tooltip,
}

// Description type, north direction by default
export const Default = () => (
  <Box sx={{p: 6}}>
    <Tooltip
      text="This tooltip has a red background and a larger font size."
      sx={{
        '&[popover]': {
          background: 'red',
          fontSize: 2,
        },
      }}
    >
      <Button>Delete</Button>
    </Tooltip>
  </Box>
)

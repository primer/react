import type {Meta} from '@storybook/react-vite'
import Spinner from './Spinner'
import classes from './Spinner.dev.stories.module.css'

export default {
  title: 'Components/Spinner/Dev',
  component: Spinner,
} as Meta<typeof Spinner>

export const Default = () => <Spinner className={classes.SpinnerBorder} size="small" />

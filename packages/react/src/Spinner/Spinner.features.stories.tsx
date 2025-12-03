import type {Meta} from '@storybook/react-vite'
import {Stack} from '../Stack/Stack'
import Spinner from './Spinner'
import {AriaStatus} from '../live-region'
import classes from './Spinner.features.stories.module.css'

export default {
  title: 'Components/Spinner/Features',
  component: Spinner,
} as Meta<typeof Spinner>

export const Small = () => <Spinner size="small" />

export const Large = () => <Spinner size="large" />

export const SuppressScreenReaderText = () => (
  <Stack direction="horizontal" className={classes.SuppressScreenReaderText}>
    <Spinner size="small" srText={null} />
    <AriaStatus>Loading...</AriaStatus>
  </Stack>
)

export const WithDelay = () => <Spinner delay />

import type {Meta} from '@storybook/react-vite'
import Pagehead from './Pagehead'
import Heading from '../Heading'

export default {
  title: 'Deprecated/Components/Pagehead/Dev',
  component: Pagehead,
} as Meta<typeof Pagehead>

export const Default = () => (
  <Pagehead sx={{color: 'red'}}>
    <Heading as="h2" variant="small">
      Pagehead
    </Heading>
  </Pagehead>
)

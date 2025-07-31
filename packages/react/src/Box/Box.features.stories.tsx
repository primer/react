import type {Meta} from '@storybook/react-vite'
import Box from './Box'

export default {
  title: 'Deprecated/Components/Box/Features',
  component: Box,
} as Meta<typeof Box>

export const Border = () => (
  <Box sx={{borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default', p: 3}}>Box with border</Box>
)

export const BorderBottom = () => (
  <Box sx={{borderBottomWidth: 1, borderBottomStyle: 'solid', borderColor: 'border.default', p: 3}}>
    Box with bottom border
  </Box>
)

export const Flexbox = () => (
  <Box sx={{display: 'flex'}}>
    <Box sx={{p: 3, borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default'}}>1</Box>
    <Box sx={{flexGrow: 1, p: 3, borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default'}}>2</Box>
    <Box sx={{p: 3, borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default'}}>3</Box>
  </Box>
)

export const Grid = () => (
  <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3}}>
    <Box sx={{p: 3, borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default'}}>1</Box>
    <Box sx={{p: 3, borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default'}}>2</Box>
    <Box sx={{p: 3, borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default'}}>3</Box>
  </Box>
)

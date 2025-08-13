import type {Meta} from '@storybook/react-vite'
import Box from './Box'
import classes from './Box.features.stories.module.css'

export default {
  title: 'Deprecated/Components/Box/Features',
  component: Box,
} as Meta<typeof Box>

export const Border = () => <div className={classes.Border}>Box with border</div>

export const BorderBottom = () => <div className={classes.BorderBottom}>Box with bottom border</div>

export const Flexbox = () => (
  <div className={classes.FlexContainer}>
    <div className={classes.FlexItem}>1</div>
    <div className={classes.FlexItemGrow}>2</div>
    <div className={classes.FlexItem}>3</div>
  </div>
)

export const Grid = () => (
  <div className={classes.GridContainer}>
    <div className={classes.GridItem}>1</div>
    <div className={classes.GridItem}>2</div>
    <div className={classes.GridItem}>3</div>
  </div>
)

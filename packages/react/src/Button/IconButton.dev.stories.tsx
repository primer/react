import {BoldIcon, ChevronDownIcon} from '@primer/octicons-react'
import {IconButton} from '.'
import {Stack} from '../Stack'
import classes from './IconButton.dev.stories.module.css'

export default {
  title: 'Components/IconButton/Dev',
}

export const CustomSize = () => (
  <IconButton
    aria-label="Expand"
    variant="primary"
    size="small"
    icon={ChevronDownIcon}
    className={classes.CustomSize}
  />
)

export const CustomSizeWithMedia = () => (
  <IconButton
    aria-label="Expand"
    variant="primary"
    size="small"
    icon={ChevronDownIcon}
    className={classes.CustomSizeWithMedia}
  />
)

export const CustomIconColor = () => (
  <IconButton
    aria-label="Expand"
    variant="invisible"
    size="small"
    icon={ChevronDownIcon}
    className={classes.CustomIconColor}
  />
)

export const CustomSizeWithStyleProp = () => (
  <span className={classes.BoxBorder}>
    <IconButton
      icon={BoldIcon}
      aria-label="Bold"
      size="large"
      variant="invisible"
      style={{width: '20px', height: '28px'}}
    />
  </span>
)

export const IconButtonWithinFlexContainer = () => (
  <Stack direction="horizontal">
    <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </span>

    <IconButton icon={BoldIcon} aria-label="Icon button" />
  </Stack>
)

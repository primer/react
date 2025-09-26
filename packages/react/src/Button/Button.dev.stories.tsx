import {SearchIcon, TriangleDownIcon, EyeIcon, IssueClosedIcon, HeartFillIcon} from '@primer/octicons-react'
import {Button, IconButton} from '.'
import {default as Text} from '../Text'
import {Stack} from '../Stack'
import classes from './Button.dev.stories.module.css'

export default {
  title: 'Components/Button/Dev',
}

export const InvisibleVariants = () => {
  const count = 4
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <Button variant="invisible">Button</Button>
      <Button variant="invisible" leadingVisual={SearchIcon}>
        Button
      </Button>
      <Button variant="invisible" trailingAction={TriangleDownIcon}>
        Button
      </Button>
      <Button variant="primary" count={count}>
        Button
      </Button>
      <Button variant="invisible" leadingVisual={EyeIcon} count={count}>
        Button
      </Button>
      <Button variant="invisible" leadingVisual={EyeIcon} trailingAction={TriangleDownIcon} count={count}>
        Button
      </Button>
      <IconButton icon={TriangleDownIcon} variant="invisible" aria-label="Invisible" />
    </div>
  )
}

export const TestSxProp = () => {
  const count = 4
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <Button
        size="medium"
        sx={{
          color: 'firebrick',
          backgroundColor: '#F6F8FA',
        }}
      >
        Medium Red
      </Button>
      <Button
        size="small"
        sx={{
          ':hover': {
            color: 'deepskyblue',
          },
          [`@media screen and (max-width: 768px)`]: {
            color: 'maroon',
            backgroundColor: '#F6F8FA',
          },
          '@media (min-width: 1440)': {
            color: 'firebrick',
            backgroundColor: '#F6F8FA',
          },
        }}
      >
        Red
      </Button>
      <Button variant="invisible" sx={{color: 'firebrick', backgroundColor: '#F6F8FA'}}>
        Invariant color overridden
      </Button>
      <Button leadingVisual={IssueClosedIcon} sx={{color: 'done.fg'}}>
        <Text className={classes.DefaultText}>Close issue</Text>
      </Button>
      <Button
        size="small"
        variant="invisible"
        sx={{
          width: 32,
          height: 32,
          '&:focus': {
            outline: 0,
            '& > span': {
              boxShadow: `inset 0 0 0 2px deeppink`,
            },
          },
        }}
      >
        Custom size
      </Button>
      <Button size="small" block variant="invisible" sx={{width: 320}}>
        Overridden Block
      </Button>
      <Button sx={{fontSize: 32}} count={count}>
        Watch
      </Button>
    </div>
  )
}

export const DisabledButtonVariants = () => {
  return (
    <Stack direction="horizontal">
      <Stack align="start">
        <Button
          variant="invisible"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Invisible
        </Button>
        <Button
          variant="default"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Default
        </Button>
        <Button
          variant="primary"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Primary
        </Button>
        <Button
          variant="danger"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Danger
        </Button>
      </Stack>
      <Stack>
        <IconButton icon={HeartFillIcon} variant="invisible" aria-label="Invisible" disabled />
        <IconButton icon={HeartFillIcon} variant="default" aria-label="Default" disabled />
        <IconButton icon={HeartFillIcon} variant="primary" aria-label="Primary" disabled />
        <IconButton icon={HeartFillIcon} variant="danger" aria-label="Danger" disabled />
      </Stack>
    </Stack>
  )
}

import {SearchIcon, TriangleDownIcon, EyeIcon} from '@primer/octicons-react'
import React from 'react'
import {Button, IconButton} from '.'

export default {
  title: 'Components/Button/DevOnly',
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
      <Button variant="primary" trailingVisualCount={count}>
        Button
      </Button>
      <Button variant="invisible" leadingVisual={EyeIcon} trailingVisualCount={count}>
        Button
      </Button>
      <Button variant="invisible" leadingVisual={EyeIcon} trailingAction={TriangleDownIcon} trailingVisualCount={count}>
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
          color: 'deeppink',
        }}
      >
        Medium Pink
      </Button>
      <Button
        size="small"
        sx={{
          ':hover': {
            color: 'deepskyblue',
          },
          [`@media screen and (max-width: 768px)`]: {
            color: 'salmon',
          },
          '@media screen and (min-width: 768px)': {
            ':focus': {
              color: 'green',
            },
          },
          '@media (min-width: 1440)': {
            color: 'deeppink',
          },
        }}
      >
        Pink
      </Button>
      <Button leadingVisual={SearchIcon} variant="invisible" sx={{color: 'deeppink'}}>
        Pink
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
        Overriden Block
      </Button>
      <Button sx={{fontSize: 32}} trailingVisualCount={count}>
        Watch
      </Button>
    </div>
  )
}

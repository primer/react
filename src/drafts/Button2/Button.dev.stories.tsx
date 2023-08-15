import {SearchIcon, TriangleDownIcon, EyeIcon} from '@primer/octicons-react'
import React from 'react'
import {Button2 as Button} from '.'

export default {
  title: 'Drafts/Components/Button/DevOnly',
}

export const InvisibleVariants = () => {
  const count = 4
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <Button variant="invisible">Button</Button>
      <Button variant="invisible" leadingIcon={SearchIcon}>
        Button
      </Button>
      <Button variant="invisible" trailingAction={TriangleDownIcon}>
        Button
      </Button>
      <Button variant="primary">
        Button
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="invisible" leadingIcon={EyeIcon}>
        Button
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="invisible" leadingIcon={EyeIcon} trailingAction={TriangleDownIcon}>
        Button
        <Button.Counter>{count}</Button.Counter>
      </Button>
      {/* <IconButton icon={TriangleDownIcon} variant="invisible" aria-label="Invisible" /> */}
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
          },
          '@media screen and (min-width: 768px)': {
            ':focus': {
              color: 'green',
            },
          },
          '@media (min-width: 1440)': {
            color: 'firebrick',
          },
        }}
      >
        Red
      </Button>
      <Button leadingIcon={SearchIcon} variant="invisible" sx={{color: 'firebrick'}}>
        Red
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
      <Button>
        Watch
        <Button.Counter sx={{fontSize: 32}}>{count}</Button.Counter>
      </Button>
    </div>
  )
}

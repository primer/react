import React from 'react'
import type {Meta} from '@storybook/react'
import Token from './Token'

export default {
  title: 'Components/Token/Dev',
  component: Token,
} as Meta<typeof Token>

export const DevDefault = () => <Token text="token" sx={{color: 'red'}} style={{border: '2px solid blue'}} />

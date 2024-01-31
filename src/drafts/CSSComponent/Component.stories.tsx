import React from 'react'
import {Meta} from '@storybook/react'
import {Component} from '.'

export default {
  title: 'Experimental/Components/CSSComponent',
} as Meta<typeof Component>

export const Default = () => <Component>Default</Component>

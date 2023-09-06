import React from 'react'
import {Meta} from '@storybook/react'
import {Prose} from '.'
import {ContainerToFill, KitchenSinkChildren} from './_ProseStorybookHelpers'

export default {
  title: 'Components/Prose/Features',
  component: Prose,
} as Meta<typeof Prose>

export const FullWidth = () => (
  <ContainerToFill>
    <Prose fullWidth>
      <KitchenSinkChildren />
    </Prose>
  </ContainerToFill>
)

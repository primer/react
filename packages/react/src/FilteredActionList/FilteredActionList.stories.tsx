import type {Meta} from '@storybook/react-vite'
import React from 'react'
import {ThemeProvider} from '..'
import {FilteredActionList} from '../FilteredActionList'
import BaseStyles from '../BaseStyles'
import classes from './FilteredActionList.stories.module.css'

const meta: Meta = {
  title: 'Components/FilteredActionList',
  component: FilteredActionList,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

function getColorCircle(color: string) {
  return function () {
    return (
      <span
        className={classes.ColorCircle}
        style={{
          backgroundColor: color,
          borderColor: color,
        }}
      />
    )
  }
}

const items = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

export function Default(): JSX.Element {
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))

  return (
    <>
      <h1>Filtered Action List</h1>
      <div>Please select labels that describe your issue:</div>
      <FilteredActionList
        placeholderText="Filter Labels"
        items={filteredItems}
        onFilterChange={setFilter}
        className={classes.FilteredActionListContainer}
      />
    </>
  )
}

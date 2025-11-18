import type {Meta} from '@storybook/react-vite'
import React, {useMemo} from 'react'
import {FilteredActionList} from '../FilteredActionList'
import classes from './FilteredActionList.stories.module.css'

const meta: Meta = {
  title: 'Components/FilteredActionList/Examples',
  component: FilteredActionList,
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

export function WithLongItems() {
  const [filter, setFilter] = React.useState('')

  const items = useMemo(() => {
    return [
      {
        text: 'enhancement with a very long label that might wrap. enhancement with a very long label that might wrap. enhancement with a very long label that might wrap. ',
        id: 1,
      },
      {
        text: 'bug with an excessively verbose description that goes on and on. bug with an excessively verbose description that goes on and on. bug with an excessively verbose description that goes on and on.',
        id: 2,
      },
      {
        text: 'good first issue that is intended to be approachable for newcomers',
        id: 3,
      },
      {
        text: 'design related task that involves multiple stakeholders and considerations',
        id: 4,
      },
    ].filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  }, [filter])

  return (
    <>
      <h1>Filtered Action List with Long Items</h1>
      <div>Please select labels that describe your issue:</div>
      <FilteredActionList
        placeholderText="Filter Labels"
        onFilterChange={setFilter}
        items={items}
        className={classes.FilteredActionListContainer}
      />
    </>
  )
}

export function Virtualized() {
  const [filter, setFilter] = React.useState('')

  const items = useMemo(() => {
    const allItems = Array.from({length: 1800}, (_, index) => ({
      text: `Item ${index + 1}`,
      id: index + 1,
    }))
    return allItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  }, [filter])

  return (
    <>
      <h1>Filtered Action List with Long Items</h1>
      <div>Please select labels that describe your issue:</div>
      <FilteredActionList
        placeholderText="Filter Labels"
        onFilterChange={setFilter}
        items={items}
        isVirtualized
        className={classes.FilteredActionListContainer}
      />
    </>
  )
}

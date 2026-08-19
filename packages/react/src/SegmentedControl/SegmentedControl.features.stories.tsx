import {useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {SegmentedControl} from '.'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import {Button} from '../Button'
import Text from '../Text'
import classes from './SegmentedControl.features.stories.module.css'

export default {
  title: 'Components/SegmentedControl/Features',
  component: SegmentedControl,
} as Meta<typeof SegmentedControl>

export const WithIcons = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)

export const WithCounterLabels = () => (
  <SegmentedControl aria-label="Issues by label">
    <SegmentedControl.Button defaultSelected count={5}>
      Feature
    </SegmentedControl.Button>
    <SegmentedControl.Button count={3}>Bug</SegmentedControl.Button>
    <SegmentedControl.Button count={10}>Good first issue</SegmentedControl.Button>
  </SegmentedControl>
)

export const VariantSubtle = () => (
  <SegmentedControl aria-label="View" variant="subtle">
    <SegmentedControl.Button defaultSelected count={5} dividerAfter>
      All
    </SegmentedControl.Button>
    <SegmentedControl.Button count={3}>Active</SegmentedControl.Button>
    <SegmentedControl.Button count={10} dividerAfter>
      Review requests
    </SegmentedControl.Button>
    <SegmentedControl.Button count={2}> Done</SegmentedControl.Button>
  </SegmentedControl>
)
VariantSubtle.storyName = '[variant: subtle]'

export const WithAddViewButton = () => {
  const initialViews = [
    {label: 'All', count: 5},
    {label: 'Active', count: 3},
    {label: 'Review requests', count: 10},
    {label: 'Done', count: 2},
  ]
  const [views, setViews] = useState(initialViews)

  const handleAddView = () => {
    setViews(currentViews => [...currentViews, {label: `New view ${currentViews.length - 3}`, count: 0}])
  }

  return (
    <>
      <SegmentedControl aria-label="View" variant="subtle">
        {views.map((view, index) => (
          <SegmentedControl.Button
            key={view.label}
            defaultSelected={index === 0}
            count={view.count}
            dividerAfter={view.label === 'All'}
          >
            {view.label}
          </SegmentedControl.Button>
        ))}
        <SegmentedControl.Action aria-label="Add view" onClick={handleAddView} />
      </SegmentedControl>
      <Button className={classes.ResetButton} size="small" onClick={() => setViews(initialViews)}>
        Reset views
      </Button>
    </>
  )
}

export const Controlled = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleChange = (i: number) => {
    setSelectedIndex(i)
  }
  return (
    <SegmentedControl aria-label="File view" onChange={handleChange}>
      <SegmentedControl.Button selected={selectedIndex === 0}>Preview</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 1}>Raw</SegmentedControl.Button>
      <SegmentedControl.Button selected={selectedIndex === 2}>Blame</SegmentedControl.Button>
    </SegmentedControl>
  )
}

export const VariantNarrowHideLabels = () => (
  <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels', regular: 'default', wide: 'default'}}>
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
VariantNarrowHideLabels.storyName = '[variant: narrow] Hide labels'

export const VariantNarrowActionMenu = () => (
  <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown', regular: 'default', wide: 'default'}}>
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
VariantNarrowActionMenu.storyName = '[variant: narrow] Action menu'

export const FullwidthNarrow = () => (
  <SegmentedControl aria-label="File view" fullWidth={{narrow: true, regular: false, wide: false}}>
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
FullwidthNarrow.storyName = '[fullWidth: narrow]'

export const FullwidthRegular = () => (
  <SegmentedControl aria-label="File view" fullWidth={{narrow: false, regular: true, wide: false}}>
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
FullwidthRegular.storyName = '[fullWidth: regular]'

export const FullwidthAll = () => (
  <SegmentedControl aria-label="File view" fullWidth>
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)
FullwidthAll.storyName = 'Full width'

export const IconOnly = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.IconButton defaultSelected aria-label={'Preview'} icon={EyeIcon} />
    <SegmentedControl.IconButton aria-label={'Raw'} icon={FileCodeIcon} />
    <SegmentedControl.IconButton aria-label={'Blame'} icon={PeopleIcon} />
  </SegmentedControl>
)
IconOnly.storyName = 'Icon only'

export const AssociatedWithALabelAndCaption = () => (
  <div className={classes.LabelAndCaptionContainer}>
    <div className={classes.LabelAndCaption}>
      <Text className={classes.TextLargeBold} id="scLabel-vert" style={{display: 'block'}}>
        File view
      </Text>
      <Text className={classes.TextMediumSubtle} id="scCaption-vert" style={{display: 'block'}}>
        Change the way the file is viewed
      </Text>
    </div>
    <SegmentedControl aria-labelledby="scLabel-vert" aria-describedby="scCaption-vert">
      <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
      <SegmentedControl.Button>Raw</SegmentedControl.Button>
      <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
  </div>
)
AssociatedWithALabelAndCaption.storyName = '[Example] Associated with a label and caption'

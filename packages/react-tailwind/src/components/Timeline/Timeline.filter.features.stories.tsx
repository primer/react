import type {Meta, StoryObj} from '@storybook/react-vite'
import {CheckCircleIcon, EyeIcon, IssueOpenedIcon} from '@primer/octicons-react'
import React from 'react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Timeline} from './Timeline'
import {
  PLAYGROUND_SURFACES,
  playgroundCategoryIds,
  playgroundEvents,
  type PlaygroundCategoryId,
} from './Timeline.playground.storyHelpers'
import {Examples, MutedTime, UserActor} from './Timeline.storyHelpers'

const meta = {
  title: 'React Tailwind/Layout/Timeline/Features',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
  },
} satisfies Meta<typeof Timeline>
export default meta

type Story = StoryObj<typeof meta>

// `issue` offers the richest category set (status, references, moderation, and metadata).
const SURFACE_ID = 'issue' as const

// The consumer pins these lifecycle rows as bookends, so they are excluded from the filterable interior.
const BOOKEND_LIFECYCLE_TYPES = new Set(['opened', 'closed'])

type ViewingOption = {id: PlaygroundCategoryId; label: string; description?: string}

/**
 * Presentational multi-select "Viewing" menu. It knows nothing about the Timeline it filters; the consumer owns
 * the predicate and decides which rows render.
 */
function ViewingFilterMenu({
  options,
  selected,
  onSelectedChange,
}: {
  options: ViewingOption[]
  selected: PlaygroundCategoryId[]
  onSelectedChange: (next: PlaygroundCategoryId[]) => void
}) {
  return (
    <ActionMenu>
      <ActionMenu.Button leadingVisual={EyeIcon}>Viewing</ActionMenu.Button>
      <ActionMenu.Overlay width="auto">
        {options.map(option => {
          const isSelected = selected.includes(option.id)
          return (
            <ActionMenu.CheckboxItem
              key={option.id}
              checked={isSelected}
              closeOnClick={false}
              onCheckedChange={checked =>
                onSelectedChange(checked ? [...selected, option.id] : selected.filter(id => id !== option.id))
              }
            >
              {option.label}
              {option.description ? (
                // eslint-disable-next-line primer-react/direct-slot-children -- ActionMenu items share ActionList item content slots.
                <ActionList.Description variant="block">{option.description}</ActionList.Description>
              ) : null}
            </ActionMenu.CheckboxItem>
          )
        })}
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

function WithFilteringStory() {
  const surface = PLAYGROUND_SURFACES[SURFACE_ID]
  const categoryIds = playgroundCategoryIds(SURFACE_ID)
  const options: ViewingOption[] = categoryIds.map(id => ({
    id,
    label: surface.categories[id]?.label ?? id,
    description: surface.categories[id]?.description,
  }))
  const [selected, setSelected] = React.useState<PlaygroundCategoryId[]>(categoryIds)
  const interior = playgroundEvents(SURFACE_ID, selected).filter(event => !BOOKEND_LIFECYCLE_TYPES.has(event.type))

  return (
    <Examples>
      <div className="mb-4">
        <ViewingFilterMenu options={options} selected={selected} onSelectedChange={setSelected} />
      </div>
      <Timeline aria-label={surface.ariaLabel}>
        <Timeline.Item
          data-event-scope={SURFACE_ID}
          data-event-type="opened"
          data-event-visibility="primary"
          data-actor-type="user"
        >
          <Timeline.Badge variant="open">
            <IssueOpenedIcon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'opened this '}
            <MutedTime date={new Date('2022-07-22T09:00:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
        {interior.map(event => {
          const BadgeIcon = event.badge.icon
          return (
            <Timeline.Item
              key={`${event.category}-${event.type}`}
              data-event-scope={SURFACE_ID}
              data-event-type={event.type}
              data-event-category={event.category}
              data-event-visibility={event.visibility}
              data-actor-type={event.actorType}
            >
              <Timeline.Badge variant={event.badge.variant}>
                <BadgeIcon aria-hidden="true" />
              </Timeline.Badge>
              <Timeline.Body>{event.body}</Timeline.Body>
              {event.actions ? <Timeline.Actions>{event.actions}</Timeline.Actions> : null}
            </Timeline.Item>
          )
        })}
        <Timeline.Item
          data-event-scope={SURFACE_ID}
          data-event-type="closed"
          data-event-visibility="primary"
          data-actor-type="user"
        >
          <Timeline.Badge variant="done">
            <CheckCircleIcon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            <UserActor href="#" muted />
            {'closed this as completed '}
            <MutedTime date={new Date('2022-07-28T18:20:00Z')} href="#" />
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </Examples>
  )
}

/**
 * Consumer-side category filtering with a multi-select "Viewing" menu. Timeline stays taxonomy-agnostic: the
 * `data-event-*` attributes ride along on each item, while the story owns the predicate. The opening and closing
 * rows are pinned outside the predicate so the timeline is never empty.
 */
export const WithFiltering: Story = {
  render: () => <WithFilteringStory />,
}

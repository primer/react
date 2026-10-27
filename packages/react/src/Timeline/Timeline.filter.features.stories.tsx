import type {Meta} from '@storybook/react-vite'
import {useState} from 'react'
import {CheckCircleIcon, EyeIcon, IssueOpenedIcon} from '@primer/octicons-react'
import type {ComponentProps} from '../utils/types'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {Examples, MutedTime, UserActor} from './internal/timelineStoryHelpers'
import {
  PLAYGROUND_SURFACES,
  playgroundCategoryIds,
  playgroundEvents,
  type PlaygroundCategoryId,
} from './internal/timelinePlaygroundData'
import classes from './Timeline.filter.features.stories.module.css'

export default {
  title: 'Components/Timeline/Features',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
  },
  decorators: [
    // File-scoped: render every story in the future-state list semantics
    // (`<ol>`/`<li>`), matching the other Timeline surface stories.
    Story => (
      <FeatureFlags flags={{primer_react_timeline_list_semantics: true}}>
        <Story />
      </FeatureFlags>
    ),
  ],
} as Meta<ComponentProps<typeof Timeline>>

// The single representative surface for this demo. `issue` offers the richest
// category set (status / references / moderation / metadata).
const SURFACE_ID = 'issue' as const

// Lifecycle types the consumer PINS as never-filtered bookends (see the story
// notes). They are excluded from the filterable interior so a toggled-on
// category never renders a duplicate opening/closing row.
const BOOKEND_LIFECYCLE_TYPES = new Set(['opened', 'closed'])

type ViewingOption = {id: PlaygroundCategoryId; label: string; description?: string}

/**
 * Presentational "Viewing" control. Its entire contract is `options` /
 * `selected` / `onSelectedChange`; it reads NO `data-*` attributes and knows
 * nothing about the Timeline it filters. The consumer owns the predicate and
 * decides which rows render. Each option may also carry an optional
 * consumer-supplied `description`, rendered as an `ActionList.Description` block
 * under the label; the control authors none of this text. This mirrors the
 * prototype's per-surface Viewing menu: a Primer `ActionMenu` multi-select
 * (`selectionVariant="multiple"`) whose checklist items stay open on select and
 * expose `role="menuitemcheckbox"` / `aria-checked` for screen readers. The
 * trigger's accessible name is its text ("Viewing"); the eye icon is decorative.
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
        <ActionList selectionVariant="multiple">
          {options.map(option => {
            const isSelected = selected.includes(option.id)
            return (
              <ActionList.Item
                key={option.id}
                selected={isSelected}
                onSelect={event => {
                  // Keep the multi-select Viewing menu open across toggles: ActionMenu
                  // closes its overlay on item-select unless the handler prevents the
                  // default. This works for mouse and keyboard (the Space path resets
                  // `defaultPrevented` before calling this handler).
                  event.preventDefault()
                  onSelectedChange(isSelected ? selected.filter(id => id !== option.id) : [...selected, option.id])
                }}
              >
                {option.label}
                {option.description ? (
                  <ActionList.Description variant="block">{option.description}</ActionList.Description>
                ) : null}
              </ActionList.Item>
            )
          })}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

/**
 * Viewing menu (consumer-side category filtering).
 *
 * This is a PRESENTATIONAL demo of the prototype's per-surface "Viewing" menu. A
 * Primer `ActionMenu` multi-select toggles which event CATEGORIES the selected
 * surface renders. There is NO public `Timeline.Filter` API: the control
 * (`ViewingFilterMenu`) is story-local scaffolding and filtering is 100%
 * consumer-side.
 *
 * How the pieces divide responsibility:
 * - The control is presentational. Its contract is `options` / `selected` /
 *   `onSelectedChange`. It does NOT read the `data-*` attributes on the rows.
 * - The consumer (this story) owns the predicate. It filters the representative
 *   rows on each event's `category` and hands the survivors to `Timeline`.
 * - `Timeline` and its slots stay taxonomy-agnostic. The `data-event-*`
 *   attributes ride along on `Timeline.Item` exactly as the Playground renders
 *   them; the control never inspects them.
 *
 * Never-empty guarantee (CONSUMER-owned): the opening and closing lifecycle
 * events are PINNED outside the category predicate, so the timeline never
 * renders empty no matter which categories are toggled off. This is the
 * consumer's responsibility, NOT the Timeline or control components. Because the
 * consumer pins these bookends, it also excludes their lifecycle types from the
 * filterable interior (`BOOKEND_LIFECYCLE_TYPES`) so a toggled-on category can't
 * duplicate them.
 *
 * The representative data is illustrative, github-flavored sample data only. The
 * authoritative Timeline event taxonomy lives in github-ui as
 * `@github-ui/timeline-taxonomy`; primer/react is taxonomy-agnostic.
 */
export const WithFiltering = () => {
  const surface = PLAYGROUND_SURFACES[SURFACE_ID]
  const categoryIds = playgroundCategoryIds(SURFACE_ID)
  const options: ViewingOption[] = categoryIds.map(id => ({
    id,
    label: surface.categories[id]?.label ?? id,
    description: surface.categories[id]?.description,
  }))

  // All categories start selected: nothing is filtered out initially.
  const [selected, setSelected] = useState<PlaygroundCategoryId[]>(categoryIds)

  // Consumer-side predicate: keep rows whose category is still selected, minus
  // the pinned lifecycle bookends.
  const interior = playgroundEvents(SURFACE_ID, selected).filter(event => !BOOKEND_LIFECYCLE_TYPES.has(event.type))

  return (
    <Examples>
      <div className={classes.Toolbar}>
        <ViewingFilterMenu options={options} selected={selected} onSelectedChange={setSelected} />
      </div>
      <Timeline aria-label={surface.ariaLabel}>
        {/*
          PINNED opening bookend — consumer-owned, never filtered. It carries no
          `data-event-category`, so it sits outside the category axis the Viewing
          menu toggles.
        */}
        <Timeline.Item
          data-event-scope={SURFACE_ID}
          data-event-type="opened"
          data-event-visibility="primary"
          data-actor-type="user"
        >
          <Timeline.Badge variant="open">
            {/* Decorative: the summary text in Timeline.Body is the accessible description. */}
            <IssueOpenedIcon />
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
                {/* Decorative: the summary text in Timeline.Body is the accessible description. */}
                <BadgeIcon />
              </Timeline.Badge>
              <Timeline.Body>{event.body}</Timeline.Body>
              {event.actions ? <Timeline.Actions>{event.actions}</Timeline.Actions> : null}
            </Timeline.Item>
          )
        })}

        {/* PINNED closing bookend — consumer-owned, never filtered. */}
        <Timeline.Item
          data-event-scope={SURFACE_ID}
          data-event-type="closed"
          data-event-visibility="primary"
          data-actor-type="user"
        >
          <Timeline.Badge variant="done">
            {/* Decorative: the summary text in Timeline.Body is the accessible description. */}
            <CheckCircleIcon />
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

import {TriangleDownIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {createElement, useEffect, useMemo, useState} from 'react'

import {Button} from '../Button'
import Checkbox from '../Checkbox'
import FormControl from '../FormControl'
import {SelectPanel, type ItemInput} from '.'
import classes from './SelectPanel.live-region-bug.dev.stories.module.css'

const meta = {
  title: 'Components/SelectPanel/Dev/Live region bug',
  component: SelectPanel,
  parameters: {
    controls: {disable: true},
  },
} satisfies Meta<typeof SelectPanel>

export default meta

type Story = StoryObj
type RegionRoute = 'closed-dialog' | 'available' | 'missing'
type AnnouncementTarget = {
  message: string
  route: RegionRoute
}

const items: ItemInput[] = [
  {id: 1, text: 'JavaScript'},
  {id: 2, text: 'Ruby'},
  {id: 3, text: 'TypeScript'},
]

const LiveRegion = () => createElement('live-region')

const getRegionRoute = (region: Element | undefined): RegionRoute => {
  if (!region) return 'missing'
  return region.closest('dialog:not([open])') ? 'closed-dialog' : 'available'
}

const findAnnouncementTarget = (expectedMessage: string): AnnouncementTarget => {
  for (const region of document.querySelectorAll('live-region')) {
    const message = Array.from(region.shadowRoot?.querySelectorAll('[aria-live]') ?? [])
      .map(element => element.textContent.trim())
      .find(text => text.includes(expectedMessage))

    if (message) {
      return {message, route: getRegionRoute(region)}
    }
  }

  return {message: '', route: 'missing'}
}

const matchedNodeLabels: Record<RegionRoute, string> = {
  'closed-dialog': 'dialog:not([open]) > live-region',
  available: 'body > live-region',
  missing: 'No live-region found',
}

const InteractiveExplainer = () => {
  const [selected, setSelected] = useState<ItemInput[]>([])
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [renderConflict, setRenderConflict] = useState(true)
  const [announcementTarget, setAnnouncementTarget] = useState<AnnouncementTarget>({message: '', route: 'missing'})

  const filteredItems = useMemo(
    () => items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase())),
    [filter],
  )

  const hasNoResults = filter.length > 0 && filteredItems.length === 0
  const expectedMessage = `No language found for “${filter}”. Adjust your search term to find another language.`

  useEffect(() => {
    const timeout = window.setTimeout(
      () =>
        setAnnouncementTarget(hasNoResults ? findAnnouncementTarget(expectedMessage) : {message: '', route: 'missing'}),
      1200,
    )
    return () => window.clearTimeout(timeout)
  }, [expectedMessage, hasNoResults, open, renderConflict])

  const currentRouteIsHidden = announcementTarget.route === 'closed-dialog'
  const messageStatus = !hasNoResults
    ? 'Waiting for a no-results query'
    : announcementTarget.message || 'No matching announcement found'
  const availableToScreenReader =
    !hasNoResults || announcementTarget.route === 'missing' ? 'Not determined' : currentRouteIsHidden ? 'No' : 'Yes'

  return (
    <main className={classes.Page}>
      <header className={classes.Header}>
        <h1 className={classes.Title}>SelectPanel can announce into a closed dialog</h1>
        <p className={classes.Summary}>
          SelectPanel uses the first <code>live-region</code> in the document. If that element belongs to an unrelated,
          closed dialog, the message is written but screen readers cannot reach it.
        </p>
      </header>

      <section className={classes.Section} aria-labelledby="reproduce-heading">
        <h2 id="reproduce-heading">Reproduce</h2>
        <ol className={classes.Steps}>
          <li>Open the language picker.</li>
          <li>
            Search for <code>zzz</code>.
          </li>
          <li>Clear the checkbox and change the query to compare the working path.</li>
        </ol>

        <div className={classes.Example}>
          <div className={classes.Demo}>
            <h3>Rendered demo</h3>
            <FormControl>
              <FormControl.Label>Add a live region inside a closed dialog</FormControl.Label>
              <Checkbox checked={renderConflict} onChange={event => setRenderConflict(event.target.checked)} />
            </FormControl>

            <dialog data-live-region-conflict>{renderConflict ? <LiveRegion /> : null}</dialog>

            <SelectPanel
              title="Select a language"
              placeholder="Select a language"
              renderAnchor={({children, ...anchorProps}) => (
                <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
                  {children}
                </Button>
              )}
              open={open}
              onOpenChange={setOpen}
              items={filteredItems}
              selected={selected}
              onSelectedChange={setSelected}
              onFilterChange={setFilter}
              placeholderText="Filter languages"
              message={
                hasNoResults
                  ? {
                      variant: 'empty',
                      title: `No language found for “${filter}”`,
                      body: 'Adjust your search term to find another language.',
                    }
                  : undefined
              }
            />
          </div>

          <div className={classes.Diagnostics}>
            <h3>Announcement destination</h3>
            <dl>
              <div className={classes.DiagnosticRow}>
                <dt>Inspection</dt>
                <dd>
                  <code>Matching shadow-root message</code>
                </dd>
              </div>
              <div className={classes.DiagnosticRow}>
                <dt>Matched node</dt>
                <dd>
                  <code>{matchedNodeLabels[announcementTarget.route]}</code>
                </dd>
              </div>
              <div className={classes.DiagnosticRow}>
                <dt>Inside a closed dialog</dt>
                <dd>
                  {announcementTarget.route === 'missing' ? 'Not determined' : currentRouteIsHidden ? 'Yes' : 'No'}
                </dd>
              </div>
              <div className={classes.DiagnosticRow}>
                <dt>Message</dt>
                <dd>{messageStatus}</dd>
              </div>
              <div className={classes.DiagnosticRow}>
                <dt>Available to a screen reader</dt>
                <dd>{availableToScreenReader}</dd>
              </div>
            </dl>
            <div className={classes.Result} data-state={hasNoResults && currentRouteIsHidden ? 'broken' : 'normal'}>
              {!hasNoResults
                ? 'Run the steps above to observe the announcement target.'
                : announcementTarget.route === 'missing'
                  ? 'No matching announcement was found.'
                  : currentRouteIsHidden
                    ? 'Bug reproduced: the message is inside a closed dialog.'
                    : 'Fix verified: the message is in an available live region.'}
            </div>
          </div>
        </div>
      </section>

      <section className={classes.Section} aria-labelledby="fix-heading">
        <h2 id="fix-heading">Potential fix</h2>
        <p>
          Resolve announcements from the active filter input instead of caching an arbitrary document-wide region. Also
          make the shared fallback ignore regions inside closed dialogs.
        </p>
        <pre className={classes.Code}>
          <code>{`useAnnouncements
- const liveRegion = document.querySelector('live-region')
- announce(message, {delayMs})
+ announce(message, {delayMs, from: inputRef.current ?? undefined})

@primer/live-region-element
- container.querySelector('live-region')
+ first live-region that is not inside dialog:not([open])`}</code>
        </pre>
        <h3>Why both changes?</h3>
        <ul className={classes.FixList}>
          <li>Scoping from the filter input keeps SelectPanel announcements in the active picker.</li>
          <li>
            Hardening the fallback protects standalone FilteredActionList and other live-region-element consumers.
          </li>
        </ul>
      </section>
    </main>
  )
}

export const BugAndPotentialFix: Story = {
  render: () => <InteractiveExplainer />,
}

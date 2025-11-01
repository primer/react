import type {Meta} from '@storybook/react-vite'
import React, {forwardRef, type JSX} from 'react'
import {
  TypographyIcon,
  StarIcon,
  TableIcon,
  PeopleIcon,
  CalendarIcon,
  IssueOpenedIcon,
  NumberIcon,
  LinkIcon,
  XIcon,
} from '@primer/octicons-react'
import {ActionList} from '.'
import TextInput from '../TextInput'
import Spinner from '../Spinner'
import Text from '../Text'
import FormControl from '../FormControl'
import {AriaStatus} from '../live-region'
import {VisuallyHidden} from '../VisuallyHidden'
import {ReactRouterLikeLink} from '../Pagination/mocks/ReactRouterLink'
import classes from './ActionList.examples.stories.module.css'

const meta: Meta = {
  title: 'Components/ActionList/Examples',
  component: ActionList,
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

const NextJSLikeLink = forwardRef(
  ({href, children}: {href: string; children: React.ReactNode}, ref): React.ReactElement => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)

export const ListLinkItem = () => (
  <ActionList showDividers>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <XIcon />
      </ActionList.LeadingVisual>
      not a link, just an Item for comparison
    </ActionList.Item>
    <ActionList.LinkItem href="https://github.com/primer" aria-keyshortcuts="g">
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      ActionList.LinkItem
    </ActionList.LinkItem>
    <ActionList.LinkItem href="https://github.com/primer" target="_blank" rel="noopener noreferrer">
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      ActionList.LinkItem with anchor attributes
    </ActionList.LinkItem>
    <ActionList.LinkItem as={ReactRouterLikeLink} to="?path=/story/components-actionlist--default">
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      as ReactRouterLink
    </ActionList.LinkItem>
    <NextJSLikeLink href="?path=/story/components-actionlist--default">
      <ActionList.LinkItem>
        <ActionList.LeadingVisual>
          <LinkIcon />
        </ActionList.LeadingVisual>
        NextJS style Link
      </ActionList.LinkItem>
    </NextJSLikeLink>
    <ActionList.LinkItem href="?path=/story/components-actionlist--default">
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      With inline description
      <ActionList.Description variant="inline">inline description</ActionList.Description>
    </ActionList.LinkItem>
    <ActionList.LinkItem href="?path=/story/components-actionlist--default">
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      With block description
      <ActionList.Description variant="block">Block description</ActionList.Description>
    </ActionList.LinkItem>
    <ActionList.LinkItem href="?path=/story/components-actionlist--default">
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      Trailing visual
      <ActionList.TrailingVisual>⌘ + L</ActionList.TrailingVisual>
    </ActionList.LinkItem>
  </ActionList>
)
ListLinkItem.storyName = 'Link Item'

const branches = [
  'main',
  'composable-dropdown',
  'exports',
  'label-to-beta',
  'reexport-behaviors',
  'changeset-release/main',
  'dependabot/npm_and_yarn/docs/engine.io-4.1.2',
  'ci-order',
  'mdx-components',
  'emoji-picker-api',
]

const filterSlowly = async (query: string) => {
  // sleep for 1s before returning results
  await new Promise(resolve => setTimeout(resolve, 1000))
  return await branches.filter(name => name.includes(query))
}

export function MixedSelection(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)
  const listRef = React.useRef<HTMLUListElement>(null)

  const options = [
    {text: 'Status', icon: <IssueOpenedIcon />},
    {text: 'Stage', icon: <TableIcon />},
    {text: 'Assignee', icon: <PeopleIcon />},
    {text: 'Team', icon: <TypographyIcon />},
    {text: 'Estimate', icon: <NumberIcon />},
    {text: 'Due Date', icon: <CalendarIcon />},
  ]

  const clearGroup = () => {
    ;(listRef.current?.querySelector('li[aria-selected="true"]') as HTMLLIElement | undefined)?.focus()
    setSelectedIndex(null)
  }

  return (
    <>
      <h1>List with mixed selection</h1>

      <p>
        In this list, there is a ActionList.Group with single selection for picking one option, followed by a Item that
        is an action. This pattern appears inside a menu for selection view options in Memex
      </p>

      <ActionList ref={listRef}>
        <ActionList.Group selectionVariant="single" role="listbox">
          <ActionList.GroupHeading as="h2">Group by</ActionList.GroupHeading>
          {options.map((option, index) => (
            <ActionList.Item
              key={index}
              selected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
              role="option"
            >
              <ActionList.LeadingVisual>{option.icon}</ActionList.LeadingVisual>
              {option.text}
            </ActionList.Item>
          ))}
        </ActionList.Group>
        {typeof selectedIndex === 'number' && (
          <>
            <ActionList.Divider />
            <ActionList.Item onSelect={clearGroup}>
              <ActionList.LeadingVisual>
                <XIcon />
              </ActionList.LeadingVisual>
              Clear Group by
            </ActionList.Item>
          </>
        )}
      </ActionList>
    </>
  )
}

export function AsyncListWithSpinner(): JSX.Element {
  const [results, setResults] = React.useState(branches.slice(0, 6))
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState('main')
  const [filterVal, setFilterVal] = React.useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter = async (event: any) => {
    setLoading(true)
    const filteredResults = await filterSlowly(event.target.value)
    setResults(filteredResults.slice(0, 6))
    setFilterVal(event.target.value)
    setLoading(false)
  }

  const getStatusMessage = () => {
    if (loading) return 'Loading results'
    if (!filterVal) return 'Showing top 6 branches'
    if (results.length === 0) return 'No branches match that query'
    return `Branches filtered, showing ${results.length} branches`
  }

  return (
    <>
      <h1>Async List</h1>
      <p>
        This pattern has an ActionList with single selection, the contents of which can change asynchronously through a
        filter. This pattern can be found in branch selection menus via the SelectPanel component.
      </p>

      <FormControl className={classes.AsyncListSearch}>
        <FormControl.Label>Search branches</FormControl.Label>
        <TextInput onChange={filter} block />
      </FormControl>
      {results.length === 0 ? <Text className={classes.AsyncListNoMatch}>No branches match that query</Text> : null}
      <VisuallyHidden>
        <AriaStatus>{getStatusMessage()}</AriaStatus>
      </VisuallyHidden>

      <ActionList selectionVariant="single" role="listbox" aria-label="Branch" className={classes.AsyncListItems}>
        {loading ? (
          <div className={classes.AsyncListSpinner}>
            <Spinner />
          </div>
        ) : (
          results.map(name => (
            <ActionList.Item key={name} role="option" selected={selected === name} onSelect={() => setSelected(name)}>
              {name}
            </ActionList.Item>
          ))
        )}
      </ActionList>
    </>
  )
}

export function AllCombinations(): JSX.Element {
  return (
    <>
      <h1>All Possible Combinations</h1>
      <code>
        dynamic features: L = Leading Visual, I = Inline Description, B = Block Description, T = Trailing Visual
      </code>
      <br />
      <code>16 possible combinations</code>
      <br />
      <br />
      <div className={classes.AllCombinationsContainer}>
        <ActionList showDividers>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            The everything bagel
            <ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>none of them, only text</ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            only L
          </ActionList.Item>
          <ActionList.Item>
            only I<ActionList.Description variant="inline">inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            only B<ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            only T
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I<ActionList.Description variant="inline">inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + B<ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + T
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            I + B<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            I + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I + B<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item disabled>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item disabled>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item disabled>
            I + B + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          {/* Inactive items */}
          <ActionList.Item inactiveText="Unavailable due to an outage">
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item inactiveText="Unavailable due to an outage">
            L + B + T<ActionList.Description variant="inline">Inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item inactiveText="Unavailable due to an outage">
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item inactiveText="Unavailable due to an outage">
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item inactiveText="Unavailable due to an outage">
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item inactiveText="Unavailable due to an outage">
            I + B + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          {/* Loading items */}
          <ActionList.Item loading>
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item loading>
            L + B + T<ActionList.Description variant="inline">Inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item loading>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item loading>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item loading>
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item loading>
            I + B + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item variant="danger">
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            Danger
            <ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </div>
    </>
  )
}

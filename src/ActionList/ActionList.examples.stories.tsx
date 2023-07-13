import {Meta} from '@storybook/react'
import React, {forwardRef} from 'react'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
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
import {ActionList, ActionListItemProps} from '.'
import TextInput from '../TextInput'
import Spinner from '../Spinner'
import Box from '../Box'
import Text from '../Text'

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

type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
const ReactRouterLikeLink = forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, ...props}: {to: string; children: React.ReactNode}, ref) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a ref={ref} href={to} {...props} />
  },
)

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
      ActionList.LinkItem with everything
      <ActionList.Description variant="inline">inline description</ActionList.Description>
      <ActionList.Description variant="block">Block description</ActionList.Description>
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

  const options = [
    {text: 'Status', icon: <IssueOpenedIcon />},
    {text: 'Stage', icon: <TableIcon />},
    {text: 'Assignee', icon: <PeopleIcon />},
    {text: 'Team', icon: <TypographyIcon />},
    {text: 'Estimate', icon: <NumberIcon />},
    {text: 'Due Date', icon: <CalendarIcon />},
  ]

  return (
    <>
      <h1>List with mixed selection</h1>

      <p>
        In this list, there is a ActionList.Group with single selection for picking one option, followed by a Item that
        is an action. This pattern appears inside a menu for selection view options in Memex
      </p>

      <ActionList>
        <ActionList.Group title="Group by" selectionVariant="single" role="listbox">
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
            <ActionList.Item onSelect={() => setSelectedIndex(null)}>
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter = async (event: any) => {
    setLoading(true)
    const filteredResults = await filterSlowly(event.target.value)
    setResults(filteredResults.slice(0, 6))
    setLoading(false)
  }

  return (
    <>
      <h1>Async List</h1>
      <p>
        This pattern has an ActionList with single selection, the contents of which can change asynchronously through a
        filter. This pattern can be found in branch selection menus via the SelectPanel component.
      </p>

      <TextInput onChange={filter} placeholder="Search branches" sx={{m: 2, mb: 0, width: 'calc(100% - 16px)'}} />
      {results.length === 0 ? (
        <Text sx={{display: 'block', fontSize: 1, m: 2}}>No branches match that query</Text>
      ) : null}
      <ActionList selectionVariant="single" role="listbox" aria-label="Branch" sx={{height: 208, overflow: 'auto'}}>
        {loading ? (
          <Box sx={{display: 'flex', justifyContent: 'center', pt: 2}}>
            <Spinner />
          </Box>
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

type Option = {text: string; icon: React.ReactNode; selected: boolean}
export function MemexSortable(): JSX.Element {
  const [options, setOptions] = React.useState<Option[]>([
    {text: 'Status', icon: <IssueOpenedIcon />, selected: true},
    {text: 'Stage', icon: <TableIcon />, selected: true},
    {text: 'Assignee', icon: <PeopleIcon />, selected: true},
    {text: 'Team', icon: <TypographyIcon />, selected: true},
    {text: 'Estimate', icon: <NumberIcon />, selected: false},
    {text: 'Due Date', icon: <CalendarIcon />, selected: false},
  ])

  const toggle = (text: string) => {
    setOptions(
      options.map(option => {
        if (option.text === text) option.selected = !option.selected
        return option
      }),
    )
  }

  const reorder = ({optionToMove, moveAfterOption}: {optionToMove: Option; moveAfterOption: Option}) => {
    setOptions(currentOptions => {
      const newOptions = [...currentOptions]
      // remove option to move
      const currentPosition = newOptions.findIndex(o => o.text === optionToMove.text)
      newOptions.splice(currentPosition, 1)
      // add it after the provided element
      const newPosition = newOptions.findIndex(o => o.text === moveAfterOption.text) + 1
      newOptions.splice(newPosition, 0, optionToMove)
      return newOptions
    })
  }

  const visibleOptions = options.filter(option => option.selected)
  const hiddenOptions = options.filter(option => !option.selected)

  return (
    // @ts-ignore react-dnd needs to be updated to support React 18
    <DndProvider backend={HTML5Backend}>
      <ActionList selectionVariant="multiple" role="menu">
        <ActionList.Group title="Visible fields (can be reordered)">
          {visibleOptions.map(option => (
            <SortableItem
              key={option.text}
              role="menuitemcheckbox"
              option={option}
              onSelect={() => toggle(option.text)}
              reorder={reorder}
            />
          ))}
        </ActionList.Group>
        <ActionList.Group
          title="Hidden fields"
          selectionVariant={
            /** selectionVariant override on Group: disable selection if there are no options */
            hiddenOptions.length ? 'multiple' : false
          }
        >
          {hiddenOptions.map((option, index) => (
            <ActionList.Item
              key={index}
              role="menuitemcheckbox"
              selected={option.selected}
              onSelect={() => toggle(option.text)}
            >
              <ActionList.LeadingVisual>{option.icon}</ActionList.LeadingVisual>
              {option.text}
            </ActionList.Item>
          ))}
          {hiddenOptions.length === 0 && <ActionList.Item disabled>No hidden fields</ActionList.Item>}
        </ActionList.Group>
      </ActionList>
    </DndProvider>
  )
}
MemexSortable.storyName = 'Memex Sortable List'

type SortableItemProps = {
  option: Option
  role: ActionListItemProps['role']
  onSelect: ActionListItemProps['onSelect']
  reorder: ({optionToMove, moveAfterOption}: {optionToMove: Option; moveAfterOption: Option}) => void
}
const SortableItem: React.FC<React.PropsWithChildren<SortableItemProps>> = ({option, role, onSelect, reorder}) => {
  const [{isDragging}, dragRef] = useDrag(() => ({
    type: 'ITEM',
    item: option,
    collect: monitor => {
      return {isDragging: monitor.isDragging()}
    },
  }))

  const [{isOver}, dropRef] = useDrop(() => ({
    accept: 'ITEM',
    collect: monitor => {
      return {isOver: monitor.isOver()}
    },
    drop: (optionDropped: Option) => {
      reorder({optionToMove: optionDropped, moveAfterOption: option})
    },
  }))

  return (
    <ActionList.Item
      role={role}
      ref={element => dragRef(element) && dropRef(element)} // merge refs
      selected={option.selected}
      onSelect={onSelect}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isOver ? theme => `0px 2px 0 0px ${theme.colors.accent.emphasis}` : undefined,
        borderRadius: isOver ? 0 : 2,
      }}
    >
      <ActionList.LeadingVisual>{option.icon}</ActionList.LeadingVisual>
      {option.text}
    </ActionList.Item>
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
      <Box maxWidth="300px">
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
      </Box>
    </>
  )
}

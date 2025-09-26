import {TriangleDownIcon} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import {useState, useEffect, useRef} from 'react'

import {Button} from '../Button'
import {SelectPanel} from '.'
import type {ItemInput} from '.'
import FormControl from '../FormControl'
import Text from '../Text'
import Select from '../Select/Select'
import type {SelectPanelSecondaryAction} from './SelectPanel'
import classes from './SelectPanel.stories.module.css'

const meta: Meta<typeof SelectPanel> = {
  title: 'Components/SelectPanel/Dev',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

const NoResultsMessage = (filter: string): {variant: 'empty'; title: string; body: string} => {
  return {
    variant: 'empty',
    title: `No language found for \`${filter}\``,
    body: 'Adjust your search term to find other languages',
  }
}

function getColorCircle(color: string) {
  return function () {
    return (
      <div
        className={classes.ColorCircle}
        style={{
          backgroundColor: color,
          borderColor: color,
        }}
      />
    )
  }
}

const items: ItemInput[] = [
  {
    leadingVisual: getColorCircle('#a2eeef'),
    text: 'enhancement',
    description: 'New feature or request',
    descriptionVariant: 'block',
    id: 1,
  },
  {
    leadingVisual: getColorCircle('#d73a4a'),
    text: 'bug',
    description: "Something isn't working",
    descriptionVariant: 'block',
    id: 2,
  },
  {
    leadingVisual: getColorCircle('#0cf478'),
    text: 'good first issue',
    description: 'Good for newcomers',
    descriptionVariant: 'block',
    id: 3,
  },
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

export const WithCss = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels" // button text when no items are selected
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
            {children}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        className="testCustomClassnameMono"
        message={selectedItemsSortedFirst.length === 0 ? NoResultsMessage(filter) : undefined}
      />
    </FormControl>
  )
}

const simpleItems = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

// onCancel is optional with variant=anchored, but required with variant=modal
type ParamProps =
  | {variant: 'anchored'; onCancel?: () => void; secondaryAction?: SelectPanelSecondaryAction}
  | {variant: 'modal'; onCancel: () => void; secondaryAction?: SelectPanelSecondaryAction}

const SingleSelectParams = ({variant, onCancel, secondaryAction}: ParamProps) => {
  const [selected, setSelected] = useState<ItemInput | undefined>(simpleItems[0])
  const [filter, setFilter] = useState('')
  const filteredItems = simpleItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  // Only the variant prop changes but Typescript doesn't easily understand that
  return variant === 'anchored' ? (
    <SelectPanel
      renderAnchor={({children, ...anchorProps}) => (
        <Button trailingAction={TriangleDownIcon} {...anchorProps}>
          {children ?? 'Select Labels'}
        </Button>
      )}
      placeholder="Select labels"
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={setSelected}
      onFilterChange={setFilter}
      width="medium"
      message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
      onCancel={onCancel}
      secondaryAction={secondaryAction}
    />
  ) : (
    <SelectPanel
      renderAnchor={({children, ...anchorProps}) => (
        <Button trailingAction={TriangleDownIcon} {...anchorProps}>
          {children ?? 'Select Labels'}
        </Button>
      )}
      placeholder="Select labels"
      open={open}
      onOpenChange={setOpen}
      items={filteredItems}
      selected={selected}
      onSelectedChange={setSelected}
      onFilterChange={setFilter}
      width="medium"
      message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
      onCancel={onCancel}
      secondaryAction={secondaryAction}
      variant="modal"
    />
  )
}

const MultiSelectParams = ({variant, onCancel, secondaryAction}: ParamProps) => {
  const [selected, setSelected] = useState<ItemInput[]>(simpleItems.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = simpleItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  // Only the variant prop changes but Typescript doesn't easily understand that
  return variant === 'anchored' ? (
    <SelectPanel
      title="Select labels"
      placeholder="Select labels"
      subtitle="Use labels to organize issues and pull requests"
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
      width="medium"
      message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
      onCancel={onCancel}
      secondaryAction={secondaryAction}
    />
  ) : (
    <SelectPanel
      title="Select labels"
      placeholder="Select labels"
      subtitle="Use labels to organize issues and pull requests"
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
      width="medium"
      message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
      variant="modal"
      onCancel={onCancel}
      secondaryAction={secondaryAction}
    />
  )
}

export const AllVariants = () => {
  const modes: {
    title: string
    component: React.FunctionComponent<ParamProps>
    variant: 'anchored' | 'modal'
  }[] = [
    {title: 'Single Select Panel', component: SingleSelectParams, variant: 'anchored'},
    {title: 'Single Select Modal', component: SingleSelectParams, variant: 'modal'},
    {title: 'Multi Select Panel', component: MultiSelectParams, variant: 'anchored'},
    {title: 'Multi Select Modal', component: MultiSelectParams, variant: 'modal'},
  ]

  const [secondaryAction, setSecondaryAction] = useState('button')

  const secondaryActionElement =
    secondaryAction === 'button' ? (
      <SelectPanel.SecondaryActionButton>Edit labels</SelectPanel.SecondaryActionButton>
    ) : (
      <SelectPanel.SecondaryActionLink href="#">Edit labels</SelectPanel.SecondaryActionLink>
    )

  return (
    <>
      <Text className={classes.TextTitleMediumBold}>Showcase of all the SelectPanel variants</Text>
      <br />
      <Text>
        Test the different interactions below to see how the SelectPanel behaves in different selection and anchoring
        modes.
      </Text>
      <br />
      <Text>
        The size of the screen also affects how the user interacts with the SelectPanel, so please do test on smaller
        screens.
      </Text>
      <br />
      <Text>Also please consider any feature flags that might affect the component.</Text>
      <br />
      <br />

      <Text className={classes.TextLargeBold}>Extra controls:</Text>
      <FormControl>
        <FormControl.Label>secondaryAction</FormControl.Label>
        <Select value={secondaryAction} onChange={e => setSecondaryAction(e.target.value)}>
          <Select.Option value="button">Button</Select.Option>
          <Select.Option value="link">Link</Select.Option>
        </Select>
      </FormControl>
      <br />
      <br />

      <table border={1} cellPadding="32">
        <thead>
          <tr>
            <th>Variant</th>
            <th>
              With <code>onCancel</code>
            </th>
            <th>
              With <code>onCancel</code> and <code>secondaryAction</code>
            </th>
            <th>
              No <code>onCancel</code>
            </th>
            <th>
              No <code>onCancel</code> and <code>secondaryAction</code>
            </th>
          </tr>
        </thead>
        <tbody>
          {modes.map(({title, component: Component, variant}) => (
            <tr key={title}>
              <th>{title}</th>
              <td>
                <Component onCancel={() => {}} variant={variant} />
              </td>
              <td>
                <Component onCancel={() => {}} secondaryAction={secondaryActionElement} variant={variant} />
              </td>
              <td>{variant === 'anchored' ? <Component variant={variant} /> : 'Not supported'}</td>
              <td>
                {variant === 'anchored' ? (
                  <Component secondaryAction={secondaryActionElement} variant={variant} />
                ) : (
                  'Not supported'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const NUMBER_OF_ITEMS = 500
const lotsOfItems = Array.from({length: NUMBER_OF_ITEMS}, (_, index) => {
  return {
    id: index,
    text: `Item ${index}`,
    description: `Description ${index}`,
    leadingVisual: getColorCircle('#a2eeef'),
  }
})

export const LotsOfItems = () => {
  const [selected, setSelected] = useState<ItemInput[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = lotsOfItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)
  const timeBeforeOpen = useRef<number>()
  const timeAfterOpen = useRef<number>()
  const [timeTakenToOpen, setTimeTakenToOpen] = useState<number>()

  const onOpenChange = () => {
    timeBeforeOpen.current = performance.now()
    setOpen(!open)
  }

  useEffect(() => {
    if (open) {
      timeAfterOpen.current = performance.now()
      if (timeBeforeOpen.current) setTimeTakenToOpen(timeAfterOpen.current - timeBeforeOpen.current)
    }
  }, [open])

  return (
    <>
      <p>
        Time taken to render {NUMBER_OF_ITEMS} items: {timeTakenToOpen || '(click "Select Labels" to open)'}
      </p>

      <FormControl>
        <FormControl.Label>Labels</FormControl.Label>
        <SelectPanel
          title="Select labels"
          placeholder="Select labels"
          subtitle="Use labels to organize issues and pull requests"
          renderAnchor={({children, ...anchorProps}) => (
            <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
              {children}
            </Button>
          )}
          open={open}
          onOpenChange={onOpenChange}
          items={filteredItems}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
          width="medium"
          height="large"
          message={filteredItems.length === 0 ? NoResultsMessage(filter) : undefined}
        />
      </FormControl>
    </>
  )
}

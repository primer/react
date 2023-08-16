import React from 'react'

import {SelectPanel} from './SelectPanel'
import {ActionList, Box} from '../../../src/index'

import data from './mock-data'

function getCircle(color: string) {
  return (
    <Box
      sx={{
        backgroundColor: `#${color}`,
        width: 14,
        height: 14,
        borderRadius: '100%',
      }}
    />
  )
}

export const Controlled = () => {
  // TODO/question: should the search work uncontrolled as well?
  type Label = (typeof data.labels)[0]

  const [filteredLabels, setFilteredLabels] = React.useState<Array<Label>>(data.labels)

  const initialSelectedLabels: Array<Label['id']> = [] // initial state: no labels
  // const initialSelectedLabels = data.issue.labelIds // initial state: has labels

  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  const [query, setQuery] = React.useState('')

  // TODO: should this be baked-in
  const searchOnChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value
    setQuery(query)

    if (query === '') setFilteredLabels(data.labels)
    else {
      // TODO: should probably add a highlight for matching text
      setFilteredLabels(
        data.labels
          .map(label => {
            if (label.name.toLowerCase().startsWith(query)) return {priority: 1, label}
            else if (label.name.toLowerCase().includes(query)) return {priority: 2, label}
            else if (label.description?.toLowerCase().includes(query)) return {priority: 3, label}
            else return {priority: -1, label}
          })
          .filter(result => result.priority > 0)
          .map(result => result.label),
      )
    }
  }

  const onLabelSelect = (labelId: string) => {
    if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
    else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
  }

  const onSubmit = event => {
    event.preventDefault() // coz form submit, innit
    onSave(selectedLabelIds)
  }

  const onClearSelection = () => {
    setSelectedLabelIds([])
    onSave([])
  }

  const onSave = (selectedLabelIds: string[]) => {
    data.issue.labelIds = selectedLabelIds // pretending to persist changes

    // eslint-disable-next-line no-console
    console.log('form submitted')
  }

  const sortingFn = (labelA, labelB) => {
    /* Important! This sorting is only for initial selected ids, not for subsequent changes!
      deterministic sorting for better UX: don't change positions with other selected items.

      TODO: should this sorting be baked-in OR we only validate + warn OR do nothing
      need to either own or accept the selection state to make that automatic
      OR provide a API for sorting in ActionList like sort by key or sort fn
    */
    if (selectedLabelIds.includes(labelA.id) && selectedLabelIds.includes(labelB.id)) return 1
    else if (selectedLabelIds.includes(labelA.id)) return -1
    else if (selectedLabelIds.includes(labelB.id)) return 1
    else return 1
  }

  return (
    <>
      <h1>Controlled SelectPanel</h1>

      {/* TODO: overlayProps on SelectPanel vs SelectPanel.Overlay */}

      <SelectPanel
        // onSubmit and onCancel feel out of place here instead of the footer,
        // but cancel can be called from 4 different actions - Cancel button, X iconbutton up top, press escape key, click outside
        // also, what if there is no footer? onSubmit is maybe not needed, but we need to put the onCancel callback somewhere.
        onSubmit={onSubmit}
        onCancel={() => {
          /* optional callback, for example: for multi-step overlay or to fire sync actions */
          // eslint-disable-next-line no-console
          console.log('panel was closed')
        }}
        // TODO: onClearSelection feels even more odd on the parent, instead of on the header.
        onClearSelection={event => {
          // not optional, we don't control the selection, so we just pass this through
          onClearSelection(event)
        }}
      >
        {/* TODO: the ref types don't match here, use useProvidedRefOrCreate */}
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        {/* TODO: header and heading is confusing. maybe skip header completely. */}
        <SelectPanel.Header>
          {/* TODO: Heading is not optional, but what if you don't give it
              Should we throw a big error or should we make that impossible in the API?
          */}
          <SelectPanel.Heading as="h4">Select authors</SelectPanel.Heading>

          <SelectPanel.SearchInput onChange={searchOnChange} />
        </SelectPanel.Header>

        <SelectPanel.Body>
          {/* TODO: selectionVariant=multiple should be automated
              if you want single selection, should it be here or on the 
              parent SelectPanel?
          */}
          <ActionList selectionVariant="multiple">
            {/* slightly different view for search results view and list view */}
            {query ? (
              filteredLabels.sort(sortingFn).map(label => (
                <ActionList.Item
                  key={label.id}
                  onSelect={() => onLabelSelect(label.id)}
                  selected={selectedLabelIds.includes(label.id)}
                >
                  <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                  {label.name}
                  <ActionList.Description>{label.description}</ActionList.Description>
                </ActionList.Item>
              ))
            ) : (
              <>
                {/* we want to split this into 2 sections with a divider in between */}
                {data.labels
                  .filter(label => selectedLabelIds.includes(label.id))
                  .sort(sortingFn)
                  .map(label => (
                    <ActionList.Item
                      key={label.id}
                      onSelect={() => onLabelSelect(label.id)}
                      selected={selectedLabelIds.includes(label.id)}
                    >
                      <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                      {label.name}
                      <ActionList.Description>{label.description}</ActionList.Description>
                    </ActionList.Item>
                  ))}

                {selectedLabelIds.length > 0 ? <ActionList.Divider /> : null}

                {data.labels
                  .filter(label => !selectedLabelIds.includes(label.id))
                  .map(label => (
                    <ActionList.Item
                      key={label.id}
                      onSelect={() => onLabelSelect(label.id)}
                      selected={selectedLabelIds.includes(label.id)}
                    >
                      <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                      {label.name}
                      <ActionList.Description>{label.description}</ActionList.Description>
                    </ActionList.Item>
                  ))}
              </>
            )}
          </ActionList>
        </SelectPanel.Body>
        <SelectPanel.Footer>
          <SelectPanel.SecondaryButton>View authors</SelectPanel.SecondaryButton>
        </SelectPanel.Footer>
      </SelectPanel>
    </>
  )
}

export const Uncontrolled = () => {
  // TODO/question: should the search work uncontrolled as well?
  type Label = (typeof data.labels)[0]

  const [filteredLabels, setFilteredLabels] = React.useState<Array<Label>>(data.labels)

  const initialSelectedLabels: Array<Label['id']> = [] // initial state: no labels
  // const initialSelectedLabels = data.issue.labelIds // initial state: has labels

  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  const [query, setQuery] = React.useState('')

  // TODO: should this be baked-in
  const searchOnChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value
    setQuery(query)

    if (query === '') setFilteredLabels(data.labels)
    else {
      // TODO: should probably add a highlight for matching text
      setFilteredLabels(
        data.labels
          .map(label => {
            if (label.name.toLowerCase().startsWith(query)) return {priority: 1, label}
            else if (label.name.toLowerCase().includes(query)) return {priority: 2, label}
            else if (label.description?.toLowerCase().includes(query)) return {priority: 3, label}
            else return {priority: -1, label}
          })
          .filter(result => result.priority > 0)
          .map(result => result.label),
      )
    }
  }

  const onLabelSelect = (labelId: string) => {
    if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
    else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
  }

  const onSubmit = event => {
    event.preventDefault() // coz form submit, innit
    onSave(selectedLabelIds)
  }

  const onClearSelection = () => {
    setSelectedLabelIds([])
    onSave([])
  }

  const onSave = (selectedLabelIds: string[]) => {
    data.issue.labelIds = selectedLabelIds // pretending to persist changes

    // eslint-disable-next-line no-console
    console.log('form submitted')
  }

  const sortingFn = (labelA, labelB) => {
    /* Important! This sorting is only for initial selected ids, not for subsequent changes!
      deterministic sorting for better UX: don't change positions with other selected items.

      TODO: should this sorting be baked-in OR we only validate + warn OR do nothing
      need to either own or accept the selection state to make that automatic
      OR provide a API for sorting in ActionList like sort by key or sort fn
    */
    if (selectedLabelIds.includes(labelA.id) && selectedLabelIds.includes(labelB.id)) return 1
    else if (selectedLabelIds.includes(labelA.id)) return -1
    else if (selectedLabelIds.includes(labelB.id)) return 1
    else return 1
  }

  return (
    <>
      <h1>Work in progress: Uncontrolled SelectPanel</h1>

      {/* TODO: overlayProps on SelectPanel vs SelectPanel.Overlay */}

      <SelectPanel
        // onSubmit and onCancel feel out of place here instead of the footer,
        // but cancel can be called from 4 different actions - Cancel button, X iconbutton up top, press escape key, click outside
        // also, what if there is no footer? onSubmit is maybe not needed, but we need to put the onCancel callback somewhere.
        onSubmit={onSubmit}
        onCancel={() => {
          /* optional callback, for example: for multi-step overlay or to fire sync actions */
          // eslint-disable-next-line no-console
          console.log('panel was closed')
        }}
        // TODO: onClearSelection feels even more odd on the parent, instead of on the header.
        onClearSelection={event => {
          // not optional, we don't control the selection, so we just pass this through
          onClearSelection(event)
        }}
      >
        {/* TODO: the ref types don't match here, use useProvidedRefOrCreate */}
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        {/* TODO: header and heading is confusing. maybe skip header completely. */}
        <SelectPanel.Header>
          {/* TODO: Heading is not optional, but what if you don't give it
              Should we throw a big error or should we make that impossible in the API?
          */}
          <SelectPanel.Heading as="h4">Select authors</SelectPanel.Heading>

          <SelectPanel.SearchInput onChange={searchOnChange} />
        </SelectPanel.Header>

        <SelectPanel.Body>
          {/* TODO: selectionVariant=multiple should be automated
              if you want single selection, should it be here or on the 
              parent SelectPanel?
          */}
          <ActionList selectionVariant="multiple">
            {/* slightly different view for search results view and list view */}
            {query ? (
              filteredLabels.sort(sortingFn).map(label => (
                <ActionList.Item
                  key={label.id}
                  onSelect={() => onLabelSelect(label.id)}
                  selected={selectedLabelIds.includes(label.id)}
                >
                  <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                  {label.name}
                  <ActionList.Description>{label.description}</ActionList.Description>
                </ActionList.Item>
              ))
            ) : (
              <>
                {/* we want to split this into 2 sections with a divider in between */}
                {data.labels
                  .filter(label => selectedLabelIds.includes(label.id))
                  .sort(sortingFn)
                  .map(label => (
                    <ActionList.Item
                      key={label.id}
                      onSelect={() => onLabelSelect(label.id)}
                      selected={selectedLabelIds.includes(label.id)}
                    >
                      <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                      {label.name}
                      <ActionList.Description>{label.description}</ActionList.Description>
                    </ActionList.Item>
                  ))}

                {selectedLabelIds.length > 0 ? <ActionList.Divider /> : null}

                {data.labels
                  .filter(label => !selectedLabelIds.includes(label.id))
                  .map(label => (
                    <ActionList.Item
                      key={label.id}
                      onSelect={() => onLabelSelect(label.id)}
                      selected={selectedLabelIds.includes(label.id)}
                    >
                      <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                      {label.name}
                      <ActionList.Description>{label.description}</ActionList.Description>
                    </ActionList.Item>
                  ))}
              </>
            )}
          </ActionList>
        </SelectPanel.Body>
        <SelectPanel.Footer>
          <SelectPanel.SecondaryButton>View authors</SelectPanel.SecondaryButton>
        </SelectPanel.Footer>
      </SelectPanel>
    </>
  )
}

export default {
  title: 'Drafts/Components/SelectPanel',
  component: SelectPanel,
}

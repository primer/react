import React, {useState} from 'react'
import type {Meta} from '@storybook/react-vite'

import Autocomplete from './Autocomplete'
import FormControl from '../FormControl'
import classes from './Autocomplete.dev.stories.module.css'

type Datum = {
  id: string
  text: string
}

const items: Datum[] = [
  {text: 'css', id: '0'},
  {text: 'css-in-js', id: '1'},
  {text: 'styled-system', id: '2'},
  {text: 'javascript', id: '3'},
  {text: 'typescript', id: '4'},
  {text: 'react', id: '5'},
  {text: 'design-systems', id: '6'},
]

const meta = {
  title: 'Components/Autocomplete/Dev',
  component: Autocomplete,
} satisfies Meta<typeof Autocomplete>

export default meta

export const ScrollRecalculation = () => {
  return (
    <div>
      <div style={{padding: '16px', marginBottom: '16px'}}>
        <p style={{fontWeight: 'bold'}}>How to test (scrollable container):</p>
        <p>
          1. Scroll down inside the bordered box until you see the Autocomplete input
          <br />
          2. Click the input to open the overlay
          <br />
          3. Scroll inside the box again
          <br />
          4. <strong>Expected:</strong> the overlay stays visually attached to the input
          <br />
          5. <strong>Bug (without fix):</strong> the overlay stays at its initial absolute position and detaches from
          the input
        </p>
      </div>

      <div className={classes.ScrollContainer}>
        {/* Spacer to push input below the fold */}
        <div style={{height: '600px'}} className={classes.ScrollSpacer}>
          <p className={classes.ScrollHint}>↓ Scroll down to find the Autocomplete input</p>
        </div>

        <form className={classes.FormPadding}>
          <FormControl>
            <FormControl.Label id="autocompleteLabel-scroll">Label</FormControl.Label>
            <Autocomplete>
              <Autocomplete.Input />
              <Autocomplete.Overlay>
                <Autocomplete.Menu selectedItemIds={[]} aria-labelledby="autocompleteLabel-scroll" items={items} />
              </Autocomplete.Overlay>
            </Autocomplete>
          </FormControl>
        </form>

        {/* Spacer below so there's room to scroll further */}
        <div style={{height: '800px'}} />
      </div>
    </div>
  )
}

export const WindowScrollRecalculation = () => {
  return (
    <div>
      <div style={{padding: '16px'}}>
        <p style={{fontWeight: 'bold'}}>How to test (window scroll):</p>
        <p>
          1. Scroll down the page until you see the Autocomplete input
          <br />
          2. Click the input to open the overlay
          <br />
          3. Scroll the page again
          <br />
          4. <strong>Expected:</strong> the overlay stays visually attached to the input
          <br />
          5. <strong>Bug (without fix):</strong> the overlay stays at its initial absolute position and detaches from
          the input
        </p>
      </div>

      {/* Spacer to push input below the fold */}
      <div style={{height: '120vh', padding: '16px'}}>
        <p className={classes.ScrollHint}>↓ Scroll down to find the Autocomplete input</p>
      </div>

      <form className={classes.FormPadding}>
        <FormControl>
          <FormControl.Label id="autocompleteLabel-window-scroll">Label</FormControl.Label>
          <Autocomplete>
            <Autocomplete.Input />
            <Autocomplete.Overlay>
              <Autocomplete.Menu selectedItemIds={[]} aria-labelledby="autocompleteLabel-window-scroll" items={items} />
            </Autocomplete.Overlay>
          </Autocomplete>
        </FormControl>
      </form>

      {/* Spacer below so there's room to scroll further */}
      <div style={{height: '120vh'}} />
    </div>
  )
}

export const OverlayAtBottomOfViewport = () => {
  return (
    <div>
      <div style={{padding: '16px'}}>
        <p style={{fontWeight: 'bold'}}>How to test:</p>
        <p>
          1. Click the Autocomplete input at the bottom of the viewport
          <br />
          2. <strong>Expected:</strong> the overlay repositions above the input so it stays inside the viewport
          <br />
          3. <strong>Bug (without fix):</strong> the overlay opens below and is clipped or extends outside the viewport
        </p>
      </div>

      <div className={classes.BottomAligned}>
        <form className={classes.FormPadding}>
          <FormControl>
            <FormControl.Label id="autocompleteLabel-bottom">Label</FormControl.Label>
            <Autocomplete>
              <Autocomplete.Input />
              <Autocomplete.Overlay>
                <Autocomplete.Menu selectedItemIds={[]} aria-labelledby="autocompleteLabel-bottom" items={items} />
              </Autocomplete.Overlay>
            </Autocomplete>
          </FormControl>
        </form>
      </div>
    </div>
  )
}

export const WithMultiselect = () => {
  const [selectedItemIds, setSelectedItemIds] = useState<Array<string>>([])

  const onSelectedChange = (newlySelectedItems: Datum | Datum[]) => {
    if (!Array.isArray(newlySelectedItems)) {
      return
    }
    setSelectedItemIds(newlySelectedItems.map(item => item.id))
  }

  return (
    <div>
      <div style={{padding: '16px'}}>
        <p style={{fontWeight: 'bold'}}>How to test:</p>
        <p>
          1. Click the input to open the overlay
          <br />
          2. Select multiple items
          <br />
          3. <strong>Expected:</strong> the overlay stays properly positioned as items are selected and the input height
          may change
        </p>
      </div>

      <form className={classes.FormPadding}>
        <FormControl>
          <FormControl.Label id="autocompleteLabel-multiselect">Label</FormControl.Label>
          <Autocomplete>
            <Autocomplete.Input />
            <Autocomplete.Overlay>
              <Autocomplete.Menu
                selectedItemIds={selectedItemIds}
                onSelectedChange={onSelectedChange}
                selectionVariant="multiple"
                aria-labelledby="autocompleteLabel-multiselect"
                items={items}
              />
            </Autocomplete.Overlay>
          </Autocomplete>
        </FormControl>
      </form>
    </div>
  )
}

export const WithCustomOverlayProps = () => {
  return (
    <div>
      <div style={{padding: '16px'}}>
        <p style={{fontWeight: 'bold'}}>How to test:</p>
        <p>
          1. Click the input to open the overlay
          <br />
          2. <strong>Expected:</strong> the overlay has a fixed width and max height, and scrolls internally when
          content overflows
        </p>
      </div>

      <form className={classes.FormPadding}>
        <FormControl>
          <FormControl.Label id="autocompleteLabel-overlay-props">Label</FormControl.Label>
          <Autocomplete>
            <Autocomplete.Input />
            <Autocomplete.Overlay width="large" height="xsmall">
              <Autocomplete.Menu selectedItemIds={[]} aria-labelledby="autocompleteLabel-overlay-props" items={items} />
            </Autocomplete.Overlay>
          </Autocomplete>
        </FormControl>
      </form>
    </div>
  )
}

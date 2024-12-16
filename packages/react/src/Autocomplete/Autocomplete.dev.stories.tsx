import React from 'react'
import type {Meta} from '@storybook/react'

import Autocomplete from './Autocomplete'
import FormControl from '../FormControl'
import Box from '../Box'

const autocompleteStoryMeta: Meta = {
  title: 'Components/Autocomplete/Dev',
} as Meta

export const SxProp = () => {
  return (
    <form>
      <FormControl required={true}>
        <FormControl.Label id="autocompleteLabel">Label</FormControl.Label>
        <Autocomplete>
          <Autocomplete.Input
            sx={{
              width: '100%',
              marginRight: '10px',
            }}
            size="medium"
            style={{backgroundColor: 'pink'}}
          />
          <Autocomplete.Overlay
            className="test-class-name"
            visibility="visible"
            sx={{
              maxHeight: 'min(50vh, 280px)',
              overflowY: 'scroll',
              ' div': {
                flexDirection: 'column',
                whiteSpace: 'pre-wrap',
              },
            }}
            style={{backgroundColor: 'lightblue'}}
          >
            <Autocomplete.Menu items={[]} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
    </form>
  )
}

export default autocompleteStoryMeta

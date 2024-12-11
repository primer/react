import React from 'react'
import type {Meta} from '@storybook/react'

import Autocomplete from './Autocomplete'

const autocompleteStoryMeta: Meta = {
  title: 'Components/Autocomplete/Dev',
} as Meta

export const SxProp = () => {
  return (
    <Autocomplete id="autocompleteId">
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
        <Autocomplete.Menu items={[]} selectedItemIds={[]} aria-labelledby="sample" />
      </Autocomplete.Overlay>
    </Autocomplete>
  )
}

export default autocompleteStoryMeta

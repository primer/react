import type {Meta} from '@storybook/react-vite'

import Autocomplete from './Autocomplete'
import FormControl from '../FormControl'

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
              borderColor: 'deeppink',
            }}
            size="medium"
          />
          <Autocomplete.Overlay
            className="testCustomClassnameBorder"
            visibility="visible"
            sx={{
              maxHeight: 'min(50vh, 280px)',
              overflowY: 'scroll',
              ' div': {
                flexDirection: 'column',
                whiteSpace: 'pre-wrap',
              },
              outline: '1px solid deeppink',
            }}
          >
            <Autocomplete.Menu items={[]} selectedItemIds={[]} aria-labelledby="autocompleteLabel" />
          </Autocomplete.Overlay>
        </Autocomplete>
      </FormControl>
    </form>
  )
}

export default autocompleteStoryMeta

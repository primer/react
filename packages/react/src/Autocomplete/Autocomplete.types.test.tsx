import {LogoGithubIcon} from '@primer/octicons-react'
import {Autocomplete} from '..'

export function itemWithIconElements() {
  return (
    <>
      <label htmlFor="autocompleteId" id="autocompleteLabel">
        Autocomplete field
      </label>
      <Autocomplete id="autocompleteId">
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            aria-labelledby="autocompleteLabel"
            selectedItemIds={[]}
            items={[
              {text: 'Item1', id: 'item-1', leadingVisual: <LogoGithubIcon />, trailingVisual: <LogoGithubIcon />},
            ]}
          ></Autocomplete.Menu>
        </Autocomplete.Overlay>
      </Autocomplete>
    </>
  )
}

import {Meta} from '@storybook/react'
import React from 'react'
import {theme, ThemeProvider} from '..'
import {ItemInput} from '../ActionList/List'
import BaseStyles from '../BaseStyles'
import {DropdownMenu, DropdownButton} from '../DropdownMenu'

const meta: Meta = {
  title: 'Composite components/DropdownMenu',
  component: DropdownMenu,
  decorators: [
    (Story: React.ComponentType): JSX.Element => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {
    controls: {
      disable: true
    }
  }
}
export default meta

export function FavoriteColorStory(): JSX.Element {
  const items = React.useMemo(() => [{text: '🔵 Cyan'}, {text: '🔴 Magenta'}, {text: '🟡 Yellow'}], [])
  const [selectedItem, setSelectedItem] = React.useState<ItemInput | undefined>()

  return (
    <>
      <h1>Favorite Color</h1>
      <div id="favorite-color-label">Please select your favorite color:</div>
      <DropdownMenu
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <DropdownButton aria-labelledby={`favorite-color-label ${ariaLabelledBy}`} {...anchorProps}>
            {children}
          </DropdownButton>
        )}
        placeholder="🎨"
        items={items}
        selectedItem={selectedItem}
        onChange={setSelectedItem}
      />
    </>
  )
}
FavoriteColorStory.storyName = 'Favorite Color'

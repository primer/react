import {Meta} from '@storybook/react'
import React from 'react'
import {theme, ThemeProvider} from '../..'
import {ItemInput} from '../../deprecated/ActionList/List'
import BaseStyles from '../../BaseStyles'
import Box from '../../Box'
import {DropdownMenu, DropdownButton} from '../../deprecated'
import TextInput from '../../TextInput'

const meta: Meta = {
  title: 'Deprecated/Components/DropdownMenu',
  component: DropdownMenu,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

export function FavoriteColorStory(): JSX.Element {
  const items = React.useMemo(() => [{text: '🔵 Cyan'}, {text: '🔴 Magenta'}, {text: '🟡 Yellow'}], [])
  const [selectedItem, setSelectedItem] = React.useState<ItemInput | undefined>()

  return (
    <>
      <h1>Favorite Color</h1>
      <TextInput placeholder="Input for focus testing" sx={{mb: 2}} />
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

export function ExternalAnchorStory(): JSX.Element {
  const items = React.useMemo(() => [{text: '🔵 Cyan'}, {text: '🔴 Magenta'}, {text: '🟡 Yellow'}], [])
  const [selectedItem, setSelectedItem] = React.useState<ItemInput | undefined>()
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Box display="flex" flexDirection="row">
        <DropdownButton onClick={() => setOpen(true)}>Click me to open the dropdown</DropdownButton>
        <Box ref={anchorRef} bg="papayawhip" p={4} ml={40} borderRadius={2} display="inline-block">
          Anchored on me!
        </Box>
      </Box>
      <DropdownMenu
        renderAnchor={null}
        anchorRef={anchorRef}
        open={open}
        onOpenChange={setOpen}
        placeholder="🎨"
        items={items}
        selectedItem={selectedItem}
        onChange={setSelectedItem}
      />
    </Box>
  )
}
ExternalAnchorStory.storyName = 'DropdownMenu with External Anchor'

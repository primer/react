import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {KeybindingHint} from './KeybindingHint'
it('announces sequence separators while rendering compact keys', () => {
  render(<KeybindingHint keys="Mod+k g" />)
  expect(screen.getByTestId('keybinding-hint')).toHaveTextContent('⌘/Ctrl+kthen g')
  expect(screen.getByText('then')).toHaveClass('sr-only')
})

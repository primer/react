import type {Meta} from '@storybook/react-vite'
import {Checkbox, CheckboxGroup, FormControl} from '..'

export default {
  title: 'Components/CheckboxGroup/Dev',
  component: CheckboxGroup,
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'onChange', 'sx']}},
} as Meta

export const SxProps = () => (
  <CheckboxGroup
    sx={{
      color: 'var(--fgColor-default, var(--color-fg-default))',
      my: '15px',
    }}
  >
    <CheckboxGroup.Caption
      sx={{
        color: 'fg.muted',
        fontSize: 0,
        fontWeight: 400,
      }}
    >
      Caption
    </CheckboxGroup.Caption>
    <CheckboxGroup.Label
      sx={{
        color: 'var(--fgColor-default, var(--color-fg-default))',
        fontSize: ['14px'],
        fontWeight: 600,
      }}
    >
      Choices
    </CheckboxGroup.Label>
    <FormControl required>
      <Checkbox value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </CheckboxGroup>
)

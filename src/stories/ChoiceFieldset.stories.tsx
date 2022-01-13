import React from 'react'
import {Meta} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'
import {BaseStyles, Box, ThemeProvider} from '..'
import ChoiceFieldset from '../ChoiceFieldset'
import Item from '../ChoiceFieldset/ChoiceFieldsetListItem'
import {ComponentProps} from '../utils/types'
import {ChoiceFieldsetListProps} from '../ChoiceFieldset/ChoiceFieldsetList'

type Args = ComponentProps<typeof ChoiceFieldset> & ChoiceFieldsetListProps

export default {
  title: 'Forms/ChoiceFieldset',
  component: ChoiceFieldset,
  argTypes: {
    disabled: {
      defaultValue: false
    },
    required: {
      defaultValue: false
    },
    selectionVariant: {
      options: ['single', 'multiple'],
      control: {type: 'radio'},
      defaultValue: 'single'
    },
    validationResult: {
      options: ['invalidChoice', 'validChoice'],
      control: {type: 'radio'},
      defaultValue: 'validChoice'
    },
    validationMap: {
      defaultValue: {
        invalidChoice: 'error',
        validChoice: 'success'
      }
    }
  },
  parameters: {controls: {exclude: ['id', 'validationMap', 'validationResult', 'name', 'onSelect']}},
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const RadioGroup = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
RadioGroup.storyName = 'Radio group (default)'

export const CheckboxGroup = ({selectionVariant: _selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant="multiple">
      <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
CheckboxGroup.parameters = {controls: {exclude: ['id', 'selectionVariant']}}
CheckboxGroup.storyName = 'Checkbox group'

export const WithOnSelectHandler = ({selectionVariant: _selectionVariant, ...restArgs}: Args) => {
  const [selectedChoices, setSelectedChoices] = React.useState<string[]>(['one'])

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <ChoiceFieldset
          onSelect={selectedValues => {
            setSelectedChoices(selectedValues)
          }}
          selected={selectedChoices}
          {...restArgs}
        >
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List selectionVariant="multiple">
            <ChoiceFieldset.Item value="one">Label one</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="two">Label two</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
        </ChoiceFieldset>
      </Box>
      <Box flexGrow={1}>
        <div>The values of your selected choices:</div>
        <Box as="ul" margin={0}>
          {selectedChoices.map(choice => (
            <li key={choice}>{choice}</li>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

WithOnSelectHandler.storyName = 'With onSelect handler'

export const Required = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset required {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
Required.parameters = {controls: {exclude: ['required']}}

export const Disabled = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset disabled {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
Disabled.parameters = {controls: {exclude: ['disabled']}}

export const WithVisuallyHiddenLegend = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend visuallyHidden>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)

export const WithDescription = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.Description>Hint: any selection is valid</ChoiceFieldset.Description>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)

export const WithValidation = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
    </ChoiceFieldset.List>
    <ChoiceFieldset.Validation validationKey="validChoice">You made the right selection</ChoiceFieldset.Validation>
    <ChoiceFieldset.Validation validationKey="invalidChoice">You made the wrong selection</ChoiceFieldset.Validation>
  </ChoiceFieldset>
)
WithValidation.parameters = {controls: {exclude: ['id']}}

export const WithLeadingVisual = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">
        <Item.LeadingVisual>
          <MarkGithubIcon />
        </Item.LeadingVisual>
        <Item.Label>Label one</Item.Label>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">
        <Item.LeadingVisual>
          <MarkGithubIcon />
        </Item.LeadingVisual>
        <Item.Label>Label two</Item.Label>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
WithLeadingVisual.storyName = 'Choices with a LeadingVisual'

export const WithChoiceCaptions = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item value="labelOne">
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item value="labelTwo">
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
WithChoiceCaptions.storyName = 'Choices with a Caption'

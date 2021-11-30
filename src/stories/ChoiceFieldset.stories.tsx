import React from 'react'
import {Meta} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'
import {BaseStyles, ThemeProvider} from '..'
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
  parameters: {controls: {exclude: ['id', 'validationMap', 'validationResult', 'name']}},
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
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
RadioGroup.storyName = 'Radio group (default)'

export const CheckboxGroup = ({selectionVariant: _selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant="multiple">
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
CheckboxGroup.parameters = {controls: {exclude: ['id', 'selectionVariant']}}
CheckboxGroup.storyName = 'Checkbox group'

export const Required = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" required {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
Required.parameters = {controls: {exclude: ['required']}}

export const Disabled = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" disabled {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
Disabled.parameters = {controls: {exclude: ['disabled']}}

export const WithVisuallyHiddenLegend = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend visuallyHidden>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)

export const WithCaption = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
    <ChoiceFieldset.Caption>Hint: any selection is valid</ChoiceFieldset.Caption>
  </ChoiceFieldset>
)

export const WithValidation = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
    <ChoiceFieldset.Validation validationKey="validChoice">You made the right selection</ChoiceFieldset.Validation>
    <ChoiceFieldset.Validation validationKey="invalidChoice">You made the wrong selection</ChoiceFieldset.Validation>
  </ChoiceFieldset>
)
WithValidation.parameters = {controls: {exclude: ['id']}}

export const WithValidationAndCaption = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
    <ChoiceFieldset.Validation validationKey="validChoice">You made the right selection</ChoiceFieldset.Validation>
    <ChoiceFieldset.Validation validationKey="invalidChoice">You made the wrong selection</ChoiceFieldset.Validation>
    <ChoiceFieldset.Caption>Hint: use the Controls panel to see the error message</ChoiceFieldset.Caption>
  </ChoiceFieldset>
)
WithValidationAndCaption.parameters = {controls: {exclude: ['id']}}

export const WithLeadingVisual = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.Item>
        <Item.Input value="labelOne" />
        <Item.LeadingVisual>
          <MarkGithubIcon />
        </Item.LeadingVisual>
        <Item.Label>Label one</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
      <ChoiceFieldset.Item>
        <Item.Input value="labelTwo" />
        <Item.LeadingVisual>
          <MarkGithubIcon />
        </Item.LeadingVisual>
        <Item.Label>Label two</Item.Label>
        <Item.Caption>Caption</Item.Caption>
      </ChoiceFieldset.Item>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
WithLeadingVisual.storyName = 'With LeadingVisual'

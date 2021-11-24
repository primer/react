import React from 'react'
import {Meta} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'
import {BaseStyles, ThemeProvider} from '..'
import ChoiceFieldset from '../ChoiceFieldset'
import ChoiceField from '../ChoiceFieldset/ChoiceField'
import {ComponentProps} from '../utils/types'
import {ChoiceFieldsetListProps} from '../ChoiceFieldset/ChoiceFieldsetList'

type Args = ComponentProps<typeof ChoiceFieldset> & ChoiceFieldsetListProps

export default {
  title: 'Forms/ChoiceFieldset',
  component: ChoiceFieldset,
  argTypes: {
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
  parameters: {controls: {exclude: ['id', 'validationMap', 'validationResult']}},
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
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
RadioGroup.storyName = 'Radio group (default)'

export const CheckboxGroup = ({selectionVariant: _selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant="multiple">
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
CheckboxGroup.parameters = {controls: {exclude: ['id', 'selectionVariant']}}
CheckboxGroup.storyName = 'Checkbox group'

export const Required = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" required {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
Required.parameters = {controls: {exclude: ['required']}}

export const WithVisuallyHiddenLegend = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend visuallyHidden>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)

export const WithCaption = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
    </ChoiceFieldset.List>
    <ChoiceFieldset.Caption>Hint: any selection is valid</ChoiceFieldset.Caption>
  </ChoiceFieldset>
)

export const WithValidation = ({selectionVariant, ...restArgs}: Args) => (
  <ChoiceFieldset name="radioGroup" {...restArgs}>
    <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
    <ChoiceFieldset.List selectionVariant={selectionVariant}>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
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
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
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
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelOne" />
        <ChoiceField.LeadingVisual>
          <MarkGithubIcon />
        </ChoiceField.LeadingVisual>
        <ChoiceField.Label>Label one</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
      <ChoiceFieldset.ChoiceField>
        <ChoiceField.Input value="labelTwo" />
        <ChoiceField.LeadingVisual>
          <MarkGithubIcon />
        </ChoiceField.LeadingVisual>
        <ChoiceField.Label>Label two</ChoiceField.Label>
        <ChoiceField.Caption>Caption</ChoiceField.Caption>
      </ChoiceFieldset.ChoiceField>
    </ChoiceFieldset.List>
  </ChoiceFieldset>
)
WithLeadingVisual.storyName = 'With LeadingVisual'

import React from 'react'
import {render} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {SSRProvider} from '../../'
import {MarkGithubIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import ChoiceFieldset, {Item, ChoiceFieldsetProps} from '../../deprecated/ChoiceFieldset'
import {ChoiceFieldsetListProps} from '../../deprecated/ChoiceFieldset/ChoiceFieldsetList'

const SelectableChoicelistFieldset: React.FC<React.PropsWithChildren<ChoiceFieldsetProps & ChoiceFieldsetListProps>> =
  ({onSelect, selectionVariant, selected = []}) => {
    const [selectionVals, setSelectionVals] = React.useState<string[]>(selected)

    React.useEffect(() => {
      onSelect && onSelect(selectionVals)
    }, [onSelect, selectionVals])

    return (
      <SSRProvider>
        <ChoiceFieldset
          onSelect={selectedVals => {
            setSelectionVals(selectedVals)
          }}
          selected={selectionVals}
        >
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List selectionVariant={selectionVariant}>
            <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
        </ChoiceFieldset>
      </SSRProvider>
    )
  }

describe('ChoiceFieldset', () => {
  it('renders default', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset>
            <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.List>
              <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders a group of checkbox inputs when selectionVariant=single (default)', () => {
    const {getByLabelText} = HTMLRender(
      <SSRProvider>
        <ChoiceFieldset>
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List>
            <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
        </ChoiceFieldset>
      </SSRProvider>
    )
    const firstInput = getByLabelText('Label one')
    const secondInput = getByLabelText('Label one')

    expect(firstInput.getAttribute('type')).toBe('radio')
    expect(secondInput.getAttribute('type')).toBe('radio')
  })
  it('renders a group of checkbox inputs when selectionVariant=multiple', () => {
    const {getByLabelText} = HTMLRender(
      <SSRProvider>
        <ChoiceFieldset>
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List selectionVariant="multiple">
            <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
        </ChoiceFieldset>
      </SSRProvider>
    )
    const firstInput = getByLabelText('Label one')
    const secondInput = getByLabelText('Label one')

    expect(firstInput.getAttribute('type')).toBe('checkbox')
    expect(secondInput.getAttribute('type')).toBe('checkbox')
  })
  it('renders a list of items with leading visuals and captions', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset>
            <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.List>
              <ChoiceFieldset.Item value="labelOne">
                <Item.LeadingVisual>
                  <MarkGithubIcon />
                </Item.LeadingVisual>
                <Item.Label>Label one</Item.Label>
                <Item.Caption>Caption one</Item.Caption>
              </ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">
                <Item.LeadingVisual>
                  <MarkGithubIcon />
                </Item.LeadingVisual>
                <Item.Label>Label two</Item.Label>
                <Item.Caption>Caption two</Item.Caption>
              </ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders a list with selected items', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset selected={['labelOne', 'labelTwo']}>
            <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.List selectionVariant="multiple">
              <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelThree">Label three</ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders a disabled list', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset disabled>
            <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.List>
              <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders a required fieldset', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset required>
            <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.List>
              <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders a fieldset with a description', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset>
            <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.Description>Description</ChoiceFieldset.Description>
            <ChoiceFieldset.List>
              <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders with a custom name and id passed', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset name="radioGroup" id="uniqueRadioGroup">
            <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.List>
              <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders with a hidden legend', () => {
    expect(
      render(
        <SSRProvider>
          <ChoiceFieldset>
            <ChoiceFieldset.Legend visuallyHidden>Legend</ChoiceFieldset.Legend>
            <ChoiceFieldset.List>
              <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
              <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
            </ChoiceFieldset.List>
          </ChoiceFieldset>
        </SSRProvider>
      )
    ).toMatchSnapshot()
  })
  it('renders with a success validation message', () => {
    const {container, queryByText} = HTMLRender(
      <SSRProvider>
        <ChoiceFieldset validationMap={{validChoice: 'success', invalidChoice: 'error'}} validationResult="validChoice">
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List>
            <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
          <ChoiceFieldset.Validation validationKey="validChoice">
            You made the right selection
          </ChoiceFieldset.Validation>
          <ChoiceFieldset.Validation validationKey="invalidChoice">
            You made the wrong selection
          </ChoiceFieldset.Validation>
        </ChoiceFieldset>
      </SSRProvider>
    )
    const successValidationMessage = queryByText('You made the right selection')
    const errorValidationMessage = queryByText('You made the wrong selection')

    expect(container).toMatchSnapshot()
    expect(successValidationMessage).not.toBeNull()
    expect(errorValidationMessage).toBeNull()
  })
  it('renders with an error validation message', () => {
    const {container, queryByText} = HTMLRender(
      <SSRProvider>
        <ChoiceFieldset
          validationMap={{validChoice: 'success', invalidChoice: 'error'}}
          validationResult="invalidChoice"
        >
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List>
            <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
          <ChoiceFieldset.Validation validationKey="validChoice">
            You made the right selection
          </ChoiceFieldset.Validation>
          <ChoiceFieldset.Validation validationKey="invalidChoice">
            You made the wrong selection
          </ChoiceFieldset.Validation>
        </ChoiceFieldset>
      </SSRProvider>
    )
    const successValidationMessage = queryByText('You made the right selection')
    const errorValidationMessage = queryByText('You made the wrong selection')

    expect(container).toMatchSnapshot()
    expect(errorValidationMessage).not.toBeNull()
    expect(successValidationMessage).toBeNull()
  })
  it('calls onSelect with the values of the selected item (single selection)', () => {
    const onSelectHandler = jest.fn()
    const {getByLabelText} = HTMLRender(
      <SelectableChoicelistFieldset onSelect={onSelectHandler} selectionVariant="single" />
    )
    const labelOneInputNode = getByLabelText('Label one')

    userEvent.click(labelOneInputNode)
    expect(onSelectHandler).toHaveBeenCalledWith(['labelOne'])
  })
  it('calls onSelect with the values of the selected items (multiple selections)', () => {
    const onSelectHandler = jest.fn()

    const {getByLabelText} = HTMLRender(
      <SelectableChoicelistFieldset onSelect={onSelectHandler} selectionVariant="multiple" selected={['labelOne']} />
    )
    const labelTwoInputNode = getByLabelText('Label two')

    userEvent.click(labelTwoInputNode)
    expect(onSelectHandler).toHaveBeenCalledWith(['labelOne', 'labelTwo'])
  })
  it('calls onSelect with an empty array if all values have be de-selected', () => {
    const onSelectHandler = jest.fn()

    const {getByLabelText} = HTMLRender(
      <SelectableChoicelistFieldset onSelect={onSelectHandler} selectionVariant="multiple" selected={['labelTwo']} />
    )
    const labelTwoInputNode = getByLabelText('Label two')

    userEvent.click(labelTwoInputNode)
    expect(onSelectHandler).toHaveBeenCalledWith([])
  })
  it('generates a name attribute for radio groups if one is not provided', () => {
    const {getByLabelText} = HTMLRender(
      <SSRProvider>
        <ChoiceFieldset>
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List>
            <ChoiceFieldset.Item value="labelOne">Label one</ChoiceFieldset.Item>
            <ChoiceFieldset.Item value="labelTwo">Label two</ChoiceFieldset.Item>
          </ChoiceFieldset.List>
        </ChoiceFieldset>
      </SSRProvider>
    )

    const labelOneInputNode = getByLabelText('Label one')
    const labelTwoInputNode = getByLabelText('Label two')

    expect(labelOneInputNode.getAttribute('name')).toBeDefined()
    expect(labelOneInputNode.getAttribute('name')).toEqual(labelTwoInputNode.getAttribute('name'))
  })
})

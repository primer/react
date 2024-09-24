import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {Details, useDetails, Box} from '../..'
import {Button, ButtonPrimary} from '../../deprecated'
import type {ButtonProps} from '../../deprecated/Button/Button'
import {behavesAsComponent, checkExports} from '../../utils/testing'
import axe from 'axe-core'

describe('Details', () => {
  behavesAsComponent({Component: Details})

  checkExports('Details', {
    default: Details,
  })

  it('should have no axe violations', async () => {
    const {container} = render(<Details />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('Toggles when you click outside', () => {
    const Component = () => {
      const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
      return (
        <Details data-testid="details" {...getDetailsProps()}>
          <Details.Summary>hi</Details.Summary>
        </Details>
      )
    }

    const {getByTestId} = render(<Component />)

    document.body.click()

    expect(getByTestId('details')).not.toHaveAttribute('open')
  })

  it('Accurately passes down open state', () => {
    const Component = () => {
      const {getDetailsProps, open} = useDetails({closeOnOutsideClick: true})
      return (
        <Details {...getDetailsProps()} data-testid="details">
          <Details.Summary as={Button} data-testid="summary">
            {open ? 'Open' : 'Closed'}
          </Details.Summary>
        </Details>
      )
    }

    const {getByTestId} = render(<Component />)

    document.body.click()

    expect(getByTestId('summary')).toHaveTextContent('Closed')
    expect(getByTestId('details')).not.toHaveAttribute('open')
  })

  it('Can manipulate state with setOpen', async () => {
    const user = userEvent.setup()
    const CloseButton = (props: ButtonProps) => <Button {...props} />
    const Component = () => {
      const {getDetailsProps, setOpen, open} = useDetails({closeOnOutsideClick: true, defaultOpen: true})
      return (
        <Details {...getDetailsProps()} data-testid="details">
          <Button as="summary" data-testid="summary">
            {open ? 'Open' : 'Closed'}
          </Button>
          <CloseButton onClick={() => setOpen(false)}>Close</CloseButton>
        </Details>
      )
    }

    const {getByRole, getByTestId} = render(<Component />)

    await user.click(getByRole('button', {name: 'Close'}))

    expect(getByTestId('summary')).toHaveTextContent('Closed')
    expect(getByTestId('details')).not.toHaveAttribute('open')
  })

  it('Does not toggle when you click inside', async () => {
    const user = userEvent.setup()
    const Component = () => {
      const {getDetailsProps, open} = useDetails({closeOnOutsideClick: true, defaultOpen: true})
      return (
        <Details {...getDetailsProps()}>
          <Button as="summary" data-testid="summary">
            {open ? 'Open' : 'Closed'}
          </Button>
          <Box>
            <ButtonPrimary>test</ButtonPrimary>
          </Box>
        </Details>
      )
    }

    const {getByRole, getByTestId} = render(<Component />)

    await user.click(getByRole('button', {name: 'test'}))

    expect(getByTestId('summary')).toHaveTextContent('Open')
  })

  it('Adds default summary if no summary supplied', async () => {
    const {getByText} = render(<Details data-testid="details">content</Details>)

    expect(getByText('See Details')).toBeInTheDocument()
    expect(getByText('See Details').tagName).toBe('SUMMARY')
  })

  it('Adds summary element when supplied as prop', async () => {
    const {getByText} = render(
      <Details summary="test summary" data-testid="details">
        content
      </Details>,
    )

    expect(getByText('test summary')).toBeInTheDocument()
    expect(getByText('test summary').tagName).toBe('SUMMARY')
  })

  it('Ignores summary prop when child exists', async () => {
    const {queryByText, getByText} = render(
      <Details summary="test summary" data-testid="details">
        <Details.Summary>custom summary</Details.Summary>
        content
      </Details>,
    )

    expect(queryByText('test summary')).toBeNull()
    expect(queryByText('See Details')).toBeNull()
    expect(getByText('custom summary')).toBeInTheDocument()
    expect(getByText('custom summary').tagName).toBe('SUMMARY')
  })

  it('Does not add summary if supplied as different element', async () => {
    const {getByTestId, queryByText} = render(
      <Details data-testid="details">
        <Button as="summary" data-testid="summary">
          custom summary
        </Button>
        content
      </Details>,
    )

    expect(queryByText('See Details')).toBeNull()
    expect(getByTestId('summary')).toBeInTheDocument()
    expect(getByTestId('summary').tagName).toBe('SUMMARY')
  })

  describe('Details.Summary', () => {
    behavesAsComponent({Component: Details.Summary})

    it('should support a custom `className` on the container element', () => {
      render(<Details.Summary className="custom-class">test summary</Details.Summary>)
      expect(screen.getByText('test summary')).toHaveClass('custom-class')
    })

    it('should pass extra props onto the container element', () => {
      render(<Details.Summary data-testid="test">test summary</Details.Summary>)
      expect(screen.getByText('test summary')).toHaveAttribute('data-testid', 'test')
    })
  })
})

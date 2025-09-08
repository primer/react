import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Details, useDetails, Box, Button} from '../..'
import type {ButtonProps} from '../../Button'

describe('Details', () => {
  it('Toggles when you click outside', async () => {
    const Component = () => {
      const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
      return (
        <Details data-testid="details" {...getDetailsProps()}>
          <Details.Summary>hi</Details.Summary>
        </Details>
      )
    }

    const {findByTestId} = render(<Component />)

    document.body.click()

    expect(await findByTestId('details')).not.toHaveAttribute('open')
  })

  it('Accurately passes down open state', async () => {
    const Component = () => {
      const {getDetailsProps, open} = useDetails({closeOnOutsideClick: true})
      return (
        <Details {...getDetailsProps()} data-testid="details">
          <summary data-testid="summary">{open ? 'Open' : 'Closed'}</summary>
        </Details>
      )
    }

    const {findByTestId} = render(<Component />)

    document.body.click()

    expect(await findByTestId('summary')).toHaveTextContent('Closed')
    expect(await findByTestId('details')).not.toHaveAttribute('open')
  })

  it('Can manipulate state with setOpen', async () => {
    const user = userEvent.setup()
    const CloseButton = (props: ButtonProps) => <Button {...props} />
    const Component = () => {
      const {getDetailsProps, setOpen, open} = useDetails({closeOnOutsideClick: true, defaultOpen: true})
      return (
        <Details {...getDetailsProps()} data-testid="details">
          <summary data-testid="summary">{open ? 'Open' : 'Closed'}</summary>
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
          <summary data-testid="summary">{open ? 'Open' : 'Closed'}</summary>
          <Box>
            <Button variant="primary">test</Button>
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

  it('Does not add default summary if summary supplied', async () => {
    const {findByTestId, findByText} = render(
      <Details data-testid="details">
        <Details.Summary data-testid="summary">summary</Details.Summary>
        content
      </Details>,
    )

    await expect(findByText('See Details')).rejects.toThrow()
    expect(await findByTestId('summary')).toBeInTheDocument()
    expect((await findByTestId('summary')).tagName).toBe('SUMMARY')
  })

  it('Does not add default summary if supplied as different element', async () => {
    const {findByTestId, findByText} = render(
      <Details data-testid="details">
        <Box as="summary" data-testid="summary">
          custom summary
        </Box>
        content
      </Details>,
    )

    await expect(findByText('See Details')).rejects.toThrow()
    expect(await findByTestId('summary')).toBeInTheDocument()
    expect((await findByTestId('summary')).tagName).toBe('SUMMARY')
  })

  describe('Details.Summary', () => {
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

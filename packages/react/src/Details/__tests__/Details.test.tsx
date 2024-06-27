import {render} from '@testing-library/react'
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
          <summary>hi</summary>
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
          <Button as="summary" data-testid="summary">
            {open ? 'Open' : 'Closed'}
          </Button>
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
})

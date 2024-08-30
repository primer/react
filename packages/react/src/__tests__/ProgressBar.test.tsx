import React from 'react'
import {ProgressBar} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('ProgressBar', () => {
  behavesAsComponent({Component: ProgressBar, toRender: () => <ProgressBar aria-valuenow={10} progress={0} />})

  checkExports('ProgressBar', {
    default: undefined,
    ProgressBar,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<ProgressBar progress={80} barSize="small" aria-label="Upload test.png" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "barSize" prop', () => {
    expect(render(<ProgressBar progress={80} barSize="small" aria-label="Upload test.png" />)).toHaveStyleRule(
      'height',
      '5px',
    )
    expect(render(<ProgressBar progress={80} barSize="default" aria-label="Upload test.png" />)).toHaveStyleRule(
      'height',
      '8px',
    )
    expect(render(<ProgressBar progress={80} barSize="large" aria-label="Upload test.png" />)).toHaveStyleRule(
      'height',
      '10px',
    )
  })

  it('respects the "inline" prop', () => {
    expect(render(<ProgressBar progress={80} inline aria-label="Upload test.png" />)).toHaveStyleRule(
      'display',
      'inline-flex',
    )
  })

  it('respects the "width" prop', () => {
    expect(render(<ProgressBar progress={80} inline width="100px" aria-label="Upload test.png" />)).toHaveStyleRule(
      'width',
      '100px',
    )
  })

  it('respects the "progress" prop', () => {
    expect(render(<ProgressBar progress={80} aria-label="Upload test.png" />)).toMatchSnapshot()
  })

  it('passed the `aria-label` down to the progress bar', () => {
    const {getByRole, getByLabelText} = HTMLRender(<ProgressBar progress={80} aria-label="Upload test.png" />)
    expect(getByRole('progressbar')).toHaveAttribute('aria-label', 'Upload test.png')
    expect(getByLabelText('Upload test.png')).toBeInTheDocument()
  })

  it('passed the `aria-valuenow` down to the progress bar', () => {
    const {getByRole} = HTMLRender(<ProgressBar progress={80} aria-valuenow={80} />)
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '80')
  })

  it('passed the `aria-valuetext` down to the progress bar', () => {
    const {getByRole} = HTMLRender(<ProgressBar aria-valuetext="80 percent" />)
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuetext', '80 percent')
  })

  it('does not pass the `aria-label` down to the progress bar if there are multiple items', () => {
    const {getByRole} = HTMLRender(
      <ProgressBar aria-label="Upload test.png">
        <ProgressBar.Item progress={80} />
      </ProgressBar>,
    )
    expect(getByRole('progressbar')).not.toHaveAttribute('aria-label')
  })

  it('passes aria attributes to the progress bar item', () => {
    const {getByRole} = HTMLRender(
      <ProgressBar>
        <ProgressBar.Item progress={50} aria-label="Progress" ria-valuenow="50"></ProgressBar.Item>
      </ProgressBar>,
    )
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
    expect(getByRole('progressbar')).toHaveAttribute('aria-label', 'Progress')
  })

  it('provides `aria-valuenow` to the progress bar item if it is not already provided', () => {
    const {getByRole} = HTMLRender(<ProgressBar progress={50} />)
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('should warn users if they do not pass the correct props or ARIA attributes', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    render(<ProgressBar />)

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
})

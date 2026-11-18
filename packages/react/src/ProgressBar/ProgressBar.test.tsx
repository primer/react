import {describe, expect, it} from 'vitest'
import {ProgressBar} from '.'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {implementsClassName} from '../utils/testing'
import classes from './ProgressBar.module.css'

describe('ProgressBar', () => {
  implementsClassName(ProgressBar, classes.ProgressBarContainer)
  implementsClassName(ProgressBar.Item, classes.ProgressBarItem)

  it('renders data-component attributes for ProgressBar and ProgressBar.Item', async () => {
    render(<ProgressBar progress={50} aria-label="Upload test.png" data-testid="single-progress" />)
    const singleProgress = page.getByTestId('single-progress')
    await expect.element(singleProgress).toHaveAttribute('data-component', 'ProgressBar')
    await expect.element(singleProgress.getByRole('progressbar')).toHaveAttribute('data-component', 'ProgressBar.Item')

    render(
      <ProgressBar aria-label="Upload test.png" data-testid="multi-progress">
        <ProgressBar.Item progress={80} />
      </ProgressBar>,
    )
    const multiProgress = page.getByTestId('multi-progress')
    await expect.element(multiProgress).toHaveAttribute('data-component', 'ProgressBar')
    await expect.element(multiProgress.getByRole('progressbar')).toHaveAttribute('data-component', 'ProgressBar.Item')
  })

  it('respects the "barSize" prop', async () => {
    render(<ProgressBar progress={80} barSize="small" aria-label="Upload test.png" data-testid="small-progress" />)
    await expect.element(page.getByTestId('small-progress')).toHaveAttribute('data-progress-bar-size', 'small')

    render(<ProgressBar progress={80} barSize="default" aria-label="Upload test.png" data-testid="default-progress" />)
    await expect.element(page.getByTestId('default-progress')).toHaveAttribute('data-progress-bar-size', 'default')

    render(<ProgressBar progress={80} barSize="large" aria-label="Upload test.png" data-testid="large-progress" />)
    await expect.element(page.getByTestId('large-progress')).toHaveAttribute('data-progress-bar-size', 'large')
  })

  it('respects the "inline" prop', async () => {
    render(<ProgressBar progress={80} barSize="small" aria-label="Upload test.png" inline />)

    await expect
      .element(page.getByRole('progressbar').element().parentElement)
      .toHaveAttribute('data-progress-display', 'inline')
  })

  it('passed the `aria-label` down to the progress bar', async () => {
    render(<ProgressBar progress={80} aria-label="Upload test.png" />)
    await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-label', 'Upload test.png')
    await expect.element(page.getByLabelText('Upload test.png')).toBeInTheDocument()
  })

  it('passed the `aria-valuenow` down to the progress bar', async () => {
    render(<ProgressBar progress={80} aria-valuenow={80} />)
    await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '80')
  })

  it('passed the `aria-valuetext` down to the progress bar', async () => {
    render(<ProgressBar aria-valuetext="80 percent" />)
    await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '80 percent')
  })

  it('does not pass the `aria-label` down to the progress bar if there are multiple items', async () => {
    render(
      <ProgressBar aria-label="Upload test.png">
        <ProgressBar.Item progress={80} />
      </ProgressBar>,
    )
    await expect.element(page.getByRole('progressbar')).not.toHaveAttribute('aria-label')
  })

  it('passes aria attributes to the progress bar item', async () => {
    render(
      <ProgressBar>
        <ProgressBar.Item progress={50} aria-label="Progress" ria-valuenow="50"></ProgressBar.Item>
      </ProgressBar>,
    )
    await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
    await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-label', 'Progress')
  })

  it('provides `aria-valuenow` to the progress bar item if it is not already provided', async () => {
    render(<ProgressBar progress={50} />)
    await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('applies `0` as a value for `aria-valuenow`', async () => {
    render(<ProgressBar progress={0} aria-valuenow={0} aria-label="Upload text.png" />)

    await expect.element(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  describe('bg prop', () => {
    it('applies default success bg color when no bg prop is provided', () => {
      render(<ProgressBar progress={50} aria-label="Upload test.png" />)
      const progressBar = page.getByRole('progressbar').element()

      expect(progressBar.style.getPropertyValue('--progress-bg')).toBe('var(--bgColor-success-emphasis)')
    })

    it('applies custom bg color when bg prop is provided', () => {
      render(<ProgressBar progress={50} bg="danger.emphasis" aria-label="Upload test.png" />)
      const progressBar = page.getByRole('progressbar').element()

      expect(progressBar.style.getPropertyValue('--progress-bg')).toBe('var(--bgColor-danger-emphasis)')
    })

    it('handles different color variants correctly', () => {
      const colorVariants = [
        {input: 'danger.emphasis', expected: 'var(--bgColor-danger-emphasis)'},
        {input: 'severe.emphasis', expected: 'var(--bgColor-severe-emphasis)'},
        {input: 'sponsor.emphasis', expected: 'var(--bgColor-sponsor-emphasis)'},
        {input: 'done.emphasis', expected: 'var(--bgColor-done-emphasis)'},
        {input: 'accent.emphasis', expected: 'var(--bgColor-accent-emphasis)'},
        {input: 'success.emphasis', expected: 'var(--bgColor-success-emphasis)'},
        {input: 'neutral.emphasis', expected: 'var(--bgColor-neutral-emphasis)'},
        {input: 'attention.emphasis', expected: 'var(--bgColor-attention-emphasis)'},
      ]

      for (const {input, expected} of colorVariants) {
        const {unmount} = render(<ProgressBar progress={50} bg={input} aria-label="Upload test.png" />)
        const progressBar = page.getByRole('progressbar').element()

        expect(progressBar.style.getPropertyValue('--progress-bg')).toBe(expected)

        // Clean up after each test to avoid multiple elements
        unmount()
      }
    })

    it('applies bg color to ProgressBar.Item when used in multi-item setup', () => {
      render(
        <ProgressBar aria-label="Upload test.png">
          <ProgressBar.Item progress={30} bg="danger.emphasis" aria-label="Danger item" />
          <ProgressBar.Item progress={20} bg="success.emphasis" aria-label="Success item" />
        </ProgressBar>,
      )

      const progressBars = page.getByRole('progressbar').elements()

      expect(progressBars[0].style.getPropertyValue('--progress-bg')).toBe('var(--bgColor-danger-emphasis)')
      expect(progressBars[1].style.getPropertyValue('--progress-bg')).toBe('var(--bgColor-success-emphasis)')
    })

    it('handles bg values without emphasis gracefully', () => {
      render(<ProgressBar progress={50} bg="danger" aria-label="Upload test.png" />)
      const progressBar = page.getByRole('progressbar').element()

      expect(progressBar.style.getPropertyValue('--progress-bg')).toBe('var(--bgColor-danger-emphasis)')
    })

    it('preserves progress width regardless of bg color', () => {
      render(<ProgressBar progress={75} bg="danger.emphasis" aria-label="Upload test.png" />)
      const progressBar = page.getByRole('progressbar').element()

      expect(progressBar.style.getPropertyValue('--progress-width')).toBe('75%')
      expect(progressBar.style.getPropertyValue('--progress-bg')).toBe('var(--bgColor-danger-emphasis)')
    })
  })
})

import {describe, expect, it} from 'vitest'
import {cn} from './cn'

describe('cn', () => {
  it('merges non-colliding Primer border widths independently from colors', () => {
    expect(cn('border-thin border-danger-emphasis', 'border-0')).toBe('border-danger-emphasis border-0')
    expect(cn('border-thin border-danger-emphasis', 'border-2')).toBe('border-danger-emphasis border-2')
    expect(cn('border-thin border-danger-emphasis', 'border-accent-emphasis')).toBe(
      'border-thin border-accent-emphasis',
    )
    expect(cn('md:border-thin md:border-danger-emphasis', 'md:border-0')).toBe('md:border-danger-emphasis md:border-0')
  })

  it('preserves Primer typography and semantic color utilities together', () => {
    expect(cn('text-title-small text-default')).toBe('text-title-small text-default')
    expect(cn('text-body-medium text-muted')).toBe('text-body-medium text-muted')
  })

  it('lets later Primer typography utilities override earlier sizes', () => {
    expect(cn('text-title-small text-title-large text-default')).toBe('text-title-large text-default')
  })

  it('lets consumer classes override Primer typography and semantic colors independently', () => {
    expect(cn('text-title-small text-default', 'text-body-large text-accent')).toBe('text-body-large text-accent')
  })

  describe('package-prefixed utilities', () => {
    it('lets unprefixed consumer utilities replace prefixed package utilities in the same group', () => {
      expect(cn('primer:px-6 primer:flex', 'px-6')).toBe('primer:flex px-6')
      expect(cn('primer:px-4', 'px-6')).toBe('px-6')
      expect(cn('primer:p-4', 'px-6')).toBe('primer:p-4 px-6')
      expect(cn('primer:px-4', 'p-2')).toBe('p-2')
      expect(cn('primer:rounded-full primer:border-thin', 'rounded-none')).toBe('primer:border-thin rounded-none')
    })

    it('keeps the prefix out of variant conflict keys', () => {
      expect(cn('primer:md:px-4 primer:px-2', 'md:px-6')).toBe('primer:px-2 md:px-6')
      expect(cn('primer:hover:bg-muted', 'hover:bg-inset')).toBe('hover:bg-inset')
      expect(cn('primer:focus-visible:outline-2', 'focus-visible:outline-0')).toBe('focus-visible:outline-0')
      expect(cn('primer:group-hover/header:bg-muted', 'group-hover/header:bg-inset')).toBe(
        'group-hover/header:bg-inset',
      )
      expect(cn('primer:data-[open]:bg-muted', 'data-[open]:bg-inset')).toBe('data-[open]:bg-inset')
      expect(cn('primer:md:px-4', 'px-6')).toBe('primer:md:px-4 px-6')
      expect(cn('primer:hover:bg-muted', 'bg-inset')).toBe('primer:hover:bg-muted bg-inset')
      expect(cn('primer:px-4!', 'px-6')).toBe('primer:px-4! px-6')
    })

    it('merges prefixed package utilities with one another', () => {
      expect(cn('primer:px-4', 'primer:px-6')).toBe('primer:px-6')
      expect(cn('primer:text-title-small primer:text-default', 'primer:text-body-large')).toBe(
        'primer:text-default primer:text-body-large',
      )
      expect(cn('primer:z-modal', 'z-popover')).toBe('z-popover')
    })

    it('preserves group and peer markers and non-utility classes from both sources', () => {
      expect(cn('primer:group primer:peer/sort', 'group peer/sort')).toBe(
        'primer:group primer:peer/sort group peer/sort',
      )
      expect(cn('primer:px-4 segmentedControl-text', 'my-app-hook')).toBe(
        'primer:px-4 segmentedControl-text my-app-hook',
      )
    })

    it('treats the prefix as a namespace only in the leading position', () => {
      expect(cn('md:primer:px-4', 'md:px-6')).toBe('md:primer:px-4 md:px-6')
      expect(cn('primer:primer:px-4', 'px-6')).toBe('primer:primer:px-4 px-6')
      expect(cn('primer:px-4', 'tw:px-6')).toBe('primer:px-4 tw:px-6')
    })

    it('keeps colons inside arbitrary variants and values intact', () => {
      expect(cn('primer:[&:hover]:px-4', '[&:hover]:px-6')).toBe('[&:hover]:px-6')
      expect(cn('primer:[&_a:focus-visible]:px-4', '[&_a:focus-visible]:px-6')).toBe('[&_a:focus-visible]:px-6')
      expect(cn('primer:[&_a:focus-visible]:px-4', 'px-6')).toBe('primer:[&_a:focus-visible]:px-4 px-6')
      expect(cn('primer:supports-[display:grid]:grid', 'supports-[display:grid]:flex')).toBe(
        'supports-[display:grid]:flex',
      )
      expect(cn('primer:bg-[url(a:b)]', 'bg-[url(c:d)]')).toBe('bg-[url(c:d)]')
      expect(cn('primer:[--x:1px]', '[--x:2px]')).toBe('[--x:2px]')
      expect(cn('primer:hover:md:px-4', 'md:hover:px-6')).toBe('md:hover:px-6')
    })
  })

  it('lets later semantic or arbitrary z-index utilities override one another', () => {
    expect(cn('z-modal', 'z-popover')).toBe('z-popover')
    expect(cn('z-popover', 'z-[501]')).toBe('z-[501]')
    expect(cn('z-[501]', 'z-modal')).toBe('z-modal')
    expect(cn('md:z-popover', 'md:z-modal')).toBe('md:z-modal')
  })
})

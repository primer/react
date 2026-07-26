import {describe, expect, it} from 'vitest'
import {cn} from './cn'

describe('cn', () => {
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
})

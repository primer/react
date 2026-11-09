import {describe, expect, it} from 'vitest'
import {
  getActionItemStateAttributes,
  getActionItemStateClassName,
  getActionItemTone,
  type ActionItemStateOptions,
} from './itemState'

const itemColorProperties = [
  '--action-list-item-fgColor',
  '--action-list-item-label-fgColor',
  '--action-list-item-visual-fgColor',
  '--action-list-item-description-fgColor',
  '--action-list-item-trailing-fgColor',
]

function classes(options: ActionItemStateOptions) {
  return getActionItemStateClassName(options).split(' ')
}

describe('getActionItemTone', () => {
  it('lets the state that most limits the item win', () => {
    expect(getActionItemTone({disabled: true, inactive: true, loading: true, variant: 'danger'})).toBe('disabled')
    expect(getActionItemTone({inactive: true, loading: true, variant: 'danger'})).toBe('inactive')
    expect(getActionItemTone({loading: true, variant: 'danger'})).toBe('loading')
    expect(getActionItemTone({variant: 'danger'})).toBe('danger')
    expect(getActionItemTone({})).toBe('default')
  })
})

describe('getActionItemStateClassName', () => {
  it.each<ActionItemStateOptions>([{}, {variant: 'danger'}, {loading: true}, {inactive: true}, {disabled: true}])(
    'sets every part color for %o so nested items never inherit it',
    options => {
      const className = getActionItemStateClassName(options)
      for (const property of itemColorProperties) {
        expect(className).toMatch(new RegExp(`(^| )primer:\\[${property}:`))
      }
    },
  )

  it('fills the hovered and pressed item with the transparent control tokens', () => {
    expect(classes({})).toEqual(
      expect.arrayContaining([
        'primer:hover:bg-[var(--control-transparent-bgColor-hover)]',
        'primer:active:bg-[var(--control-transparent-bgColor-active)]',
      ]),
    )
  })

  it('uses the danger tokens for a destructive item', () => {
    const className = classes({variant: 'danger'})
    expect(className).toEqual(
      expect.arrayContaining([
        'primer:[--action-list-item-label-fgColor:var(--control-danger-fgColor-rest)]',
        'primer:hover:bg-[var(--control-danger-bgColor-hover)]',
        'primer:hover:[--action-list-item-label-fgColor:var(--control-danger-fgColor-hover)]',
        'primer:active:bg-[var(--control-danger-bgColor-active)]',
      ]),
    )
    expect(className).not.toContain('primer:hover:bg-[var(--control-transparent-bgColor-hover)]')
  })

  it('marks the current item with the selected fill and the accent line', () => {
    const className = classes({active: true})
    expect(className).toEqual(
      expect.arrayContaining([
        'primer:bg-[var(--control-transparent-bgColor-selected)]',
        'primer:after:bg-[var(--borderColor-accent-emphasis)]',
        'primer:[&_[data-item-label]]:font-semibold',
        'primer:[--action-list-item-label-fgColor:var(--control-fgColor-rest)]',
      ]),
    )
    expect(className).not.toContain('primer:[--action-list-item-label-fgColor:var(--fgColor-default)]')
  })

  it('keeps the neutral hover fill and a neutral resting label for a current destructive item', () => {
    const className = classes({active: true, variant: 'danger'})
    expect(className).toContain('primer:hover:bg-[var(--control-transparent-bgColor-hover)]')
    expect(className).not.toContain('primer:hover:bg-[var(--control-danger-bgColor-hover)]')
    expect(className).toContain('primer:[--action-list-item-label-fgColor:var(--control-fgColor-rest)]')
    expect(className).toContain('primer:hover:[--action-list-item-label-fgColor:var(--control-danger-fgColor-hover)]')
    expect(className).toContain('primer:active:bg-[var(--control-danger-bgColor-active)]')
  })

  it('mutes a loading item, even when it is current', () => {
    const className = classes({active: true, loading: true})
    expect(className).toContain('primer:[--action-list-item-label-fgColor:var(--fgColor-muted)]')
    expect(className).not.toContain('primer:[--action-list-item-label-fgColor:var(--control-fgColor-rest)]')
  })

  it('keeps an inactive item unfilled on hover and press', () => {
    const className = classes({active: true, inactive: true})
    expect(className).toEqual(
      expect.arrayContaining([
        'primer:cursor-not-allowed',
        'primer:hover:bg-transparent',
        'primer:active:bg-transparent',
      ]),
    )
    expect(className).not.toContain('primer:hover:bg-[var(--control-transparent-bgColor-hover)]')
  })

  it('drops the current, hover, and highlight treatments of a disabled item', () => {
    const className = getActionItemStateClassName({active: true, disabled: true, highlightable: true})
    expect(className).toContain('primer:cursor-not-allowed')
    expect(className).toContain('primer:[--action-list-item-label-fgColor:var(--control-fgColor-disabled)]')
    expect(className).not.toMatch(/bgColor-selected|bgColor-hover|accent-emphasis|data-highlighted/)
  })

  it('follows virtual focus through data-highlighted without bolding the label', () => {
    const className = classes({highlightable: true})
    expect(className).toEqual(
      expect.arrayContaining([
        'primer:[&:where([data-highlighted])]:bg-[var(--control-transparent-bgColor-selected)]',
        'primer:[&:where([data-highlighted])]:after:bg-[var(--borderColor-accent-emphasis)]',
      ]),
    )
    expect(className).not.toContain('primer:[&_[data-item-label]]:font-semibold')
  })

  it('keeps the label and description at full contrast while a trailing action loads', () => {
    const className = classes({active: true, trailingActionLoading: true})
    expect(className).toEqual(
      expect.arrayContaining([
        'primer:[--action-list-item-label-fgColor:var(--fgColor-default)]',
        'primer:[--action-list-item-description-fgColor:var(--fgColor-default)]',
      ]),
    )
    expect(className).not.toContain('primer:[--action-list-item-label-fgColor:var(--control-fgColor-rest)]')
    expect(getActionItemStateClassName({disabled: true, trailingActionLoading: true})).not.toContain(
      'primer:[--action-list-item-label-fgColor:var(--fgColor-default)]',
    )
  })
})

describe('getActionItemStateAttributes', () => {
  it('exposes the same state attributes as upstream list items', () => {
    expect(getActionItemStateAttributes({active: true, variant: 'danger'})).toEqual({
      'data-active': true,
      'data-inactive': undefined,
      'data-is-disabled': undefined,
      'data-loading': undefined,
      'data-variant': 'danger',
    })
  })

  it('does not mark a disabled item as current or an inactive item as loading', () => {
    expect(getActionItemStateAttributes({active: true, disabled: true})).toMatchObject({
      'data-active': undefined,
      'data-is-disabled': true,
    })
    expect(getActionItemStateAttributes({inactive: true, loading: true})).toMatchObject({
      'data-inactive': true,
      'data-loading': undefined,
    })
  })
})

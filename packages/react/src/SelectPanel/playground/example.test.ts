import {parse} from '@babel/parser'
import {describe, expect, it} from 'vitest'
import {getExample} from './example'
import {defaultConfig, isPlaygroundConfig, presets} from './model'

describe('playground examples', () => {
  it.each(presets)('generates valid TSX for $name at every style stop and a blend', preset => {
    for (const appearance of [0, 1, 1.5, 2, 3, 4, 5]) {
      const source = getExample({...preset.config, appearance})
      expect(() => parse(source, {sourceType: 'module', plugins: ['typescript', 'jsx']})).not.toThrow()
      expect(source).not.toContain('@base-ui')
      expect(source).toContain('SelectPanel.Root')
      expect(source).toContain('./SelectPanelDemo.module.css')
    }
  })

  it('removes omitted parts rather than hiding them', () => {
    const source = getExample({...defaultConfig, search: false, presentation: 'inline'})
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).not.toContain('<SelectPanel.SearchInput')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).not.toContain('<SelectPanel.Trigger')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).not.toContain('<SelectPanel.Overlay')
  })

  it('uses native Primer styles in the exported Primer example', () => {
    const source = getExample(defaultConfig)
    expect(source).not.toContain('styles.Theme')
    expect(source).not.toContain('--playground-')
    expect(source).not.toContain('leadingVisual={null}')
    expect(source).toContain('width="medium"')
  })

  it('exports grouped small footer actions and an explicitly small selection count', () => {
    const source = getExample({...defaultConfig, commitMode: 'submit'})
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).toContain('<Text size="small" className={styles.SelectionCount}>')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).toContain('<div className={styles.FooterActions}>')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).toContain('<SelectPanel.CancelButton className={styles.Action} size="small">')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).toContain('<SelectPanel.SubmitButton className={styles.Action} size="small" variant="primary">')
  })

  it('exports item secondary actions that open a standard Primer Dialog', () => {
    const source = getExample({...defaultConfig, actions: true})
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).toContain('<SelectPanel.List')
    expect(source).toContain('secondaryActions={repo.id === repositories[0].id ? [{')
    expect(source).toContain('icon: InfoIcon')
    expect(source).toContain('onClick: () => setDetailsOpen(true)')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).toContain('<RepositoryDetails repo={repo} itemRef={itemRef}')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).toContain('<Dialog')
    expect(source).toContain('returnFocusRef={itemRef}')
    expect(source).toContain('initialFocusRef={backRef}')
    expect(source).toContain('useOnOutsideClick({')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).not.toContain('<SelectPanel.Root open={detailsOpen}')
    // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
    expect(source).not.toContain('<SelectPanel.Overlay anchorRef={itemRef}')
    expect(source).toContain('ref={itemRef}')
    expect(source).not.toMatch(/SelectPanel\.(Grid|Row|SelectionCell|ActionCell)/)
    expect(source).not.toContain('IconButton')
    expect(source.match(/<SelectPanel.Trigger/g)).toHaveLength(1)
  })

  it.each([false, true])(
    'keeps grouping and descriptions, with trailing metadata only without actions, actions=%s',
    actions => {
      const source = getExample({...defaultConfig, actions, grouped: true, descriptions: true})
      // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
      expect(source).toContain('<SelectPanel.Group')
      // eslint-disable-next-line github/unescaped-html-literal -- Matches generated TSX text.
      expect(source).toContain('<ActionList.Description variant="block">{repo.description}</ActionList.Description>')
      expect(source.includes('ActionList.TrailingVisual')).toBe(!actions)
    },
  )

  it.each([0, 1, 2, 3, 4, 5])('exports a medium picker with and without actions at appearance %s', appearance => {
    for (const actions of [false, true]) {
      const source = getExample({...defaultConfig, appearance, actions})
      expect(source).toContain('width="medium"')
    }
  })

  it.each([0, 1, 2, 3, 4, 5])('scopes the App skin class to its exact appearance at %s', appearance => {
    const source = getExample({...defaultConfig, appearance, actions: true})
    expect(source.includes('[styles.Theme, styles.Overlay, styles.GitHubApp]')).toBe(appearance === 2)
    expect(source.includes('[styles.Theme, styles.Stage, styles.GitHubApp]')).toBe(appearance === 2)
    expect(source.match(/styles\.GitHubApp/g) ?? []).toHaveLength(appearance === 2 ? 2 : 0)
  })

  it.each([
    [4, 'Paper'],
    [5, 'Terminal'],
  ] as const)('exports the appearance %s skin for the stage and picker overlay', (appearance, className) => {
    const source = getExample({...defaultConfig, appearance, actions: true})
    expect(source).toContain(`[styles.Theme, styles.Stage, styles.${className}]`)
    expect(source).toContain(`[styles.Theme, styles.Overlay, styles.${className}]`)
    expect(source).toContain('overlayProps={overlayProps}')
    expect(source.match(new RegExp(`styles\\.${className}`, 'g'))).toHaveLength(2)
    expect(getExample({...defaultConfig, appearance: appearance - 0.25})).not.toContain(`styles.${className}`)
  })

  it.each(['ready', 'loading', 'empty', 'error'] as const)('generates a valid %s state', previewState => {
    expect(() =>
      parse(getExample({...defaultConfig, previewState}), {sourceType: 'module', plugins: ['typescript', 'jsx']}),
    ).not.toThrow()
  })

  it('validates only finite, supported preview configurations', () => {
    expect(isPlaygroundConfig(defaultConfig)).toBe(true)
    expect(isPlaygroundConfig({...defaultConfig, appearance: 1.25})).toBe(true)
    expect(isPlaygroundConfig({...defaultConfig, appearance: 5})).toBe(true)
    for (const appearance of [-1, 5.001, 6, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(isPlaygroundConfig({...defaultConfig, appearance})).toBe(false)
    }
    expect(isPlaygroundConfig({...defaultConfig, presentation: 'popover'})).toBe(false)
    expect(isPlaygroundConfig({...defaultConfig, search: 'true'})).toBe(false)
    expect(isPlaygroundConfig(null)).toBe(false)
  })
})

import {describe, expect, it} from 'vitest'

describe('selection exports', () => {
  it('exports the complete selection component family without internal helpers', async () => {
    const selection = await import('./selection')
    expect(selection).toMatchObject({
      ActionList: expect.anything(),
      ActionMenu: expect.anything(),
      Autocomplete: expect.anything(),
      FilteredActionList: expect.anything(),
      SelectPanel: expect.anything(),
    })
    expect(selection).not.toHaveProperty('getSelectionRole')
    expect(selection).not.toHaveProperty('getSelectionAttribute')
  })
})

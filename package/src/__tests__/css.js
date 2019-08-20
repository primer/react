import * as css from '../css'

describe('@primer/components/css', () => {
  it('has utilities', () => {
    expect(typeof css.utilities).toBe('string')
  })
  it('has markdown', () => {
    expect(typeof css.markdown).toBe('string')
  })
})

/* eslint-disable import/no-namespace */
import * as Index from '..'
import * as Drafts from '../drafts'
import * as Deprecated from '../deprecated'

describe('@primer/react', () => {
  it('should not update exports without a semver change', () => {
    expect(Object.keys(Index).sort()).toMatchSnapshot()
  })
})

describe('@primer/react/drafts', () => {
  it('should not update exports without a semver change', () => {
    expect(Object.keys(Drafts).sort()).toMatchSnapshot()
  })
})

describe('@primer/react/decprecated', () => {
  it('should not update exports without a semver change', () => {
    expect(Object.keys(Deprecated).sort()).toMatchSnapshot()
  })
})

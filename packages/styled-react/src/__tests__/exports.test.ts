import {test, expect} from 'vitest'
// eslint-disable-next-line import/no-namespace
import * as StyledReact from '../'
// eslint-disable-next-line import/no-namespace
import * as StyledReactDeprecated from '../deprecated'
// eslint-disable-next-line import/no-namespace
import * as StyledReactExperimental from '../experimental'

test('@primer/styled-react exports', () => {
  expect(Object.keys(StyledReact)).toMatchSnapshot()
})

test('@primer/styled-react/deprecated exports', () => {
  expect(Object.keys(StyledReactDeprecated)).toMatchSnapshot()
})

test('@primer/styled-react/experimental exports', () => {
  expect(Object.keys(StyledReactExperimental)).toMatchSnapshot()
})

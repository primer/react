import {test, expect} from 'vitest'
import * as StyledReact from '../'
import * as StyledReactDeprecated from '../deprecated'
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

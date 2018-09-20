import React from 'react'
import {X} from '@githubprimer/octicons-react'
import theme, {colors} from '../theme'
import * as Components from '../index.js'
import {renderStyles} from '../utils/testing'

const testProps = {
  OcticonButton: {icon: X, label: 'button'},
  Donut: {data: {pending: 1}},
  MergeStatus: {state: 'ready'}
}

describe('UtilitySystemProps', () => {
  for (const Component of Object.values(Components)) {
    // Skip any components that don't have displayName yet
    if (!Component.displayName || !Component.systemProps) {
      continue
    }
    let extraProps
    if (testProps[Component.displayName]) {
      extraProps = testProps[Component.displayName]
    }

    if (Component.systemProps.includes('space')) {
      it(`${Component.displayName} renders spacing props properly`, () => {
        for (const i in theme.space) {
          expect(
            renderStyles(
              <Component
                m={i}
                mt={i}
                mr={i}
                mb={i}
                ml={i}
                mx={i}
                my={i}
                p={i}
                pt={i}
                pr={i}
                pb={i}
                pl={i}
                px={i}
                py={i}
                {...extraProps}
              />
            )
          ).toMatchKeys({
            margin: `${theme.space[i]}px`,
            'margin-bottom': `${theme.space[i]}px`,
            'margin-left': `${theme.space[i]}px`,
            'margin-right': `${theme.space[i]}px`,
            'margin-top': `${theme.space[i]}px`,
            padding: `${theme.space[i]}px`,
            'padding-bottom': `${theme.space[i]}px`,
            'padding-left': `${theme.space[i]}px`,
            'padding-right': `${theme.space[i]}px`,
            'padding-top': `${theme.space[i]}px`
          })
        }
      })
    }

    if (Component.systemProps.includes('color')) {
      it(`${Component.displayName} renders color props properly`, () => {
        for (const color of Object.keys(colors)) {
          if (typeof colors[color] === 'object' && color !== 'state') {
            for (const i in colors[color]) {
              expect(
                renderStyles(<Component bg={`${color}.${i}`} color={`${color}.${i}`} {...extraProps} />)
              ).toMatchKeys({
                'background-color': colors[color][i],
                color: colors[color][i]
              })
            }
          }
        }
      })
    }
  }
})

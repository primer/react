import React from 'react'
import theme from '../theme'
import * as Components from '../index.js'
import {renderStyles} from '../utils/testing'

// TODO: These components need required props,
// Not sure how to set default props for required ones
const blacklist = ['OcticonButton', 'DonutChart', 'MergeStatus']

describe('UtilitySystemProps', () => {
  for (const Component of Object.values(Components)) {
    // Skip any components that don't have displayName yet
    if (!Component.displayName || !Component.systemProps || blacklist.includes(Component.displayName)) {
      continue
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
        for (const color of Object.keys(theme.colors)) {
          if (typeof theme.colors[color] === 'object' && color != 'state') {
            for (const i in theme.colors[color]) {
              expect(renderStyles(<Component bg={`${color}.${i}`} color={`${color}.${i}`} />)).toMatchKeys({
                'background-color': theme.colors[color][i],
                color: theme.colors[color][i]
              })
            }
          }
        }
      })
    }
  }
})

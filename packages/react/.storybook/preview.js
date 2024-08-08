import {PrimerBreakpoints} from '../src/utils/layout'
import React, {useEffect} from 'react'
import {ThemeProvider, BaseStyles, theme} from '../src'
import {FeatureFlags} from '../src/FeatureFlags'
import {DefaultFeatureFlags} from '../src/FeatureFlags/DefaultFeatureFlags'
import clsx from 'clsx'

import './storybook.css'
import './primitives-v8.css'
import {Profiler} from 'react'

let storybookViewports = {}
Object.entries(PrimerBreakpoints).forEach(([viewport, value]) => {
  const {width} = value
  storybookViewports[viewport] = {
    name: viewport,
    styles: {
      width,
      height: '100%',
    },
  }
})

const preview = {
  parameters: {
    html: {
      root: '#html-addon-root',
      removeEmptyComments: true,
    },
    controls: {
      hideNoControlsWarning: true,
    },
    options: {
      storySort: (a, b) => {
        const defaultOrder = [
          [
            // Match on any story that leads with "Components"
            'Components',
            // This is the ordering of stories under "Components", by default
            // we'll sort alphabetically
            [
              [
                '*',
                // Within a set of stories, set the order to the following
                ['*', 'Playground', /Playground$/, 'Features', 'Examples'],
              ],
            ],
          ],
          'Behaviors',
          'Hooks',
          'Deprecated',
          'Drafts',
          'Private',
          '*',
        ]

        /**
         * Get the position of an item within a given order. This will return the
         * index if the item is defined in the given array, or the wildcard index
         * if it is not explicitlyd efined
         */
        function getPosition(order, item) {
          const position = order.findIndex(value => {
            if (Array.isArray(value)) {
              if (typeof value[0] === 'string') {
                return value[0] === item
              }
              return value[0].exec(item)
            }

            if (typeof value === 'string') {
              return value === item
            }

            return value.exec(item)
          })

          if (position === -1) {
            return order.indexOf('*')
          }

          return position
        }

        /**
         * Compare two separate stories at the given level for the given order.
         * The order will be relative at each level and is resolved based on the
         * current order and values of the stories
         */
        function compare(a, b, level = 0, order = defaultOrder) {
          const valueA = a[level]
          const valueB = b[level]

          // If the stories match at the same point in the hierarchy, we'll want
          // to compare them using a relative ordering for the scheme
          if (valueA === valueB) {
            // Find the "nested order" for the hierarchy, if one exists. This
            // will correspond with the ordering of the stories within this
            // hierarchy
            const nestedOrder = order.find(value => {
              if (Array.isArray(value)) {
                return value[0] === valueA
              }
              return value === valueA
            })

            if (nestedOrder && Array.isArray(nestedOrder)) {
              return compare(a, b, level + 1, nestedOrder[1])
            }

            // If there is no nested order that we can find, look for wildcard
            // patterns
            const wildcard = order.find(value => {
              if (Array.isArray(value)) {
                return value[0] === '*'
              }
              return value === '*'
            })

            // If we have a wildcard pattern with sub-patterns to include for
            // ordering, pass them along
            if (wildcard && Array.isArray(wildcard)) {
              return compare(a, b, level + 1, wildcard[1])
            }

            // Otherwise, everything is a wildcard pattern and should be sorted
            // alphabetically at this level
            return compare(a, b, level + 1, ['*'])
          }

          // If the stories do not currently match in the same hierarchy, get the
          // position of each and compare them.
          const positionA = getPosition(order, valueA)
          const positionB = getPosition(order, valueB)

          // If the positions are the same, sort them alphabetically
          if (positionA === positionB) {
            return valueA.localeCompare(valueB)
          }

          // Otherwise, compare by position in the given order
          return positionA - positionB
        }

        function getHierarchy(story) {
          const hierarchy = story.title.split('/')
          hierarchy.push(story.name)
          return hierarchy
        }

        return compare(getHierarchy(a), getHierarchy(b))
      },
    },
    viewport: {
      viewports: {
        ...storybookViewports,
      },
    },
  },
}

const primerThemes = [
  {value: 'light', left: '☀️', title: 'Light'},
  {value: 'light_colorblind', left: '☀️', title: 'Light Protanopia & Deuteranopia'},
  {value: 'light_tritanopia', left: '☀️', title: 'Light Tritanopia'},
  {value: 'light_high_contrast', left: '☀️', title: 'Light High Contrast'},
  {value: 'dark', left: '🌗', title: 'Dark'},
  {value: 'dark_dimmed', left: '🌗', title: 'Dark Dimmed'},
  {value: 'dark_colorblind', left: '🌗', title: 'Dark Protanopia & Deuteranopia'},
  {value: 'dark_tritanopia', left: '🌗', title: 'Dark Tritanopia'},
  {value: 'dark_high_contrast', left: '🌗', title: 'Dark High Contrast'},
]

export const globalTypes = {
  colorScheme: {
    name: 'Theme',
    description: 'Switch themes',
    defaultValue: 'light',
    toolbar: {
      icon: 'contrast',
      items: [...primerThemes, {value: 'all', left: '', title: 'All'}],
      showName: true,
      dynamicTitle: true,
    },
    showSurroundingElements: {},
  },
  featureFlags: {
    name: 'Feature flags',
    description: 'Toggle feature flags',
    defaultValue: Object.fromEntries(DefaultFeatureFlags.flags),
  },
}

export const decorators = [
  (Story, context) => {
    const {featureFlags} = context.globals
    return (
      <FeatureFlags flags={featureFlags}>
        <Story {...context} />
      </FeatureFlags>
    )
  },
  (Story, context) => {
    const {colorScheme} = context.globals

    useEffect(() => {
      const colorMode = colorScheme.startsWith('light') ? 'light' : 'dark'
      document.body.setAttribute('data-color-mode', colorMode)

      const lightTheme = colorScheme.startsWith('light') ? colorScheme : undefined
      document.body.setAttribute('data-light-theme', lightTheme)

      const darkTheme = colorScheme.startsWith('dark') ? colorScheme : undefined
      document.body.setAttribute('data-dark-theme', darkTheme)
    }, [colorScheme])

    const showSurroundingElements =
      context.globals.showSurroundingElements ?? window.localStorage.getItem('showSurroundingElements') === 'true'
    return context.globals.colorScheme === 'all' ? (
      primerThemes.map(({value: theme}) => (
        <ThemeProvider key={theme} dayScheme={theme} nightScheme={theme} colorMode="day">
          <div
            id="story"
            className={clsx(context.globals.colorScheme === 'all' && 'story-wrap-grid', 'story-wrap')}
            data-color-mode={theme.startsWith('dark') ? 'dark' : 'light'}
            data-light-theme={theme.startsWith('light') ? theme : undefined}
            data-dark-theme={theme.startsWith('dark') ? theme : undefined}
          >
            <BaseStyles>
              <Story {...context} />
              {context.globals.colorScheme === 'all' && <p className="theme-name">{theme}</p>}
            </BaseStyles>
          </div>
        </ThemeProvider>
      ))
    ) : (
      <Profiler id="storybook-preview">
        <ThemeProvider
          dayScheme={context.globals.colorScheme}
          nightScheme={context.globals.colorScheme}
          colorMode="day"
        >
          <div className={clsx('story-wrap')}>
            <BaseStyles>
              {showSurroundingElements ? <a href="https://github.com/primer/react">Primer documentation</a> : ''}
              <FeatureFlags flags={{primer_react_action_list_item_as_button: true}}>
                <Story {...context} />
              </FeatureFlags>
              {showSurroundingElements ? <a href="https://github.com/primer/react">Primer documentation</a> : ''}
            </BaseStyles>
          </div>
        </ThemeProvider>
      </Profiler>
    )
  },
]

export default preview

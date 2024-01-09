import {addons} from '@storybook/addons'
import {withThemeProvider, withSurroundingElements, toolbarTypes} from '../src/utils/story-helpers'
import {PrimerBreakpoints} from '../src/utils/layout'

// primitives v8
import './primitives-v8.css'
// primitives v7 for fallback, commented out by default
// uncomment it for testing
// import './primitives-v7.css'

export const globalTypes = toolbarTypes
export const decorators = [withThemeProvider, withSurroundingElements]

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

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
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
}

const postcss = require('postcss')
const defaultTheme = require('../src/theme')

function mapify(list) {
  return list.reduce((map, val, i) => ((map[i] = val), map), {})
}

const px = d => `${d}px`

module.exports = postcss.plugin('primer-generate', opts => {
  const {theme = defaultTheme} = opts || {}

  const breakpointNames = ['sm', 'md', 'lg', 'xl']
  const {breakpoints, colors, space} = theme
  const {border, bg, ...namedColors} = colors

  const spacers = mapify(space.map(px))
  const fontSizes = mapify(theme.fontSizes.map(px))

  const responsiveProps = {
    f: {property: 'font-size', values: fontSizes},
    m: {property: 'margin', values: spacers},
    p: {property: 'padding', values: spacers}
  }

  return root => {
    for (const [color, values] of Object.entries(namedColors)) {
      if (Array.isArray(values)) {
        generateUtility(`.color-${color}`, 'color', values[5])
      }
    }

    generateUtilities(namedColors, (...parts) => `.color-${parts.join('-')}`, 'color')
    generateUtilities(border, (...parts) => `.border-${parts.join('-')}`, 'border-color')
    generateUtilities(bg, (...parts) => `.bg-${parts.join('-')}`, 'background-color')

    const breakRules = breakpointNames.reduce((map, name, i) => {
      map[name] = postcss.atRule({name: 'media', params: `(min-width: ${breakpoints[i]})`})
      return map
    }, {})

    for (const [prefix, {property, values}] of Object.entries(responsiveProps)) {
      generateUtilities(values, i => `.${prefix}-${i}`, property)
      for (const [at, rule] of Object.entries(breakRules)) {
        generateUtilities(values, i => `.${prefix}-${at}-${i}`, property, rule)
      }
    }

    for (const name of Object.keys(breakRules)) {
      root.append(breakRules[name])
    }

    function generateUtility(selector, prop, value) {
      const rule = postcss.rule({selector})
      rule.append(postcss.decl({prop, value, important: true}))
      return rule
    }

    function generateUtilities(values, makeSelector, property, parent = root) {
      const rules = []
      for (const [key, value] of Object.entries(values)) {
        if (Array.isArray(value)) {
          for (const [i, val] of Object.entries(value)) {
            rules.push(generateUtility(makeSelector(key, i), property, val))
          }
        } else if (typeof value === 'object') {
          rules.push(...generateUtilities(value, k => makeSelector(key, k)))
        } else {
          rules.push(generateUtility(makeSelector(key), property, value))
        }
      }
      for (const rule of rules) {
        parent.append(rule)
      }
      return rules
    }
  }
})

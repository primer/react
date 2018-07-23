const postcss = require('postcss')
const defaultTheme = require('../src/theme')

module.exports = postcss.plugin('primer-generate', opts => {
  const {theme = defaultTheme} = opts || {}

  const breakpointNames = ['sm', 'md', 'lg', 'xl']
  const {breakpoints, colors, space} = theme
  const {border, bg, ...namedColors} = colors
  const spacers = space.reduce((map, len, i) => ((map[i] = `${len}px`), map), {})

  const shorthandProps = {m: 'margin', p: 'padding'}

  return root => {
    for (const [color, values] of Object.entries(namedColors)) {
      if (Array.isArray(values)) {
        generateUtility(`.color-${color}`, 'color', values[5])
      }
    }

    generateUtilities(namedColors, parts => `.color-${parts.join('-')}`, 'color')
    generateUtilities(border, parts => `.border-${parts.join('-')}`, 'border-color')
    generateUtilities(bg, parts => `.bg-${parts.join('-')}`, 'background-color')

    const breakRules = breakpointNames.reduce((map, name, i) => {
      map[name] = postcss.atRule({name: 'media', params: `(min-width: ${breakpoints[i]})`})
      return map
    }, {})

    for (const [prefix, property] of Object.entries(shorthandProps)) {
      generateUtilities(spacers, ([i]) => `.${prefix}-${i}`, property)
      for (const [name, rule] of Object.entries(breakRules)) {
        generateUtilities(spacers, ([i]) => `.${prefix}-${name}-${i}`, property, rule)
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
            rules.push(generateUtility(makeSelector([key, i]), property, val))
          }
        } else if (typeof value === 'object') {
          rules.push(...generateUtilities(value, k => makeSelector([key, k])))
        } else {
          rules.push(generateUtility(makeSelector([key]), property, value))
        }
      }
      for (const rule of rules) {
        parent.append(rule)
      }
    }
  }
})

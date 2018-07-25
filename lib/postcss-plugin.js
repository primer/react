const postcss = require('postcss')
const defaultTheme = require('../src/theme')

const px = d => `${d}px`

const directions = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left'
}

const edges = {
  t: ['top-left', 'top-right'],
  r: ['top-right', 'bottom-right'],
  b: ['bottom-left', 'bottom-right'],
  l: ['top-left', 'bottom-left']
}

const verticalHorizontal = {
  x: ['right', 'left'],
  y: ['top', 'bottom']
}

module.exports = postcss.plugin('primer-generate', opts => {
  const {theme = defaultTheme} = opts || {}

  const {breakpoints, fontSizes, radii, space} = theme
  const {border, bg, ...namedColors} = theme.colors
  const spacers = space.map(px)
  const breaks = ['sm', 'md', 'lg', 'xl']

  const colors = entries(namedColors).reduce((map, [name, values]) => {
    if (Array.isArray(values)) {
      for (const [i, value] of entries(values)) {
        map[`${name}-${i}`] = value
      }
    } else {
      map[name] = values
    }
    return map
  }, {})

  const props = [
    {select: '.bg-{key}', property: 'background-color', values: bg},
    {select: '.border-{key}', property: 'border-color', values: border},
    {select: '.color-{key}', property: 'color', values: colors},
    {select: '.f{brk}-{key}', property: 'font-size', values: fontSizes.map(px), breaks},
    {select: '.m{dir}{brk}-{key}', property: 'margin', values: spacers, breaks, directions},
    {select: '.p{dir}{brk}-{key}', property: 'padding', values: spacers, breaks, directions},
    {select: '.m{dir}{brk}-{key}', property: 'margin', values: spacers, breaks, edges: verticalHorizontal},
    {select: '.p{dir}{brk}-{key}', property: 'padding', values: spacers, breaks, edges: verticalHorizontal},
    {select: '.r{brk}-{key}', property: 'border-radius', values: radii.map(px), breaks},
    {select: '.r{dir}{brk}-{key}', property: 'border-{dir}-radius', values: radii.map(px), breaks, edges}
  ]

  return root => {
    root.append(makeRule('*', {prop: 'box-sizing', value: 'border-box'}))
    root.append(
      makeRule(
        'body',
        {
          prop: 'font-family',
          value: theme.fonts.map(font => font.includes(' ') ? `"${font}"` : font).join(', ')
        },
        {
          prop: 'line-height',
          value: String(theme.lineHeight)
        }
      )
    )

    const atMedia = breaks.reduce((map, name, i) => {
      map[name] = postcss.atRule({name: 'media', params: `(min-width: ${breakpoints[i]})`})
      return map
    }, {})

    for (const {select, property, values, breaks, directions, edges} of props) {
      let variants = []
      for (const [key, value] of entries(values)) {
        variants.push({prop: property, key, value})
      }
      if (directions) {
        variants = cross(variants, Object.keys(directions), ({prop, ...d}, direction) => {
          return merge(d, {prop: `${prop}-${directions[direction]}`, direction})
        })
      } else if (edges) {
        variants = cross(variants, Object.keys(edges), ({prop, ...d}, edge) => {
          const dirs = edges[edge]
          const props = prop.includes('{dir}')
            ? dirs.map(dir => expand(prop, {dir}))
            : dirs.map(dir => `${prop}-${dir}`)
          return merge(d, {prop: props, direction: edge})
        })
      }
      if (breaks) {
        variants = cross(variants, [null, ...breaks], (d, breakpoint) => merge(d, {breakpoint}))
      }
      for (const {prop, key, value, direction, breakpoint} of variants) {
        const selector = expand(select, {
          key,
          value,
          dir: direction,
          brk: breakpoint && `-${breakpoint}`
        })
        const rule = postcss.rule({selector})
        if (Array.isArray(prop)) {
          const decls = prop.map(p => postcss.decl({prop: p, value, important: true}))
          for (const decl of decls) {
            rule.append(decl)
          }
        } else {
          const decl = postcss.decl({prop, value, important: true})
          rule.append(decl)
        }
        const parent = breakpoint ? atMedia[breakpoint] : root
        parent.append(rule)
      }
    }

    for (const name of Object.keys(atMedia)) {
      root.append(atMedia[name])
    }
  }
})

function makeRule(selector, ...decls) {
  const rule = postcss.rule({selector})
  for (const decl of decls) {
    rule.append(postcss.decl(decl))
  }
  return rule
}

function entries(d) {
  if (Array.isArray(d)) {
    return d.map((v, i) => [i, v])
  } else if (d && typeof d === 'object') {
    return [...Object.entries(d)]
  } else {
    return [[d, d]]
  }
}

function cross(a, b, join) {
  return a.reduce((res, A) => res.concat(b.map(B => join(A, B))), [])
}

function merge(...args) {
  return Object.assign({}, ...args)
}

function expand(template, values) {
  return template.replace(/{(\w+)}/g, (_, key) => defined(values[key], ''))
}

function defined(value, fallback) {
  return value === null || typeof value === 'undefined' ? fallback : value
}

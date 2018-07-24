function getProps(node) {
  return typeof node.props === 'function' ? node.props() : node.props
}

function getClasses(node) {
  const {className = ''} = getProps(node)
  return className.trim().split(/ +/)
}

expect.extend({
  toRenderClass(node, klass) {
    const classes = getClasses(node)
    const pass = classes.includes(klass)
    return {
      pass,
      message: () => `expected "${classes.join(' ')}" to include: "${klass}"`
    }
  },

  toRenderClasses(node, klasses) {
    const classes = getClasses(node)
    const pass = klasses.every(klass => classes.includes(klass))
    return {
      pass,
      message: () => `expected "${classes.join(' ')}" to include: ["${klasses.join('", "')}"]`
    }
  },

  toRenderStyle(node, expected) {
    const {style} = getProps(node)
    return {
      pass: this.equals(style, expected),
      message: () => `expected ${JSON.stringify(style)} to equal ${JSON.stringify(expected)}`
    }
  }
})

module.exports = function replaceExpressions({template, types: t}, options = {}) {
  const replace = options.replace ?? {}
  const allowConflictingReplacements = options.allowConflictingReplacements === true
  const candidatesByType = new Map()

  for (const [key, value] of Object.entries(replace)) {
    const keyNode = template.expression.ast(key)
    const valueNode = template.expression.ast(value)
    const candidates = candidatesByType.get(keyNode.type) ?? []

    for (let i = 0; i < candidates.length; i++) {
      if (!t.isNodesEquivalent(candidates[i].key, keyNode)) {
        continue
      }

      if (!allowConflictingReplacements) {
        throw new Error(`Expressions ${JSON.stringify(candidates[i].originalKey)} and ${JSON.stringify(key)} conflict`)
      }

      candidates.splice(i, 1)
      break
    }

    candidates.push({key: keyNode, originalKey: key, value: valueNode})
    candidatesByType.set(keyNode.type, candidates)
  }

  return {
    name: 'replace-expressions',
    visitor: {
      Expression(path) {
        const candidates = candidatesByType.get(path.node.type)

        if (!candidates) {
          return
        }

        for (const {key, value} of candidates) {
          if (!t.isNodesEquivalent(key, path.node)) {
            continue
          }

          const replacement = t.cloneNode(value)

          try {
            t.validate(path.parent, path.key, replacement)
          } catch (error) {
            if (!(error instanceof TypeError)) {
              throw error
            }

            path.skip()
            return
          }

          path.replaceWith(replacement)
          return
        }
      },
    },
  }
}

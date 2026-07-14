module.exports = function devExpression({types: t}) {
  const seen = new WeakSet()

  function makeDevExpression() {
    return t.binaryExpression(
      '!==',
      t.memberExpression(t.memberExpression(t.identifier('process'), t.identifier('env')), t.identifier('NODE_ENV')),
      t.stringLiteral('production'),
    )
  }

  return {
    name: 'dev-expression',
    visitor: {
      Identifier(path) {
        if (process.env.NODE_ENV === 'test') {
          return
        }

        if (path.isIdentifier({name: '__DEV__'}) && path.scope.hasGlobal('__DEV__')) {
          path.replaceWith(makeDevExpression())
        }
      },
      CallExpression: {
        exit(path) {
          if (process.env.NODE_ENV === 'test' || seen.has(path.node)) {
            return
          }

          const callee = path.get('callee')

          if (callee.isIdentifier({name: 'invariant'})) {
            const [condition, ...args] = path.node.arguments
            const devInvariant = t.callExpression(t.cloneNode(path.node.callee), [t.booleanLiteral(false), ...args])
            const prodInvariant = t.callExpression(t.cloneNode(path.node.callee), [t.booleanLiteral(false)])

            seen.add(devInvariant)
            seen.add(prodInvariant)

            path.replaceWith(
              t.ifStatement(
                t.unaryExpression('!', condition),
                t.blockStatement([
                  t.ifStatement(
                    makeDevExpression(),
                    t.blockStatement([t.expressionStatement(devInvariant)]),
                    t.blockStatement([t.expressionStatement(prodInvariant)]),
                  ),
                ]),
              ),
            )
          } else if (callee.isIdentifier({name: 'warning'})) {
            seen.add(path.node)

            path.replaceWith(t.ifStatement(makeDevExpression(), t.blockStatement([t.expressionStatement(path.node)])))
          }
        },
      },
    },
  }
}

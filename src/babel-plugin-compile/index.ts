import * as fs from 'fs-extra'
import * as path from 'path'
import * as babel from '@babel/core'
import {PluginObj} from '@babel/core'
import hash from '@emotion/hash'

// @ts-ignore, there are no types for this library
import {string as stylesToString} from 'to-style'

let CLASS_COUNT = 0

export default function ({types}: typeof babel): PluginObj {
  const visitor: PluginObj['visitor'] = {
    Program: {
      enter(nodePath, state) {
        // @ts-ignore not typed, dist is relative to root
        const dist = path.join(state.cwd, state.opts.dist || '')

        const relativeFilePath = path.relative(state.cwd, state.file.opts.filename!)
        const outFilePath = path.join(dist, relativeFilePath.replace('src/', 'css/').replace('.tsx', '.css'))

        state.set('outFilePath', outFilePath)
        state.set('debug', state.file.opts.filename?.includes('src/ActionList/Item'))
      },
      exit(nodePath, state) {
        if (!state.get('cssInjected')) return
        const moduleSpecifier = state.get('outFilePath')
        const importDeclaration = types.importDeclaration([], types.stringLiteral(moduleSpecifier))
        nodePath.unshiftContainer('body', importDeclaration)
      },
    },

    JSXAttribute(path, state) {
      if (state.get('debug') !== true) return

      if (path.node.name.name !== 'sx') return
      if (!path.node.value) return

      if (!types.isJSXExpressionContainer(path.node.value)) {
        console.log('This is invalid usage, needs to be fixed manually')
        printNode(state, path.node.value)
        return
      }

      const expression = path.node.value.expression
      const styles: {[key: string]: unknown} = {}

      if (types.isObjectExpression(expression)) {
        expression.properties.forEach(property => {
          // property.type with # of instances in primer/react
          // ObjectProperty 119 | SpreadElement 20 | ObjectMethod 0

          if (types.isObjectMethod(property) || types.isSpreadElement(property)) {
            // TODO
            // example: {...styles} or even sx={{position: 'relative', ...props.sx }}
            // https://github.com/primer/react/blob/main/src/TextInputWithTokens.tsx#L269
          } else if (types.isObjectProperty(property)) {
            // property.key.type (# of instances in primer/react)
            // Identifier (108) | StringLiteral (7) | ConditionalExpression (2)
            // (0) Expression | NumericLiteral | BigIntLiteral | DecimalLiteral | PrivateName

            if (!types.isIdentifier(property.key)) {
              // TODO
              // example, ConditionalExpression: sx={{[position === 'end' ? 'marginBottom' : 'marginTop']: 2}}
              // example, StringLiteral: sx={{'&:hover': {}}}
              console.log(`Can not compile ${property.key.type} yet.`)
              printNode(state, property)
              return
            } else; // Identifier, continue

            // property.value.type (# of instances in primer/react)
            // StringLiteral (59) | NumericLiteral (21) | Identifier (5) | TemplateLiteral (3) |
            // ConditionalExpression (9) | MemberExpression (7) | CallExpression (1) | ObjectExpression (3)

            if (types.isNumericLiteral(property.value) || types.isStringLiteral(property.value)) {
              styles[property.key.name] = property.value.value
              // TODO: remove property from object after inserting in styles
            } else {
              // TODO
              // console.log(`Can not compile ${property.value.type} yet.`)
              // printNode(state, property)
              return
            }
          }
        })
      } else if (types.isExpression(expression)) {
        // external variable sx={styles}
      } else if (types.isCallExpression(expression)) {
        // function call like sx={getStyles()} or even sx={merge(styles,props.sx)}
      } else {
        // can safely ignore, types narrowed to JSXEmptyExpression | never
      }

      const stringifiedStyles = stylesToString(styles)

      // Write css into outFile

      const parentNode = path.parent as babel.types.JSXOpeningElement

      // get component name for prettier classname
      let componentName
      const functionParent = path.getFunctionParent()
      console.log(functionParent.type)
      console.log(functionParent.parent.type)

      // if (types.isArrowFunctionExpression(functionParent)) componentName = functionParent.parent.id.name
      // else if (types.isFunctionDeclaration(functionParent)) componentName = functionParent.node.id.name

      // @ts-ignore ugh so silly
      const className = 'prc-' + componentName + '-' + parentNode.name.name + '-' + hash.default(stringifiedStyles)

      const outFilePath = state.get('outFilePath')
      appendCSS({outFilePath, className, stringifiedStyles})
      state.set('cssInjected', true)

      // add classname to JSXOpeningElement

      const classNameAttribute = parentNode.attributes.find(attribute => {
        if (types.isJSXSpreadAttribute(attribute)) return false
        if (attribute.name.name === 'className') return true
      })

      if (classNameAttribute) {
        // if it already exists, add to it
        // JSXAttribute | JSXSpreadAttribute
      } else {
        // add className attribute
        parentNode.attributes.push(types.jsxAttribute(types.jsxIdentifier('className'), types.stringLiteral(className)))
      }
    },
  }

  return {name: 'babel-plugin-css-out-js', visitor}
}

const cssMap = new Map()
const appendCSS = ({
  outFilePath,
  className,
  stringifiedStyles,
}: {
  outFilePath: string
  className: string
  stringifiedStyles: string
}) => {
  // avoid duplicate classes
  if (cssMap.get(className) === stringifiedStyles) return

  cssMap.set(className, stringifiedStyles)

  let contents = `/* 
  This file is generated by babel-plugin-css-out-js ✨
  Don't edit this file directly :)
*/
  `
  cssMap.forEach((value, key) => {
    contents += `
.${key} {
  ${value}
}`
  })

  // flush
  fs.ensureFileSync(outFilePath)
  fs.writeFileSync(outFilePath, contents)
}

// @ts-ignore only debugging
const printNode = (state: babel.PluginPass, pathNode) => {
  console.log(state.file.code.slice(pathNode.start, pathNode.end))
  console.log(`${state.file.opts.filename}:${pathNode.loc.start.line}`)
  console.log('---')
}

/* eslint-disable no-console */
/* eslint-disable github/array-foreach */

/**
 * next steps:
 * 1 nested objects
 * 2 abstract object styles
 * 3 track identifiers
 * 4 spread
 * 5 break merge into parts
 *
 * fill in css variables
 * replace short syntax with long (like paddingY)
 * expand beyond ActionList
 * calculate % of types compiled
 * remove styled-components import if all styles are compiled out
 * debug: why flex-grow gets default unit of 1px, to-style doesn't support it?
 * run validator through generated css to find errors
 *
 * merge
 *  - can have an identifier
 *  - can have an object
 *
 */

import {ensureFileSync, writeFileSync, removeSync} from 'fs-extra'
import {join, relative, parse} from 'path'
import {PluginObj} from '@babel/core'
import {default as hash} from '@emotion/hash'
// eslint-disable-next-line import/no-namespace
import * as babel from '@babel/core'
// @ts-ignore, there are no types for this library
import {string as stylesObjectToString} from 'to-style'

const COMPILED_TAG = '__COMPILED__'
const classNamePrefix = 'sx'

const LOG_FILENAME = 'css-out-js.log.md'
const STATS_FILENAME = 'css-out-js.stats.md'
removeSync(LOG_FILENAME)
removeSync(STATS_FILENAME)

export default function plugin({types}: typeof babel): PluginObj {
  const visitor: PluginObj['visitor'] = {
    Program: {
      enter(_nodePath, state) {
        state.set('debug', state.file.opts.filename?.includes('src/ActionList/'))
        if (state.get('debug') !== true) return

        // @ts-ignore not typed, dist is relative to root
        const dist = join(state.cwd, state.opts.dist || '')

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relativeFilePath = relative(state.cwd, state.filename!)

        // TODO: this should be .scss to allow nesting
        const outFilePath = join(dist, relativeFilePath.replace('src/', '').replace('.tsx', '.css'))

        state.set('outFilePath', outFilePath)
        state.set('moduleSpecifier', relativeFilePath)

        state.set('stats.sxProps', 0)
        state.set('stats.sxPropsCompiledOut', 0)
      },
      exit(nodePath, state) {
        if (!state.get('cssInjected')) return

        // add css file import

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const moduleSpecifier = `./${parse(state.filename!).name}.css`

        const importDeclaration = types.importDeclaration([], types.stringLiteral(moduleSpecifier))
        nodePath.node.body.unshift(importDeclaration)

        logStats(state)
      },
    },

    JSXAttribute(JSXAttributePath, state) {
      if (state.get('debug') !== true) return

      if (JSXAttributePath.node.name.name !== 'sx') return
      if (!JSXAttributePath.node.value) return

      state.set('stats.sxProps', state.get('stats.sxProps') + 1)

      if (!types.isJSXExpressionContainer(JSXAttributePath.node.value)) {
        notSupported(state, JSXAttributePath.node.value, 'This is invalid usage, needs to be fixed manually. NS1')
        return
      }

      const expression = JSXAttributePath.node.value.expression
      const styles: {[key: string]: unknown} = {}

      if (types.isObjectExpression(expression)) {
        expression.properties.forEach(property => {
          // property.type with # of instances in primer/react
          // ObjectProperty 119 | SpreadElement 20 | ObjectMethod 0

          if (types.isObjectMethod(property) || types.isSpreadElement(property)) {
            // TODO
            // example: {...styles} or even sx={{position: 'relative', ...props.sx }}
            // https://github.com/primer/react/blob/main/src/TextInputWithTokens.tsx#L269

            // idea: can we trace ...sxProp back to props and then remove it because it would
            // be compiled out independently?

            notSupported(state, property, `Can not compile property of type ${property.type} yet. NS2`)
          } else if (types.isObjectProperty(property)) {
            // property.key.type (# of instances in primer/react)
            // Identifier (108) | StringLiteral (7) | ConditionalExpression (2)
            // (0) Expression | NumericLiteral | BigIntLiteral | DecimalLiteral | PrivateName

            if (!types.isIdentifier(property.key)) {
              // TODO
              // example, ConditionalExpression: sx={{[position === 'end' ? 'marginBottom' : 'marginTop']: 2}}
              // example, StringLiteral: sx={{'&:hover': {}}}
              notSupported(state, property, `Can not compile key of type ${property.key.type} yet. NS3`)

              return
            } else; // Identifier, continue

            // property.value.type (# of instances in primer/react)
            // StringLiteral (59) | NumericLiteral (21) | Identifier (5) | TemplateLiteral (3) |
            // ConditionalExpression (9) | MemberExpression (7) | CallExpression (1) | ObjectExpression (3)

            if (types.isNumericLiteral(property.value) || types.isStringLiteral(property.value)) {
              styles[property.key.name] = property.value.value
              // tag property name as compiled, so it can be removed later
              property.key = types.identifier(COMPILED_TAG)
            } else if (types.isIdentifier(property.value) || types.isConditionalExpression(property.value)) {
              // value is set with a variable or expression
              // example: sx={{flexGrow: props.InlineDescription ? 0 : 1}}

              const cssVariable = `--${property.key.name}`
              styles[property.key.name] = `var(${cssVariable})`

              // set variable on runtime via style attribute

              const jsxOpeningElement = JSXAttributePath.parent as babel.types.JSXOpeningElement

              const styleAttribute = jsxOpeningElement.attributes.find(attr => {
                return types.isJSXAttribute(attr) && attr.name.name === 'style'
              }) as babel.types.JSXAttribute | undefined

              if (styleAttribute) {
                // TODO: add variable into existing styles object
              } else {
                // add style attribute
                const keyVal = types.objectProperty(types.stringLiteral(cssVariable), property.value)
                jsxOpeningElement.attributes.push(
                  types.jsxAttribute(
                    types.jsxIdentifier('style'),
                    types.jsxExpressionContainer(types.objectExpression([keyVal])),
                  ),
                )

                // tag property name as compiled, so it can be removed later
                property.key = types.identifier(COMPILED_TAG)
              }
            } else if (types.isObjectExpression(property.value)) {
              // TODO: nested styles
              // example: src/ActionList/Selection.tsx:44
              // sx={{ rect: {...}, path: {...} }}
              notSupported(state, property, `Can not compile value of type ${property.value.type} yet. NS3.5`)
              styles[property.key.name] = {
                display: 'wut',
              }

              return
            } else {
              // TODO
              notSupported(state, property, `Can not compile value of type ${property.value.type} yet. NS4`)
              return
            }
          }
        })

        // Remove compiled properties from properties
        expression.properties = expression.properties.filter(property => {
          if (
            types.isObjectProperty(property) &&
            types.isIdentifier(property.key) &&
            property.key.name === COMPILED_TAG
          ) {
            return false
          } else return true
        })

        // if expression object is empty now, it's safe to remove it
        if (expression.properties.length === 0) {
          state.set('stats.sxPropsCompiledOut', state.get('stats.sxPropsCompiledOut') + 1)
          JSXAttributePath.remove()
        }
      } else if (types.isCallExpression(expression)) {
        // function call like sx={getStyles()} or even sx={merge(styles,props.sx)}
        // TODO: follow first variable and compile that

        notSupported(state, expression, `Can not compile expression of type ${expression.type} yet. NS5`)
      } else if (types.isExpression(expression)) {
        // external variable sx={styles}
        notSupported(state, expression, `Can not compile expression of type ${expression.type} yet. NS6`)
      } else {
        // can safely ignore, types narrowed to JSXEmptyExpression | never
      }

      // nothing could be compiled
      if (Object.keys(styles).length === 0) return

      /**
       * Step 2: Write css into outFile
       */

      // TODO: need to interpolate these for theme
      const stringifiedStyles = stylesObjectToString(styles)
      // @ts-ignore TODO: i don't understand
      const uniqueHash = hash.default(stringifiedStyles)

      /**
       * Step 2.1: Create a good class name
       */
      const parentNode = JSXAttributePath.parent as babel.types.JSXOpeningElement

      // if available, get component name for prettier classname
      let componentName
      const componentParent = JSXAttributePath.findParent(parent => types.isVariableDeclarator(parent))

      if (
        componentParent &&
        types.isVariableDeclarator(componentParent.node) &&
        types.isIdentifier(componentParent.node.id)
      ) {
        componentName = componentParent.node.id.name
      }

      // if available, get data-component
      let dataComponentName = ''
      const dataComponentAttribute = parentNode.attributes.find(attribute => {
        return (
          types.isJSXAttribute(attribute) &&
          attribute.name.name === 'data-component' &&
          types.isStringLiteral(attribute.value)
        )
      })
      if (
        dataComponentAttribute &&
        types.isJSXAttribute(dataComponentAttribute) &&
        types.isStringLiteral(dataComponentAttribute.value)
      ) {
        dataComponentName = dataComponentAttribute.value.value
      }

      // @ts-ignore expecting parentNode.name to be a JSXIdentifier, not JSXMemberExpression
      const JSXOpeningElementName = parentNode.name.name

      const className = [classNamePrefix, componentName, JSXOpeningElementName, dataComponentName, uniqueHash]
        .filter(Boolean)
        .map(part => part.replaceAll('.', '_'))
        .join('-')

      /**
       * Step 2.2: Write css into file
       */

      const outFilePath = state.get('outFilePath')
      appendCSS({outFilePath, className, stringifiedStyles})
      state.set('cssInjected', true)

      /**
       * Step 2.3: Put generated class name on JSXElement
       */

      // add classname to JSXOpeningElement
      const classNameAttribute = parentNode.attributes.find(attribute => {
        if (types.isJSXSpreadAttribute(attribute)) return false
        if (attribute.name.name === 'className') return true
      })

      if (classNameAttribute) {
        // TODO: if it already exists, add to it
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
  ensureFileSync(outFilePath)
  writeFileSync(outFilePath, contents)
}

// @ts-ignore only for debugging
const printNode = (state: babel.PluginPass, pathNode) => {
  if (!pathNode.start) {
    log(`start + end not found, can print source`)
    return
  }

  log(`${state.file.opts.filename}:${pathNode.loc.start.line}`)
  log('\n```tsx')
  log(state.file.code.slice(pathNode.start, pathNode.end))
  log('```\n')
}

const notSupported = (state: babel.PluginPass, pathNode: babel.types.Node, message: string) => {
  log(`\nNot supported: ${message}`)
  printNode(state, pathNode)
}

const log = (...messages: string[]) => {
  writeFileSync(LOG_FILENAME, messages.join(' '), {flag: 'a+'})
  writeFileSync(LOG_FILENAME, '\n', {flag: 'a+'})
}

const logStats = (state: babel.PluginPass) => {
  writeFileSync(STATS_FILENAME, `### ${state.filename}`, {flag: 'a+'})

  const table = `
| stat                    | value |
| ----------------------- | ----- |
| sx props                | ${state.get('stats.sxProps')}     |
| sx props compiled out   | ${state.get('stats.sxPropsCompiledOut')}     |
  `

  writeFileSync(STATS_FILENAME, table, {flag: 'a+'})
  writeFileSync(STATS_FILENAME, '\n', {flag: 'a+'})
}

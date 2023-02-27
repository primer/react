/* eslint-disable no-console */
/* eslint-disable github/array-foreach */

import {ensureFileSync, writeFileSync} from 'fs-extra'
import {join, relative} from 'path'
import {PluginObj} from '@babel/core'
import {default as hash} from '@emotion/hash'
// eslint-disable-next-line import/no-namespace
import * as babel from '@babel/core'
// @ts-ignore, there are no types for this library
import {string as stylesObjectToString} from 'to-style'

const COMPILED_TAG = '__COMPILED__'
const classNamePrefix = 'sx'

// TODO: remove styled-components import if all styles are compiled out

export default function plugin({types}: typeof babel): PluginObj {
  const visitor: PluginObj['visitor'] = {
    Program: {
      enter(_nodePath, state) {
        // @ts-ignore not typed, dist is relative to root
        const dist = join(state.cwd, state.opts.dist || '')

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relativeFilePath = relative(state.cwd, state.filename!)

        // TODO: this should be .scss to allow nesting
        const outFilePath = join(dist, relativeFilePath.replace('src/', '').replace('.tsx', '.css'))

        state.set('outFilePath', outFilePath)
        state.set('moduleSpecifier', relativeFilePath)
        state.set('debug', state.file.opts.filename?.includes('src/ActionList/Item'))
      },
      exit(nodePath, state) {
        if (!state.get('cssInjected')) return

        // add css file import
        const moduleSpecifier = './Item.css'

        const importDeclaration = types.importDeclaration([], types.stringLiteral(moduleSpecifier))
        nodePath.node.body.unshift(importDeclaration)
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
              // tag property name as compiled, so it can be removed later
              property.key = types.identifier(COMPILED_TAG)
            } else {
              // TODO
              // console.log(`Can not compile ${property.value.type} yet.`)
              // printNode(state, property)
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
        if (expression.properties.length === 0) path.remove()
      } else if (types.isExpression(expression)) {
        // external variable sx={styles}
      } else if (types.isCallExpression(expression)) {
        // function call like sx={getStyles()} or even sx={merge(styles,props.sx)}
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
      const parentNode = path.parent as babel.types.JSXOpeningElement

      // if available, get component name for prettier classname
      let componentName
      const componentParent = path.findParent(parent => types.isVariableDeclarator(parent))

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

// @ts-ignore only debugging
const printNode = (state: babel.PluginPass, pathNode) => {
  if (!pathNode.start) {
    console.log(`start + end not found, can print source`)
    return
  }

  console.log(state.file.code.slice(pathNode.start, pathNode.end))
  console.log(`${state.file.opts.filename}:${pathNode.loc.start.line}`)
  console.log('---')
}

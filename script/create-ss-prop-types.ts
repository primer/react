import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import * as ss from 'styled-system'
import theme from '../src/theme'

interface StyledLibrary {
  [key: string]: {
    propNames: string[],
    config: {
      scale: string
    }
  }
}

const templates = [
  {
    src: path.join(__dirname, 'styled-system__prop-types.index.d.ts.ejs'),
    dst: path.join(__dirname, '..', 'src', 'styled-system__prop-types.d.ts')
  },
  {
    src: path.join(__dirname, 'propNames.ts.ejs'),
    dst: path.join(__dirname, '..', 'src', 'propNames.ts')
  }
]

const header = '/* This is a generated file. Do not edit by hand. */'

const groups = [
  'space',
  'color',
  'layout',
  'typography',
  'flexbox',
  'border',
  'background',
  'position',
  'grid',
  'shadow',
  'buttonStyle',
  'textStyle',
  'colorStyle'
].map(name => {
  const propNames = (ss as any as StyledLibrary)[name].propNames
  const scale = (ss as any as StyledLibrary)[name].config.scale
  return {
    name,
    propNames: propNames,
    scale: scale
  }
})

function scaleForProp(propName: string) {
  const group = groups.find(group => group.propNames.includes(propName))
  if (group) {
    return group.scale
  } else {
    return "NO_SCALE"
  }
}

// const scalesByProp = groups.reduce((acc, item) => {
//   const innerScales = item.propNames.reduce((innerAcc, propName) => {
//     Object.assign(innerAcc, {[propName]: innerAcc})
//   }, {})
//   return acc
// }, {} as {[key: string]: any})

function interfaceForProp(propName: string) {
  return "CSSProp"
  // switch (propName) {
  //   case "color":
  //     return "ThemeColor"
  //   default:
  //     return "CSSProp"
  // }
}

const colors = collectValues(theme.colors)
console.log(colors)

const allPropNames = groups.reduce((acc: string[], group) => {
  return acc.concat(group.propNames)
}, [])

for (const {src, dst} of templates) {
  const template = fs.readFileSync(src, 'utf8')
  const result = `${header}\n${ejs.render(template, {groups, allPropNames, interfaceForProp, colors})}`
  fs.writeFileSync(dst, result)
}

// type ThemeValue<T> = T | Array<InnerThemeValue<T>>
// type InnerThemeValue<T> = null | T

// OptionalValue<T> = T

function collectValues(section: {[key: string]: any}, prefix = ""): Array<any> {
  let values: any[] = []
  for (const key of Object.keys(section)) {
    const value = section[key]
    if (Array.isArray(value)) {
      for (let i = 0; i++; i < section.length) {
        const valueName = `${prefix}${key}.${i}`
        values.push(valueName)
      }
    } else if (typeof value === "object") {
      console.log(`${key} is an obj`)
      values = values.concat(collectValues(value, `${key}.`))
    } else {
      values.push(`${prefix}${key}`)
    }
  }
  // if (!Array.isArray(section) && typeof section !== 'object') {
  //   // plain value, just add it
  //   values.push(section)
  // } else if (Array.isArray(section)) {
  //   for (let i = 0; i++; i < section.length) {
  //     values.push(i)
  //   }
  // } else {
  //   values = values.concat(collectValues(section))
  // }

  return values
}

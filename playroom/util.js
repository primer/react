import React, {useRef, useEffect, useState} from 'react'
import {Flex, Text} from '../src'

const useAddRuleForPseudoClass = (ref, pseudoClass) => {
  const [modifiedClassName, setModifiedClassName] = useState('')
  useEffect(() => {
    if (!ref.current) {
      return
    }
    for (const className of ref.current.classList) {
      const fullSelector = `.${className}${pseudoClass}`
      const classNameWithSelector = fullSelector.replace(':', '-')
      for (const ss of document.styleSheets) {
        let newRule = ''
        for (const rule of ss.cssRules) {
          if (fullSelector === rule.selectorText) {
            newRule = `${classNameWithSelector} { ${rule.style.cssText}}`
            setModifiedClassName(classNameWithSelector.substring(1))
          }
        }
        if (newRule) {
          ss.insertRule(newRule, ss.cssRules.length)
          break
        }
      }
    }
  }, [ref, pseudoClass])
  return [modifiedClassName]
}

// Finds a CSS rule for the provided pseudo-class, adds a new
// class with the same css text to the stylesheet, and forwards
// that new class onto the child component.
export const WithPseudoClass = props => {
  const ref = useRef()
  const [modifiedClassName] = useAddRuleForPseudoClass(ref, props.pseudoClass)

  return React.cloneElement(props.children, {
    ref,
    className: modifiedClassName
  })
}

export const StickerSheet = ({props, pseudoClasses, children}) => {
  const rows = [{}]
  for (const prop of props) {
    for (const value of prop.values) {
      const modifiedProps = {}
      modifiedProps[prop.prop] = value
      rows.push(modifiedProps)
    }
  }
  const propsModifiedChildren = rows.map((modifiedProps, index) => {
    const keys = Object.keys(modifiedProps)
    const label = keys.length === 0 ? 'normal' : keys.map(key => `${key}: ${modifiedProps[key]}`).join(', ')
    return (
      <Flex flexDirection="column" key={index.toString()}>
        <Text mr={2}>{label}</Text>
        <Flex mb={2}>
          {React.Children.map(children, child => React.cloneElement(child, {...modifiedProps, mr: 2}))}
        </Flex>
      </Flex>
    )
  })
  const pseudoClassChildren = pseudoClasses.map((pseudoClass, index) => {
    return (
      <Flex flexDirection="column" key={index.toString()}>
        <Text mr={2}>{pseudoClass}</Text>
        <Flex key={index.toString()} mb={2}>
          {React.Children.map(children, child => (
            <WithPseudoClass pseudoClass={pseudoClass}>{React.cloneElement(child, {mr: 2})}</WithPseudoClass>
          ))}
        </Flex>
      </Flex>
    )
  })
  return (
    <Flex flexDirection="column">
      {propsModifiedChildren}
      {pseudoClassChildren}
    </Flex>
  )
}

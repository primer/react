import React, {useRef, useEffect, useState} from 'react'
import {Flex, Text, Heading} from '../src'

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

export const StickerSheet = ({children, title}) => {
  return (
    <Flex p={[3, 4]} flexDirection="column">
      <Heading>{title}</Heading>
      {children}
    </Flex>
  )
}

export const ComponentStickerSheet = ({props = [], pseudoClasses = [], title, children}) => {
  const rows = [{}]
  for (const prop of props) {
    for (const value of prop.values) {
      const modifiedProps = {}
      modifiedProps[prop.prop] = value
      rows.push(modifiedProps)
    }
  }
  const propsModifiedChildren = rows.map(modifiedProps => {
    const keys = Object.keys(modifiedProps)
    const label = keys.length === 0 ? 'normal' : keys.map(key => `${key}: ${modifiedProps[key]}`).join(', ')
    return (
      <StickerSheetRow
        label={label}
        key={label}
        childWrapper={child => React.cloneElement(child, {mr: 2, ...child.props, ...modifiedProps})}
      >
        {children}
      </StickerSheetRow>
    )
  })
  const pseudoClassChildren = pseudoClasses.map(pseudoClass => {
    return (
      <StickerSheetRow
        label={pseudoClass}
        key={pseudoClass}
        childWrapper={child => (
          <WithPseudoClass pseudoClass={pseudoClass}>
            {React.cloneElement(child, {mr: 2, ...child.props})}
          </WithPseudoClass>
        )}
      >
        {children}
      </StickerSheetRow>
    )
  })
  return (
    <Flex flexDirection="column" mb={2}>
      <Text fontSize={3} fontWeight="bold">
        {title}
      </Text>
      {propsModifiedChildren[0]}
      {pseudoClassChildren}
      {propsModifiedChildren.slice(1)}
    </Flex>
  )
}

const StickerSheetRow = ({children, label, childWrapper}) => {
  return (
    <Flex flexDirection="column">
      <Text mr={2}>{label}</Text>
      <Flex mb={2}>{React.Children.map(children, child => childWrapper(child))}</Flex>
    </Flex>
  )
}

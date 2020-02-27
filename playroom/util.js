import React, {useRef, useEffect, useState} from 'react'

const useAddRuleForPseudoClass = (ref, pseudoClass) => {
  const [modifiedClassName, setModifiedClassName] = useState('')
  useEffect(() => {
    if (!ref.current) {
      return
    }
    for (const className of ref.current.classList) {
      const fullSelector = `.${className}${pseudoClass}`
      const classNameWithSelector = fullSelector.replace(':', '-')
      let newRule = ''
      for (const ss of document.styleSheets) {
        for (const rule of ss.cssRules) {
          if (fullSelector === rule.selectorText) {
            newRule = `${classNameWithSelector} { ${rule.style.cssText}}`
            setModifiedClassName(classNameWithSelector.substring(1))
            break
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

export interface GalleryVariable {
  name: string
  expression: string
  properties: string[]
  value: string
  element: Element
}

export interface VariableScan {
  variables: GalleryVariable[]
  warnings: string[]
}

export function variableNames(value: string): string[] {
  return Array.from(value.matchAll(/var\(\s*(--[\w-]+)/g), match => match[1])
}

function withoutPseudoStates(selector: string): string {
  return selector
    .replace(/::[\w-]+(?:\([^)]*\))?/g, '')
    .replace(/:(hover|active|focus-visible|focus-within|focus|visited|disabled|enabled|checked|indeterminate)\b/g, '')
    .replace(/:(not|is|where)\(\s*\)/g, '')
}

/** Includes applicable state rules, scoped component defaults, and their token dependencies. */
export function collectUsedVariables(
  root: HTMLElement,
  componentDefaults?: {scope: ReadonlySet<string>; element: HTMLElement},
): VariableScan {
  const references = new Map<string, Element>()
  const properties = new Map<string, Set<string>>()
  const dependencies = new Map<string, Set<string>>()
  const definitions = new Map<
    string,
    Array<{expression: string; selector?: string; element: Element; important: boolean}>
  >()
  const warnings = new Set<string>()
  const componentDefinitions = new Map<string, {expression: string; important: boolean}>()
  const componentProperties = new Map<string, Set<string>>()
  const document = root.ownerDocument
  const declarations = document.createElement('span').style
  const portals = Array.from(document.querySelectorAll<HTMLElement>('[data-component="Portal"]'))
  const roots = [root]
  if (root.hasAttribute('data-component-gallery-preview')) {
    roots.push(...portals)
  } else {
    // Menus live outside their card. Follow ARIA links rather than including other cards' portals.
    for (let index = 0; index < roots.length; index++) {
      const owner = roots[index]
      for (const portal of portals) {
        if (roots.includes(portal)) continue
        const labelledByOwner = Array.from(portal.querySelectorAll('[aria-labelledby], [aria-describedby]')).some(
          element =>
            ['aria-labelledby', 'aria-describedby'].some(attribute =>
              element
                .getAttribute(attribute)
                ?.split(/\s+/)
                .some(id => {
                  const label = document.getElementById(id)
                  return label !== null && owner.contains(label)
                }),
            ),
        )
        const controlledByOwner = Array.from(owner.querySelectorAll('[aria-controls], [aria-owns]')).some(element =>
          ['aria-controls', 'aria-owns'].some(attribute =>
            element
              .getAttribute(attribute)
              ?.split(/\s+/)
              .some(id => {
                const target = document.getElementById(id)
                return target !== null && portal.contains(target)
              }),
          ),
        )
        if (owner.contains(portal) || labelledByOwner || controlledByOwner) roots.push(portal)
      }
    }
  }

  function matchingElement(selector: string): {element: Element; inherited: boolean} | null {
    try {
      const normalized = withoutPseudoStates(selector)
      for (const candidate of roots) {
        const descendant = candidate.querySelector(normalized)
        if (descendant) return {element: descendant, inherited: false}
        const ancestor = candidate.closest(normalized)
        if (ancestor) return {element: candidate, inherited: ancestor !== candidate}
      }
      return null
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'SyntaxError') throw error
      warnings.add('Some browser-specific selectors could not be inspected.')
      return null
    }
  }

  function readDeclarations(style: CSSStyleDeclaration, element: Element, inherited = false, selector?: string) {
    declarations.cssText = style.cssText
    for (const property of Array.from(style)) {
      const names = variableNames(style.getPropertyValue(property))
      if (property.startsWith('--')) {
        const candidates = definitions.get(property) ?? []
        candidates.push({
          expression: style.getPropertyValue(property).trim(),
          selector,
          element,
          important: style.getPropertyPriority(property) === 'important',
        })
        definitions.set(property, candidates)
        const existing = dependencies.get(property) ?? new Set<string>()
        for (const name of names) existing.add(name)
        dependencies.set(property, existing)
        declarations.removeProperty(property)
      } else if (
        inherited &&
        !/^(color|cursor|direction|font(-.+)?|letter-spacing|line-height|list-style(-.+)?|text-(align|indent|transform|shadow)|visibility|white-space|word-(break|spacing)|writing-mode)$/.test(
          property,
        )
      ) {
        declarations.removeProperty(property)
      }
    }
    // CSSOM expands shorthands into empty longhands when they contain var().
    for (const name of variableNames(declarations.cssText)) references.set(name, element)
    for (const match of declarations.cssText.matchAll(/(?:^|;)\s*([\w-]+)\s*:/g)) {
      const property = match[1]
      for (const name of variableNames(declarations.getPropertyValue(property))) {
        const usage = properties.get(name) ?? new Set<string>()
        usage.add(property)
        properties.set(name, usage)
      }
    }
  }

  function readComponentDefaults(style: CSSStyleDeclaration) {
    if (!componentDefaults) return
    const inScope = (name: string) => componentDefaults.scope.has(/^--([A-Z]\w*)--/.exec(name)?.[1] ?? '')
    for (const match of style.cssText.matchAll(/(?:^|;)\s*([\w-]+)\s*:/g)) {
      const property = match[1]
      const expression = style.getPropertyValue(property).trim()
      if (property.startsWith('--')) {
        if (inScope(property) && !componentDefinitions.has(property)) {
          componentDefinitions.set(property, {
            expression,
            important: style.getPropertyPriority(property) === 'important',
          })
        }
      } else {
        for (const name of variableNames(expression)) {
          if (!inScope(name)) continue
          const usage = componentProperties.get(name) ?? new Set<string>()
          usage.add(property)
          componentProperties.set(name, usage)
        }
      }
    }
  }

  function readRules(rules: CSSRuleList, parents: string[] = []) {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSMediaRule && !window.matchMedia(rule.conditionText).matches) continue
      if (rule instanceof CSSSupportsRule && !CSS.supports(rule.conditionText)) continue
      let selectors = parents
      if (rule instanceof CSSStyleRule) {
        readComponentDefaults(rule.style)
        // Keep selector lists intact: commas inside :is() and :not() are not separators.
        selectors = parents.length
          ? parents.map(parent =>
              rule.selectorText.includes('&')
                ? rule.selectorText.replaceAll('&', `:is(${parent})`)
                : `:is(${parent}) ${rule.selectorText}`,
            )
          : [rule.selectorText]
        for (const selector of selectors) {
          const match = matchingElement(selector)
          if (match) readDeclarations(rule.style, match.element, match.inherited, selector)
        }
      }
      if ('cssRules' in rule && rule.cssRules instanceof CSSRuleList) {
        readRules(rule.cssRules, selectors)
      }
    }
  }

  for (const sheet of Array.from(document.styleSheets)) {
    if (
      sheet.disabled ||
      (sheet.ownerNode instanceof HTMLElement && sheet.ownerNode.hasAttribute('data-gallery-overrides'))
    )
      continue
    try {
      readRules(sheet.cssRules)
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'SecurityError') throw error
      warnings.add(`Cannot inspect cross-origin stylesheet: ${sheet.href ?? 'unknown source'}`)
    }
  }

  for (const candidate of roots) {
    for (const element of [candidate, ...Array.from(candidate.querySelectorAll<HTMLElement>('[style]'))]) {
      readDeclarations(element.style, element)
    }
  }

  if (componentDefaults) {
    // Closed popovers have no DOM; resolve their scoped defaults in a hidden, themed element.
    const element = componentDefaults.element
    element.style.cssText = ''
    for (const [name, {expression, important}] of componentDefinitions) {
      element.style.setProperty(name, expression, important ? 'important' : '')
      if (!references.has(name)) references.set(name, element)
    }
    readDeclarations(element.style, element)
    for (const [name, usage] of componentProperties) {
      const existing = properties.get(name) ?? new Set<string>()
      for (const property of usage) existing.add(property)
      properties.set(name, existing)
    }
  }

  const pending = Array.from(references.keys())
  for (let index = 0; index < pending.length; index++) {
    const name = pending[index]
    for (const dependency of dependencies.get(name) ?? []) {
      const isNew = !references.has(dependency)
      const usage = properties.get(dependency) ?? new Set<string>()
      const previousSize = usage.size
      for (const property of properties.get(name) ?? []) usage.add(property)
      properties.set(dependency, usage)
      if (isNew) {
        references.set(dependency, references.get(name) ?? root)
      }
      if (isNew || usage.size !== previousSize) pending.push(dependency)
    }
  }

  const computed = new Map<Element, CSSStyleDeclaration>()
  function authoredExpression(name: string, element: Element): string {
    const candidates = definitions.get(name) ?? []
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
      let winner: (typeof candidates)[number] | undefined
      for (const candidate of candidates) {
        const matches = candidate.selector ? ancestor.matches(candidate.selector) : ancestor === candidate.element
        if (matches && (!winner || candidate.important || !winner.important)) winner = candidate
      }
      if (winner) return winner.expression
    }
    return ''
  }

  const variables = Array.from(references, ([name, element]) => {
    let style = computed.get(element)
    if (!style) {
      style = window.getComputedStyle(element)
      computed.set(element, style)
    }
    return {
      name,
      expression: authoredExpression(name, element),
      properties: Array.from(properties.get(name) ?? []).sort(),
      value: style.getPropertyValue(name).trim(),
      element,
    }
  }).sort((a, b) => a.name.localeCompare(b.name))

  return {variables, warnings: Array.from(warnings)}
}

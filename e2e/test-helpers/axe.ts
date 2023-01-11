import {getRules} from 'axe-core'

export const contrastOnly = {
  rules: getRules().reduce((acc, rule) => {
    return {
      ...acc,
      [rule.ruleId]: {
        enabled: rule.ruleId === 'color-contrast',
      },
    }
  }, {}),
}

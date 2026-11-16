import {clsx, type ClassValue} from 'clsx'
import {extendTailwindMerge} from 'tailwind-merge'

// tailwind-merge reads `shadow-[var(--x)]` as a shadow color, so it would keep both it and a later `shadow-none`.
// Primer's shadow tokens are full box-shadow values, identifiable by `shadow` in the variable name.
const isPrimerShadowVariable = (value: string) => /^\[var\(--[\w-]*shadow[\w-]*\)\]$/i.test(value)

/**
 * Tailwind v4 prefix reserved for package-owned utilities, written first as in `primer:md:px-4`. A consumer's
 * unprefixed `px-6` comes from the host stylesheet instead, so it can mean something different while still replacing
 * the package's padding when passed through `className`.
 */
export const PACKAGE_UTILITY_PREFIX = 'primer'

const mergePrimerClasses = extendTailwindMerge({
  // tailwind-merge's `prefix` option would treat unprefixed consumer classes as foreign and never merge them, so strip
  // the package prefix here instead to keep prefixed and unprefixed utilities in the same conflict groups.
  experimentalParseClassName: ({className, parseClassName}) => {
    const parsed = parseClassName(className)
    return parsed.modifiers[0] === PACKAGE_UTILITY_PREFIX ? {...parsed, modifiers: parsed.modifiers.slice(1)} : parsed
  },
  extend: {
    classGroups: {
      shadow: [{shadow: [isPrimerShadowVariable]}],
      // `border-default` is omitted because it is also a Primer border color.
      'border-w': [{border: ['thin', 'thick', 'thicker']}],
      z: [{z: ['behind', 'default', 'sticky', 'dropdown', 'overlay', 'modal', 'popover', 'skip-link']}],
      'font-size': [
        {
          text: ['display', 'title-small', 'title-medium', 'title-large', 'body-small', 'body-medium', 'body-large'],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return mergePrimerClasses(clsx(inputs))
}

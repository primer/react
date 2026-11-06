import {clsx, type ClassValue} from 'clsx'
import {extendTailwindMerge} from 'tailwind-merge'

// tailwind-merge reads `shadow-[var(--x)]` as a shadow color, so it would keep both it and a later `shadow-none`.
// Primer's shadow tokens are full box-shadow values, identifiable by `shadow` in the variable name.
const isPrimerShadowVariable = (value: string) => /^\[var\(--[\w-]*shadow[\w-]*\)\]$/i.test(value)

const mergePrimerClasses = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{shadow: [isPrimerShadowVariable]}],
      // `border-default` is omitted because it is also a Primer border color.
      'border-w': [{border: ['thin', 'thick', 'thicker']}],
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

import {clsx, type ClassValue} from 'clsx'
import {extendTailwindMerge} from 'tailwind-merge'

const mergePrimerClasses = extendTailwindMerge({
  extend: {
    classGroups: {
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

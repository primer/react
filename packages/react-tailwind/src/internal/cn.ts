import {clsx, type ClassValue} from 'clsx'
import {extendTailwindMerge} from 'tailwind-merge'

const mergePrimerClasses = extendTailwindMerge({
  extend: {
    classGroups: {
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

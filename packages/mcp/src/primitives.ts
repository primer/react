import baseMotion from '@primer/primitives/dist/docs/base/motion/motion.json' with {type: 'json'}
import baseSize from '@primer/primitives/dist/docs/base/size/size.json' with {type: 'json'}
import baseTypography from '@primer/primitives/dist/docs/base/typography/typography.json' with {type: 'json'}
import functionalSizeBorder from '@primer/primitives/dist/docs/functional/size/border.json' with {type: 'json'}
import functionalSizeCoarse from '@primer/primitives/dist/docs/functional/size/size-coarse.json' with {type: 'json'}
import functionalSizeFine from '@primer/primitives/dist/docs/functional/size/size-fine.json' with {type: 'json'}
import functionalSize from '@primer/primitives/dist/docs/functional/size/size.json' with {type: 'json'}
import light from '@primer/primitives/dist/docs/functional/themes/light.json' with {type: 'json'}
import functionalTypography from '@primer/primitives/dist/docs/functional/typography/typography.json' with {type: 'json'}

const categories = {
  base: {
    motion: Object.values(baseMotion).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    size: Object.values(baseSize).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    typography: Object.values(baseTypography).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
  },
  functional: {
    border: Object.values(functionalSizeBorder).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    sizeCoarse: Object.values(functionalSizeCoarse).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    sizeFine: Object.values(functionalSizeFine).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    size: Object.values(functionalSize).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
    themes: {
      light: Object.values(light).map(token => {
        return {
          name: token.name,
          type: token.type,
          value: token.value,
        }
      }),
    },
    typography: Object.values(functionalTypography).map(token => {
      return {
        name: token.name,
        type: token.type,
        value: token.value,
      }
    }),
  },
} as const

const tokens = [
  ...categories.base.motion,
  ...categories.base.size,
  ...categories.base.typography,
  ...categories.functional.border,
  ...categories.functional.sizeCoarse,
  ...categories.functional.sizeFine,
  ...categories.functional.size,
  ...categories.functional.themes.light,
  ...categories.functional.typography,
]

function serialize(value: typeof tokens): string {
  return value
    .map(token => {
      return `<token name="${token.name}" value="${token.value}" type="${token.type}"></token>`
    })
    .join('\n')
}

export {categories, tokens, serialize}

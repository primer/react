import {defineCommand} from 'citty'

export const command = defineCommand({
  meta: {
    name: 'token',
  },
  subCommands: {
    list: defineCommand({
      meta: {
        name: 'list',
      },
    }),
  },
})

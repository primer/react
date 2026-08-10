import {defineCommand} from 'citty'

export const command = defineCommand({
  meta: {
    name: 'component',
  },
  args: {
    json: {
      type: 'boolean',
      description: 'Output the list in JSON format',
      default: false,
    },
  },
  subCommands: {
    list: defineCommand({
      meta: {
        name: 'list',
      },
      async run(ctx) {
        // const {json} = ctx.args
      },
    }),
  },
})

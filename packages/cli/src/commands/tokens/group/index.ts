import {defineCommand} from 'citty'

export const group = defineCommand({
  meta: {name: 'group', description: 'Retrieve bundles of related design token groups'},
  subCommands: {
    async list() {
      const mod = await import('./list')
      return mod.list
    },
  },
})

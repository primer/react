import {defineCommand, runMain} from 'citty'
import packageJson from '../package.json' with {type: 'json'}

const main = defineCommand({
  meta: {
    name: 'primer',
    version: packageJson.version,
    description: packageJson.description,
  },
})

await runMain(main)

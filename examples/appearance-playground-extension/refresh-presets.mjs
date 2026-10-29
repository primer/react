import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises'
import {stripTypeScriptTypes} from 'node:module'

const sourceDirectory = new URL('../../packages/react/src/AppearancePlayground/', import.meta.url)
const source = await readFile(new URL('AppearancePlayground.tokens.ts', sourceDirectory), 'utf8')
const executable = stripTypeScriptTypes(source).replace(
  /from '(\.\/[^']+\.json)'/g,
  (_, path) => `from '${new URL(path, sourceDirectory).href}' with {type: 'json'}`,
)
const tokens = await import(`data:text/javascript;base64,${Buffer.from(executable).toString('base64')}`)
const catalog = {
  schemaVersion: 1,
  themes: [
    {id: 'primer', name: 'Primer (website default)', mode: 'host', variables: {}},
    ...tokens.playgroundPalettes.map(palette => ({
      id: palette.id,
      name: palette.name,
      mode: palette.mode,
      group: palette.group ?? 'primer',
      variables: tokens.paletteVariables(palette),
      source: palette.source,
    })),
  ],
  densities: tokens.playgroundDensities.map(density => ({
    id: density.id,
    name: density.name,
    variables: tokens.densityVariables(density.id),
  })),
  seriousness: tokens.playgroundSeriousnessProfiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    density: profile.density,
    light: tokens.seriousnessVariables(profile.id, 'light'),
    dark: tokens.seriousnessVariables(profile.id, 'dark'),
  })),
}
await writeFile(new URL('catalog.json', import.meta.url), `${JSON.stringify(catalog, null, 2)}\n`)
await mkdir(new URL('assets/', import.meta.url), {recursive: true})
for (const name of ['w95fa.woff2', 'OFL.txt', '95CSS-LICENSE.txt']) {
  await copyFile(new URL(`assets/w95fa/${name}`, sourceDirectory), new URL(`assets/${name}`, import.meta.url))
}
await mkdir(new URL('assets/ibm-vga/', import.meta.url), {recursive: true})
for (const name of ['pxplus-ibm-vga-9x16.woff2', 'CC-BY-SA-4.0.txt', 'NOTICE.md']) {
  const path = `assets/ibm-vga/${name}`
  await copyFile(new URL(path, sourceDirectory), new URL(path, import.meta.url))
}
console.log(
  `Exported ${catalog.themes.length} themes, ${catalog.densities.length} densities and ${catalog.seriousness.length} Seriousness profiles from the shared Primer engine.`,
)

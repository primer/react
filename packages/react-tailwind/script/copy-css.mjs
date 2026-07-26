import {copyFile, mkdir} from 'node:fs/promises'

await mkdir(new URL('../dist/', import.meta.url), {recursive: true})

await Promise.all(
  ['base.css', 'components.css', 'theme.css', 'tailwind.css'].map(file =>
    copyFile(new URL(`../src/styles/${file}`, import.meta.url), new URL(`../dist/${file}`, import.meta.url)),
  ),
)

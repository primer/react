import assert from 'node:assert/strict'
import {mkdtemp, readFile, rm, writeFile, cp} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {test} from 'node:test'
import {createStackBlitzForm} from './create-stackblitz-reproduction.ts'

test('packages exactly the runnable example and preserves source in escaped form fields', async () => {
  const html = await createStackBlitzForm('examples/stackblitz')
  const fields = [...html.matchAll(/name="([^"]+)" value="([^"]*)"/g)]
  const decode = (value: string) =>
    value
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
  const values = new Map(fields.map(([, name, value]) => [decode(name), decode(value)]))

  assert.match(html, /method="post" action="https:\/\/stackblitz.com\/run" target="_self"/)
  assert.equal(values.get('project[template]'), 'node')
  for (const file of ['package.json', 'index.html', 'tsconfig.json', 'vite.config.ts', 'src/main.tsx', 'src/App.tsx']) {
    assert.equal(values.get(`project[files][${file}]`), await readFile(`examples/stackblitz/${file}`, 'utf8'))
  }
  assert.equal(values.has('project[dependencies]'), false)
  assert.equal(values.size, 9)
})

test('escapes markup and rejects invalid dependencies instead of submitting a broken project', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'primer-stackblitz-'))
  try {
    await cp('examples/stackblitz', directory, {recursive: true})
    await writeFile(join(directory, 'src/App.tsx'), `</input><script>alert("x&y")</script>'`)
    const html = await createStackBlitzForm(directory)
    assert.ok(html.includes('&lt;/input&gt;&lt;script&gt;alert(&quot;x&amp;y&quot;)&lt;/script&gt;&#39;'))
    assert.doesNotMatch(html, /<script>/)
    await writeFile(join(directory, 'package.json'), '{"dependencies":{"react":18}}')
    await assert.rejects(createStackBlitzForm(directory), /dependencies object with string versions/)
  } finally {
    await rm(directory, {recursive: true, force: true})
  }
})

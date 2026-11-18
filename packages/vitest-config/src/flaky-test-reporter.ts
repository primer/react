import {mkdir, writeFile} from 'node:fs/promises'
import {dirname, relative} from 'node:path'
import type {Reporter, TestModule} from 'vitest/node'

export default class FlakyTestReporter implements Reporter {
  async onTestRunEnd(modules: ReadonlyArray<TestModule>) {
    const tests = []

    for (const module of modules) {
      for (const test of module.children.allTests()) {
        const diagnostic = test.diagnostic()
        if (!diagnostic?.flaky) {
          continue
        }

        tests.push({
          project: test.project.name,
          file: relative(process.cwd(), module.moduleId),
          name: test.fullName,
          line: test.location?.line,
          retryCount: diagnostic.retryCount,
          errors: (test.result().errors ?? []).map(error => {
            return error.stack ?? error.message
          }),
        })
      }
    }

    const output = '.test/vitest-flaky-tests.json'
    await mkdir(dirname(output), {
      recursive: true,
    })
    await writeFile(
      output,
      JSON.stringify({
        schemaVersion: 1,
        tests,
      }),
    )
  }
}

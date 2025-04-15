import type {FullResult, Reporter, TestCase, TestResult} from '@playwright/test/reporter'
import {writeFileSync} from 'fs'

class MyReporter implements Reporter {
  // Format we need:
  // https://github.com/benchmark-action/github-action-benchmark?tab=readme-ov-file#examples
  results: {name: string; unit: string; value: number}[] = []

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`⚡️ Finished stress-test ${test.title}: ${result.status}`)
    for (const attachment of result.attachments) {
      // get the content of the attachment to an object
      if (
        attachment.body !== undefined &&
        attachment.name === 'stress-test-result' &&
        attachment.contentType === 'application/json'
      ) {
        const content = JSON.parse(attachment.body.toString())
        console.log(`⚡️ Test result: ${content}`)
        this.results.push({
          name: content.id,
          unit: 'ms',
          value: parseFloat(content.duration),
        })
      }
    }
  }

  onEnd(result: FullResult) {
    console.log(`⚡️ Finished the stress tests run: ${result.status}`)
    const fileName = 'results.json'
    const fileContentString = JSON.stringify(this.results, null, 2)
    console.log(`⚡️ Results file content: ${fileContentString}`)
    writeFileSync(fileName, fileContentString)
    console.log(`⚡️ File saved: ${fileName}`)
  }
}

export default MyReporter

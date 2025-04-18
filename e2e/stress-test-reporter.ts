import type {Reporter, TestCase, TestResult} from '@playwright/test/reporter'
import {writeFileSync} from 'fs'

class MyReporter implements Reporter {
  // Format we need:
  // https://github.com/benchmark-action/github-action-benchmark?tab=readme-ov-file#examples
  results: {name: string; unit: string; value: number}[] = []

  onTestEnd(_test: TestCase, result: TestResult) {
    //  Finished stress-test
    for (const attachment of result.attachments) {
      // Get the content of the attachment to an object
      if (
        attachment.body !== undefined &&
        attachment.name === 'stress-test-result' &&
        attachment.contentType === 'application/json'
      ) {
        const content = JSON.parse(attachment.body.toString())
        this.results.push({
          name: content.id,
          unit: 'ms',
          value: parseFloat(content.duration),
        })
      }
    }
  }

  onEnd() {
    // Finished the stress tests run
    const fileName = 'results.json'
    const fileContentString = JSON.stringify(this.results, null, 2)
    writeFileSync(fileName, fileContentString)
  }
}

export default MyReporter

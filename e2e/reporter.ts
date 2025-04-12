import type {FullConfig, FullResult, Reporter, Suite, TestCase, TestResult} from '@playwright/test/reporter'
import {writeFileSync} from 'fs'

class MyReporter implements Reporter {
  // Format we need:
  // https://github.com/benchmark-action/github-action-benchmark?tab=readme-ov-file#examples
  results: {name: string; unit: string; value: number}[] = []

  onBegin(_config: FullConfig, suite: Suite) {
    console.log(`✨ Starting the run with ${suite.allTests().length} tests`)
  }

  onTestBegin(test: TestCase, _result: TestResult) {
    console.log(`✨ Starting test ${test.title}`)
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`✨ Finished test ${test.title}: ${result.status}`)
    for (const attachment of result.attachments) {
      console.log(`✨ Attachment: ${attachment.name} (${attachment.contentType})`)
      // get the content of the attachment to an object
      if (attachment.body !== undefined && attachment.contentType === 'application/json') {
        const content = JSON.parse(attachment.body.toString())
        console.log(`✨ Attachment content: ${content}`)
        this.results.push({
          name: content.id,
          unit: 'ms',
          value: parseFloat(content.duration),
        })
      }
    }
  }

  onEnd(result: FullResult) {
    console.log(`✨ Finished the run: ${result.status}`)
    const fileName = 'results.json'
    const fileContentString = JSON.stringify(this.results, null, 2)
    console.log(`✨ File content: ${fileContentString}`)
    writeFileSync(fileName, fileContentString)
    console.log(`✨ File saved: ${fileName}`)
  }
}

export default MyReporter

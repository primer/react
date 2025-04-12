import type {FullConfig, FullResult, Reporter, Suite, TestCase, TestResult} from '@playwright/test/reporter'

class MyReporter implements Reporter {
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
        console.log(`✨ Attachment content: ${JSON.stringify(content, null, 2)}`)
      }
    }
  }

  onEnd(result: FullResult) {
    console.log(`✨ Finished the run: ${result.status}`)
  }
}

export default MyReporter

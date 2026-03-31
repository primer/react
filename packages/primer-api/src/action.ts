/**
 * GitHub Action entry point for the Primer bot.
 *
 * Triggered by repository_dispatch with event_type 'primer-bot-question'.
 * Reads the question from the payload, generates an answer using the LLM,
 * and posts it back to Slack using the Slack Web API (chat.postMessage) with a bot token.
 */
import {loadConfig} from './config'
import {ask} from './llm'

interface DispatchPayload {
  question: string
  channel: string
  thread_ts: string
  user: string
}

async function postToSlack(token: string, channel: string, text: string, threadTs: string) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      channel,
      text,
      // eslint-disable-next-line camelcase
      thread_ts: threadTs,
      // eslint-disable-next-line camelcase
      unfurl_links: false,
      // eslint-disable-next-line camelcase
      unfurl_media: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Slack API failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as {ok: boolean; error?: string}
  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error}`)
  }
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    // Running locally without GitHub Actions context
    const question = process.argv[2]
    if (!question) {
      // eslint-disable-next-line no-console
      console.error('Usage: tsx action.ts "your question here"')
      process.exit(1)
    }

    const config = loadConfig()
    const result = await ask(question, config)
    // eslint-disable-next-line no-console
    console.log('\n--- Answer ---')
    // eslint-disable-next-line no-console
    console.log(result.answer)
    // eslint-disable-next-line no-console
    console.log(`\nModel: ${result.model}`)
    // eslint-disable-next-line no-console
    console.log(`Components: ${result.componentsMentioned.join(', ') || 'none'}`)
    return
  }

  // Running in GitHub Actions
  const {readFileSync} = await import('node:fs')
  const event = JSON.parse(readFileSync(eventPath, 'utf-8'))

  // Support both repository_dispatch and workflow_dispatch
  let question: string
  let payload: DispatchPayload | undefined

  if (event.client_payload?.question) {
    // repository_dispatch from Slack
    payload = event.client_payload as DispatchPayload
    question = payload.question
    // eslint-disable-next-line no-console
    console.log(`Question from @${payload.user}: ${question}`)
  } else if (event.inputs?.question) {
    // workflow_dispatch (manual trigger)
    question = event.inputs.question as string
    // eslint-disable-next-line no-console
    console.log(`Manual question: ${question}`)
  } else {
    // eslint-disable-next-line no-console
    console.error('No question found in dispatch payload or workflow inputs')
    process.exit(1)
  }

  const config = loadConfig()
  const result = await ask(question, config)

  // Post to Slack if we have a bot token and a channel to reply to
  if (config.slackBotToken && payload?.channel && payload.thread_ts) {
    await postToSlack(config.slackBotToken, payload.channel, result.answer, payload.thread_ts)
    // eslint-disable-next-line no-console
    console.log('Posted answer to Slack')
  } else {
    // eslint-disable-next-line no-console
    console.log('\n--- Answer ---')
    // eslint-disable-next-line no-console
    console.log(result.answer)
  }

  // eslint-disable-next-line no-console
  console.log(`Model: ${result.model}`)
  // eslint-disable-next-line no-console
  console.log(`Components referenced: ${result.componentsMentioned.join(', ') || 'none'}`)
}

void (async () => {
  try {
    await main()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Fatal error:', error)
    process.exit(1)
  }
})()

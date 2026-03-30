function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getOptionalEnv(name: string): string | undefined {
  return process.env[name]
}

export interface Config {
  openaiApiKey: string
  openaiBaseUrl: string
  model: string
  port: number
  apiKey: string | undefined
  slackBotToken: string | undefined
}

export function loadConfig(): Config {
  // GitHub Models uses the same OpenAI-compatible API at a different base URL
  const useGitHubModels = Boolean(getOptionalEnv('GITHUB_MODELS_TOKEN'))

  return {
    openaiApiKey: useGitHubModels ? getEnv('GITHUB_MODELS_TOKEN') : getEnv('OPENAI_API_KEY'),
    openaiBaseUrl: useGitHubModels ? 'https://models.inference.ai.azure.com' : 'https://api.openai.com/v1',
    model: getOptionalEnv('MODEL') ?? (useGitHubModels ? 'gpt-4o' : 'gpt-4o'),
    port: parseInt(getOptionalEnv('PORT') ?? '3847', 10),
    apiKey: getOptionalEnv('PRIMER_API_KEY'),
    slackBotToken: getOptionalEnv('SLACK_BOT_TOKEN'),
  }
}

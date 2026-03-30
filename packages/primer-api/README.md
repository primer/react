# @primer/api

Adds dynamic LLM-powered answers to the #primer Slack channel. When someone reacts to a question with :robot_face:, a GitHub Action fires, retrieves relevant Primer docs, generates an answer via GitHub Models, and posts it back as a thread reply.

Runs alongside the existing Moveworks-based Primer Bot (which handles @mentions with FAQ matching). No hosted endpoint, no API keys to manage.

## How it works

```
User posts question in #primer
  → Someone reacts with :robot_face:
    → Slack Workflow fires
      → Sends repository_dispatch to GitHub Actions
        → Action retrieves Primer component docs from primer.style
        → Sends context + question to GitHub Models (gpt-4o)
        → Posts answer back to Slack via Web API (thread reply)
```

## Setup

### 1. GitHub Actions secrets

Add these secrets to the `primer/react` repo (Settings > Secrets > Actions):

| Secret            | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `MODELS_TOKEN`    | GitHub PAT with `models:read` scope (for GitHub Models API) |
| `SLACK_BOT_TOKEN` | Slack bot token with `chat:write` scope                     |

### 2. Slack app setup

1. Go to [api.slack.com/apps](https://api.slack.com/apps) > your workspace
2. Create a new app (or use an existing one), name it "Primer AI" or similar
3. Under **OAuth & Permissions**, add the `chat:write` bot scope
4. Install to workspace, copy the Bot User OAuth Token, store as `SLACK_BOT_TOKEN` secret
5. Invite the bot to #primer: `/invite @Primer AI`

### 3. Slack Workflow (triggers the Action)

Create a Slack Workflow that:

1. **Triggers** on emoji reaction (:robot_face:) in #primer
2. **Sends a webhook** (HTTP POST) to trigger the GitHub Action:

**URL:** `https://api.github.com/repos/primer/react/dispatches`

**Headers:**

```
Authorization: Bearer <GITHUB_PAT_WITH_REPO_SCOPE>
Accept: application/vnd.github.v3+json
```

**Body:**

```json
{
  "event_type": "primer-bot-question",
  "client_payload": {
    "question": "{{message_text}}",
    "channel": "{{channel_id}}",
    "thread_ts": "{{message_ts}}",
    "user": "{{user}}"
  }
}
```

The `{{...}}` placeholders are Slack Workflow variables from the trigger context.

### 4. Manual testing

Test by manually dispatching the workflow in the GitHub UI:

1. Go to Actions > "Primer Bot" > "Run workflow"
2. Enter a question like "How do I use ActionList with sections?"
3. Check the Action logs for the generated answer

## Local development

```bash
# From repo root
npm install
npm run build -w packages/react

# Set env vars
export GITHUB_MODELS_TOKEN=ghp_...  # or OPENAI_API_KEY=sk-...

# Run directly (no Slack posting, prints to stdout)
npx tsx packages/primer-api/src/action.ts "How do I use ActionList?"
```

Also works as an HTTP server for local testing:

```bash
npm run dev -w packages/primer-api
curl -X POST http://localhost:3847/ask \
  -H 'Content-Type: application/json' \
  -d '{"question": "How do I use ActionList?"}'
```

## Environment variables

| Variable              | Required     | Description                                |
| --------------------- | ------------ | ------------------------------------------ |
| `GITHUB_MODELS_TOKEN` | Yes\*        | GitHub PAT with `models:read` scope        |
| `OPENAI_API_KEY`      | Yes\*        | Alternative: use OpenAI directly           |
| `SLACK_BOT_TOKEN`     | Actions only | Slack bot token for posting thread replies |
| `MODEL`               | No           | LLM model name (default: gpt-4o)           |
| `PORT`                | No           | HTTP server port (default: 3847)           |
| `PRIMER_API_KEY`      | No           | API key for the HTTP server endpoint       |

\*One of `GITHUB_MODELS_TOKEN` or `OPENAI_API_KEY` is required. GitHub Models is preferred (free for GitHub employees).

## Architecture

```
packages/primer-api/
├── src/
│   ├── action.ts      # GitHub Action entry point (dispatch → LLM → Slack)
│   ├── index.ts       # HTTP server entry point (for local dev / direct API)
│   ├── knowledge.ts   # Retrieves Primer docs from primer.style
│   ├── llm.ts         # OpenAI/GitHub Models integration
│   ├── prompts.ts     # System prompt for the LLM
│   └── config.ts      # Environment variable handling

.github/workflows/
└── primer-bot.yml     # GitHub Action workflow (repository_dispatch trigger)
```

## Comparison with existing Primer Bot

|               | Moveworks Bot       | This (Primer AI)              |
| ------------- | ------------------- | ----------------------------- |
| Trigger       | @mention            | :robot_face: emoji            |
| Response type | FAQ match           | Dynamic LLM reasoning         |
| Data source   | Static FAQ markdown | Live primer.style docs        |
| Latency       | ~1s                 | ~15-30s (Action cold start)   |
| Infra         | Moveworks (managed) | GitHub Actions (zero hosting) |

Both coexist in #primer. Moveworks handles quick FAQ-type questions. This handles nuanced questions that need deeper context.

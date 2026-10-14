import type {McpServer} from '@modelcontextprotocol/server'
// eslint-disable-next-line import/no-namespace
import * as z from 'zod'

const feedbackDescription = `Prepare an agent-feedback issue draft without submitting it. Capture Primer feedback only when there is a concrete bug, documentation gap or mismatch, feature gap, discovery gap, performance gap, accessibility gap, or migration gap.
Do not interrupt normal work or offer feedback after every tool call. Keep track of meaningful user corrections, blockers, and workarounds, then offer once at a natural stopping point, usually after completing the task. If the user explicitly asks to capture feedback, do so immediately.
Do not ask the user to repeat information already available in the conversation. Do not repeat an offer the user has declined, and do not prepare duplicate reports for the same problem.
Before drafting feedback, attempt the smallest safe reproduction of the problem and record the steps and actual result. For documentation or discovery feedback, recheck the relevant source or lookup rather than building an unrelated code example. Do not invent evidence or claim successful reproduction when the attempt did not reproduce the problem. Skip reproduction only when the user says they do not want to wait, and record that explicitly. If reproduction would take substantial time, ask whether the user wants to wait before starting it.
Record the final task outcome separately from reproduction: blocked if the user cannot proceed, worked-around if an alternative approach or manual guidance enables progress, or resolved if the problem is addressed without a remaining workaround. Explain what remains blocked or exactly what enabled progress. A successful reproduction does not mean the task is resolved, and a workaround does not erase the original feedback.
Use prepare_feedback to draft a report, not to submit one. Review the repository and report with the user before opening a prefilled issue link or submitting through another tool. Never submit feedback without explicit user approval.
Include relevant links when available, such as a pull request or Copilot code review comment. Only include an agent-session link if the user explicitly shares it or approves including it. Do not create session share links or upload transcripts just to attach feedback. Check that linked content is appropriate for the destination repository, and omit links whose sharing permissions are unclear.
Default all feedback to github/primer. Only offer primer/react as a fallback when the user cannot create an issue in github/primer, confirmed by the user or an issue-creation permission check. Unknown access, a transient network failure, or a missing GitHub login is not confirmation that the user lacks permission. Do not switch repositories based on the feedback category or resource. Do not copy private code, unreleased product details, credentials, or conversation transcripts into public issues. Ask if access or sharing permissions are unclear; never make private feedback public just to use the fallback.`

const feedbackLinksSchema = z.array(
  z.object({
    label: z
      .string()
      .trim()
      .min(1)
      .regex(/^[^\r\n]+$/),
    url: z.url({
      protocol: /^https$/,
      normalize: true,
    }),
  }),
)

const reproductionSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.enum(['reproduced', 'not-reproduced']),
    steps: z.array(z.string().trim().min(1)).min(1),
    result: z.string().trim().min(1),
  }),
  z.object({
    status: z.literal('skipped-user-request'),
  }),
])

const outcomeSchema = z.object({
  status: z.enum(['blocked', 'worked-around', 'resolved']),
  details: z.string().trim().min(1),
})

const feedbackDraftSchema = z.object({
  status: z.literal('draft'),
  repository: z.enum(['github/primer', 'primer/react']),
  title: z.string(),
  body: z.string(),
  issueUrl: z.string(),
  reproduction: reproductionSchema,
  links: feedbackLinksSchema,
  outcome: outcomeSchema,
})

function registerFeedbackTool(server: McpServer) {
  server.registerTool(
    'prepare_feedback',
    {
      description: feedbackDescription,
      inputSchema: z
        .object({
          repository: z
            .enum(['github/primer', 'primer/react'])
            .default('github/primer')
            .describe(
              'Default to github/primer. Only use primer/react when githubPrimerAccess is unavailable and the report is safe to share publicly.',
            ),
          githubPrimerAccess: z
            .enum(['unknown', 'available', 'unavailable'])
            .default('unknown')
            .describe(
              'Whether the user can create issues in github/primer, confirmed by the user or a permission check. Do not infer unavailable from network errors or missing authentication.',
            ),
          feedbackType: z
            .enum([
              'Bug',
              'Documentation gap',
              'Documentation mismatch',
              'Feature gap',
              'Discovery gap',
              'Performance gap',
              'Accessibility gap',
              'Migration gap',
            ])
            .describe(
              'Bug: incorrect behavior. Documentation gap: missing guidance. Documentation mismatch: conflicting guidance. Feature gap: missing functionality. Discovery gap: an existing resource needed to be pointed out. Performance gap: inefficient behavior. Accessibility gap: inaccessible behavior. Migration gap: no clear path to a deprecated API replacement.',
            ),
          title: z
            .string()
            .trim()
            .min(1)
            .max(200)
            .regex(/^[^\r\n]+$/)
            .describe('A concise issue title'),
          resource: z
            .string()
            .trim()
            .min(1)
            .describe('The affected component, icon, token, pattern, tool, or documentation'),
          observed: z.string().trim().min(1).describe('What went wrong, including a correction or blocker if relevant'),
          expected: z.string().trim().min(1).describe('What should happen instead'),
          reproduction: reproductionSchema.describe(
            'Required minimal reproduction attempt: record actual steps and result with status reproduced or not-reproduced. Only use skipped-user-request if the user explicitly does not want to wait.',
          ),
          context: z
            .string()
            .trim()
            .min(1)
            .optional()
            .describe('Relevant task context and package versions, without private or sensitive details'),
          outcome: outcomeSchema.describe(
            'Required final task outcome: blocked, worked-around, or resolved. Explain what remains blocked, the actual workaround or user guidance that enabled progress, or how the problem was resolved. This is separate from reproduction status.',
          ),
          evidence: z
            .string()
            .trim()
            .min(1)
            .optional()
            .describe('Supporting observations or artifacts; put related URLs in links and do not invent evidence'),
          links: feedbackLinksSchema
            .default([])
            .describe(
              'Optional labeled HTTPS links to relevant pull requests, Copilot code review comments, documentation, or other references. Only include agent-session links explicitly shared or approved by the user. Check sharing permissions for the destination repository.',
            ),
        })
        .refine(
          ({repository, githubPrimerAccess}) => {
            return repository !== 'primer/react' || githubPrimerAccess === 'unavailable'
          },
          {
            message: 'Only use primer/react when the user is confirmed unable to create an issue in github/primer.',
            path: ['repository'],
          },
        ),
      outputSchema: feedbackDraftSchema,
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async ({
      repository,
      feedbackType,
      title,
      resource,
      observed,
      expected,
      reproduction,
      context,
      outcome,
      evidence,
      links,
    }) => {
      const sections = [
        `### Feedback type\n\n${feedbackType}`,
        `### Resource\n\n${resource}`,
        `### Observed\n\n${observed}`,
        `### Expected\n\n${expected}`,
      ]

      if (reproduction.status === 'skipped-user-request') {
        sections.push(`### Reproduction\n\nSkipped at the user's request because they do not want to wait.`)
      } else {
        const steps = reproduction.steps.map((step, index) => {
          return `${index + 1}. ${step}`
        })
        sections.push(
          `### Reproduction\n\nStatus: ${reproduction.status}\n\n${steps.join('\n')}\n\nResult: ${reproduction.result}`,
        )
      }

      if (context) {
        sections.push(`### Context\n\n${context}`)
      }
      if (evidence) {
        sections.push(`### Evidence\n\n${evidence}`)
      }
      if (links.length > 0) {
        const references = links.map(({label, url}) => {
          const escapedLabel = label.replace(/([\\[\]])/g, '\\$1')
          return `- [${escapedLabel}](<${url}>)`
        })
        sections.push(`### Links\n\n${references.join('\n')}`)
      }
      sections.push(`### Outcome\n\nStatus: ${outcome.status}\n\n${outcome.details}`)

      const body = sections.join('\n\n')
      const issueUrl = new URL(`https://github.com/${repository}/issues/new`)
      issueUrl.searchParams.set('template', 'agent-feedback.md')
      issueUrl.searchParams.set('title', title)
      issueUrl.searchParams.set('body', body)

      return {
        structuredContent: {
          status: 'draft',
          repository,
          title,
          body,
          issueUrl: issueUrl.toString(),
          reproduction,
          links,
          outcome,
        },
        content: [
          {
            type: 'text',
            text: `Draft only; no issue has been filed.

Repository: ${repository}
Title: ${title}

${body}

Review the repository and content with the user before opening this link or submitting. primer/react is public: remove private code, credentials, unreleased product details, and conversation transcripts. The agent-feedback.md template is proposed and may not exist yet; the title and body are provided separately for manual filing.

Issue link: ${issueUrl}`,
          },
        ],
      }
    },
  )
}

export {feedbackDraftSchema, registerFeedbackTool}

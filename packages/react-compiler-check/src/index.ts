import {type TransformOptions, transformSync} from '@babel/core'
import {CompilerError} from 'babel-plugin-react-compiler'
import type {CompilerErrorDetailOptions, Logger, SourceLocation} from 'babel-plugin-react-compiler'

type CheckSuggestion = NonNullable<CompilerErrorDetailOptions['suggestions']>[number]

type CheckError = {
  description: string | null
  location: SourceLocation | null
  reason: string
  suggestions: Array<CheckSuggestion> | null | undefined
}

type CheckResult = {ok: true; errors?: never} | {ok: false; errors: Array<CheckError>}

function checkFile(filename: string, contents: string): CheckResult {
  const errors: Array<CheckError> = []
  const logger: Logger = {
    logEvent(_filename, event) {
      // https://react.dev/reference/react-compiler/logger#event-types
      if (event.kind === 'CompileError') {
        addCheckError(errors, {
          description: event.detail.description ?? null,
          location: event.detail.primaryLocation(),
          reason: event.detail.reason,
          suggestions: event.detail.suggestions,
        })
      } else if (event.kind === 'CompileSkip') {
        addCheckError(errors, {
          description: null,
          location: event.loc ?? event.fnLoc,
          reason: event.reason,
          suggestions: null,
        })
      }
    },
  }
  const inputOptions: TransformOptions = {
    babelrc: false,
    configFile: false,
    filename,
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
    ],
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          target: '18',
          logger,
          panicThreshold: 'critical_errors',
        },
      ],
    ],
  }

  try {
    transformSync(contents, inputOptions)
  } catch (error: unknown) {
    if (!(error instanceof CompilerError)) {
      throw error
    }

    for (const detail of error.details) {
      addCheckError(errors, {
        description: detail.description ?? null,
        location: detail.primaryLocation(),
        reason: detail.reason,
        suggestions: detail.suggestions,
      })
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    }
  }

  return {
    ok: true,
  }
}

function addCheckError(errors: Array<CheckError>, error: CheckError): void {
  const hasError = errors.some(existingError => {
    return (
      existingError.reason === error.reason &&
      getLocationLine(existingError.location) === getLocationLine(error.location)
    )
  })

  if (!hasError) {
    errors.push(error)
  }
}

function getLocationLine(location: CheckError['location']): number | null {
  if (location === null || typeof location !== 'object' || !('start' in location)) {
    return null
  }

  return location.start.line
}

export {checkFile}
export type {CheckResult, CheckError}

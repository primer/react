import {createRequire} from 'node:module'
import {type InputOptions, transformSync} from '@babel/core'
import {CompilerError} from 'babel-plugin-react-compiler'
import type {Logger, SourceLocation} from 'babel-plugin-react-compiler'

const require = createRequire(import.meta.url)
const presetTypescript = require.resolve('@babel/preset-typescript')
const presetReact = require.resolve('@babel/preset-react')
const reactCompilerPlugin = require.resolve('babel-plugin-react-compiler')

type CheckError = {
  location: SourceLocation | null
  reason: string
}

type CheckResult = {ok: true; errors?: never} | {ok: false; errors: Array<CheckError>}

function checkFile(filename: string, contents: string): CheckResult {
  const errors: Array<CheckError> = []
  const logger: Logger = {
    logEvent(_filename, event) {
      // https://react.dev/reference/react-compiler/logger#event-types
      if (event.kind === 'CompileError') {
        if (isRecoverableCompileSkip(event.detail.reason)) {
          return
        }

        addCheckError(errors, {
          location: event.detail.primaryLocation(),
          reason: event.detail.reason,
        })
      } else if (event.kind === 'CompileSkip') {
        if (isRecoverableCompileSkip(event.reason)) {
          return
        }

        addCheckError(errors, {
          location: event.loc ?? event.fnLoc,
          reason: event.reason,
        })
      }
    },
  }
  const inputOptions: InputOptions = {
    babelrc: false,
    configFile: false,
    filename,
    presets: [
      presetTypescript,
      [
        presetReact,
        {
          runtime: 'automatic',
        },
      ],
    ],
    plugins: [
      [
        reactCompilerPlugin,
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
      if (isRecoverableCompileSkip(detail.reason)) {
        continue
      }

      addCheckError(errors, {
        location: detail.primaryLocation(),
        reason: detail.reason,
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

function isRecoverableCompileSkip(reason: string): boolean {
  return reason === '(BuildHIR::lowerAssignment) Expected object property value to be an LVal, got: AssignmentPattern'
}

function getLocationLine(location: CheckError['location']): number | null {
  if (location === null || typeof location !== 'object' || !('start' in location)) {
    return null
  }

  return location.start.line
}

export {checkFile}
export type {CheckResult, CheckError}

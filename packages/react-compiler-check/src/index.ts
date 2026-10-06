import {parseSync, Visitor} from 'oxc-parser'
import {transformSync} from 'oxc-transform-react'

interface CheckLocation {
  start: {line: number; column: number}
  end: {line: number; column: number}
}

type CheckError = {
  description: string | null
  location: CheckLocation | null
  reason: string
  suggestions: Array<{description: string}> | null
}

type CheckResult = {ok: true; errors?: never} | {ok: false; errors: Array<CheckError>}

function checkFile(filename: string, contents: string): CheckResult {
  const parsed = parseSync(filename, contents, {showSemanticErrors: true})

  if (parsed.errors.length > 0) {
    throw new SyntaxError(
      parsed.errors
        .map(error => {
          return error.message
        })
        .join('\n'),
    )
  }

  const errors: Array<CheckError> = []
  const result = transformSync(filename, contents, {
    jsx: 'preserve',
    reactCompiler: {
      target: '18',
      reportDiagnostics: true,
      panicThreshold: 'critical_errors',
      outputMode: 'lint',
    },
  })

  for (const error of result.errors) {
    const label = error.labels.at(0)
    addCheckError(errors, {
      description: label?.message ?? null,
      location: label ? getLocation(contents, label.start, label.end) : null,
      reason: error.message,
      suggestions: error.helpMessage ? [{description: error.helpMessage}] : null,
    })
  }

  // Oxc does not emit diagnostics for opt-out directives, but migrated files must not skip compilation.
  new Visitor({
    ExpressionStatement(node) {
      if ('directive' in node && (node.directive === 'use no memo' || node.directive === 'use no forget')) {
        addCheckError(errors, {
          description: null,
          location: getLocation(
            contents,
            Buffer.byteLength(contents.slice(0, node.start)),
            Buffer.byteLength(contents.slice(0, node.end)),
          ),
          reason: `Skipped due to "${node.directive}" directive`,
          suggestions: null,
        })
      }
    },
  }).visit(parsed.program)

  if (result.fatal && errors.length === 0) {
    throw new Error(`React Compiler failed without diagnostics for ${filename}`)
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
  return location?.start.line ?? null
}

function getLocation(contents: string, start: number, end: number): CheckLocation {
  const source = Buffer.from(contents)

  function getPosition(offset: number) {
    const lines = source.subarray(0, offset).toString('utf8').split(/\r\n|[\n\r\u2028\u2029]/)
    return {
      line: lines.length,
      column: lines[lines.length - 1].length,
    }
  }

  return {start: getPosition(start), end: getPosition(end)}
}

export {checkFile}
export type {CheckResult, CheckError}

import {CompilerError as ReactCompilerError} from 'babel-plugin-react-compiler'
import {type InputOptions, transformAsync} from '@babel/core'
import type {Logger, SourceLocation} from 'babel-plugin-react-compiler'

const babelPresetTypescript = import.meta.resolve('@babel/preset-typescript')
const babelPresetReact = import.meta.resolve('@babel/preset-react')
const reactCompilerPlugin = import.meta.resolve('babel-plugin-react-compiler')

type CheckError = {
  location: SourceLocation | null
  reason: string
}

type Result = {ok: true; errors?: never} | {ok: false; errors: Array<CheckError>}

async function check(filename: string, contents: string): Promise<Result> {
  const errors: Array<CheckError> = []
  const logger: Logger = {
    logEvent(_filename, event) {
      if (event.kind === 'CompileSkip') {
        errors.push({
          location: event.loc,
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
      babelPresetTypescript,
      [
        babelPresetReact,
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
          panicThreshold: 'all_errors',
          logger,
        },
      ],
    ],
  }

  try {
    await transformAsync(contents, inputOptions)
  } catch (error: unknown) {
    if (!(error instanceof ReactCompilerError)) {
      throw error
    }

    for (const detail of error.details) {
      errors.push({
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

export {check}

'use strict'

const {default: TestEnvironment} = require('@jest/environment-jsdom-abstract')

class JSDOMEnv extends TestEnvironment {
  // @ts-expect-error the times do not seem to align from @jest/environment
  constructor(config, context) {
    super(config, context, require('jsdom'))
  }
}

module.exports = JSDOMEnv

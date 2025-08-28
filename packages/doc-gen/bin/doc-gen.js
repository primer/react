#!/usr/bin/env node

import {main} from '../dist/index.js'

// eslint-disable-next-line github/no-then
main().catch(() => {
  process.exit(1)
})

'use strict'

const {changeImportSource} = require('../lib/changeImportSource')
const {setupPreserveLeadingComments} = require('../lib/preserveLeadingComments')
const {format} = require('../lib/format')

const draftsToMain = new Set(['SplitPageLayout', 'TreeView', 'UnderlineNav'])
const mainToDeprecated = new Set(['FilteredList', 'FilteredSearch'])

function transform(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  const preserveLeadingComments = setupPreserveLeadingComments(j, root)

  for (const name of draftsToMain) {
    changeImportSource(j, root, {
      name,
      from: '@primer/react/drafts',
      to: '@primer/react',
    })
  }

  for (const name of mainToDeprecated) {
    changeImportSource(j, root, {
      name,
      from: '@primer/react',
      to: '@primer/react/deprecated',
    })
  }

  preserveLeadingComments()

  return format(file, root.toSource())
}

module.exports = transform
module.exports.parser = 'tsx'

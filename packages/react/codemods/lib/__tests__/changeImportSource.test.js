import { defineInlineTest } from 'jscodeshift/dist/testUtils';
import { changeImportSource } from '../changeImportSource';
import { setupPreserveLeadingComments } from '../preserveLeadingComments';

function defaultTransform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const preserveLeadingComments = setupPreserveLeadingComments(j, root);

  changeImportSource(j, root, {
    name: 'TreeView',
    from: '@primer/react/drafts',
    to: '@primer/react'
  });

  preserveLeadingComments();

  return root.toSource(options.printOptions ?? {});
}

const transformOptions = {
  printOptions: {
    quote: 'single',
  },
};

defineInlineTest(
  defaultTransform,
  transformOptions,
`
import { TreeView } from '@primer/react/drafts';
`,
`
import { TreeView } from '@primer/react';
`,
  'moves the import from the source to the target ImportDeclaration'
);

defineInlineTest(
  defaultTransform,
  transformOptions,
`
import { TreeView as PrimerTreeView } from '@primer/react/drafts';
`,
`
import { TreeView as PrimerTreeView } from '@primer/react';
`,
  'supports remapped imports'
);


defineInlineTest(
  defaultTransform,
  transformOptions,
`
// Comment
import { TreeView } from '@primer/react/drafts';
`,
`
// Comment
import { TreeView } from '@primer/react';
`,
  'preserves leading comments'
);

defineInlineTest(
  defaultTransform,
  transformOptions,
`
import { TreeView } from '@primer/react/drafts';
import { Box } from '@primer/react';
`,
`
import { Box, TreeView } from '@primer/react';
`,
  'adds to existing ImportDeclaration'
);

defineInlineTest(
  defaultTransform,
  transformOptions,
`
import fs from 'node:fs';
import { TreeView } from '@primer/react/drafts';
`,
`
import { TreeView } from '@primer/react';
import fs from 'node:fs';
`,
  'replaces import declaration location'
)
defineInlineTest(
  defaultTransform,
  transformOptions,
`
import fs from 'node:fs';
import path from 'node:path';
`,
`
import fs from 'node:fs';
import path from 'node:path';
`,
  'no changes if import is not available'
);;

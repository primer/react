---
'@primer/components': minor
---

Deprecate utility components in favor of using Box.

The following components will be deprecated:

Flex
Grid
Position
Absolute
Fixed
Relative
Sticky
BorderBox

In place of these components, you may now use `Box`, which accepts all system props. There is a codemod availible to effectively handle these deprecations.

First, install jscodeshift:

`npm install -g jscodeshift`

Then, run the codemod using the appropriate command (examples given from the primer/components root directory)

typescript example:
`jscodeshift -t codemods/removeSystemProps.js --parser=tsx path/to/workspace/src/*.tsx`

es6 example:
`jscodeshift -t codemods/removeSystemProps.js --parser=jsx path/to/workspace/src/*.jsx`

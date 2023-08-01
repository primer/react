const {defineTest} = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'update-imports', {
  printOptions: {
    quote: 'single',
    objectCurlySpacing: false,
  },
})

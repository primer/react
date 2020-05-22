const ghpages = require('gh-pages')

ghpages.publish(
  'docs/public',
  {
    branch: 'master',
    repo: 'https://github.com/primer/components.github.io.git',
  },
  () => {
    console.log('Deploy Complete!')
  }
)
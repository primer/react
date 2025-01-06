Storybook tests utilize the storybook feature called [Play functions](https://storybook.js.org/docs/react/writing-stories/play-function).

### Writing a new play function.

For every storybook, we can write a play function which gets executed after the story renders. By combining jest and testing-library API, we can effectively write something like an integration tests. Here, we will call them interactive tests.

### Debugging the play function

The new addon for [storybook interactions](https://storybook.js.org/addons/@storybook/addon-interactions) allows you to debug the play function step by step. We can step back and forth or replay the interactions too.

### On local CI

`npm run test:storybook` will do a quick pass of all storybooks and inform of any breaking tests.

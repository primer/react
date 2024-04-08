import { dirname, join } from "path";
/**
 * @type {import('@storybook/core-common').StorybookConfig}
 */
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [{
    name: '@storybook/addon-essentials',
    options: {
      backgrounds: false,
    },
  }, getAbsolutePath("@storybook/addon-storysource"), getAbsolutePath("@storybook/addon-interactions"), getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-links"), {
    name: 'storybook-addon-turbo-build',
    options: {
      optimizationLevel: 2,
    },
  }, {
    name: '@storybook/addon-styling',
    options: {
      cssModules: {
        localIdentName: 'prc_[local]-[hash:base64:5]',
      },
      postCss: {
        implementation: require('postcss'),
      },
    },
  }, '@storybook/addon-webpack5-compiler-babel'],
  features: {
    interactionsDebugger: true,
    buildStoriesJson: true,
  },
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {
      fastRefresh: true,
      strictMode: true,
      builder: {
        fsCache: true,
      },
    },
  },
  docs: {
    autodocs: false,
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

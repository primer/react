'use strict';

const prettier = require('prettier');
const config = prettier.resolveConfig.sync(process.cwd());

function format(file, source) {
  return prettier.format(source, {
    ...config,
    filepath: file.path,
  });
}

module.exports = {
  format,
};

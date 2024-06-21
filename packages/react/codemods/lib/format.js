'use strict';

const prettier = require('@prettier/sync');
const config = prettier.resolveConfig(process.cwd());

function format(file, source) {
  return prettier.format(source, {
    ...config,
    filepath: file.path,
  });
}

module.exports = {
  format,
};

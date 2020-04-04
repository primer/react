require('./injection/web')

// FIXME: Get this working. Rollup doesn't like it :( module.exports = require('./Primitives')
// Let's hardcode for now, but this breaks web (box-shadow) !!!!!!!
module.exports = {Platform: {OS: 'figma', version: 1}}

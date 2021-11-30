// @ts-nocheck

const fs = require('fs')
const path = require('path')
const fm = require('front-matter')

const dirname = path.resolve(__dirname, '../docs/content/')
const array = []

function processFiles(items, block) {
  var promises = []
  items.forEach(function (item, index) {
    promises.push(
      (function (item, i) {
        return new Promise((resolve, reject) => {
          return block.apply(this, [item, index, resolve, reject])
        })
      })(item, index)
    )
  })
  return Promise.all(promises)
}

function readFiles(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) return reject(err)
      processFiles(filenames, (filename, index, resolve, reject) => {
        fs.readFile(path.resolve(dirname, filename), 'utf-8', (err, content) => {
          if (err) return reject(err)

          if (fm.test(content)) {
            const {
              attributes: {title, status}
            } = fm(content)

            if (status) {
              return resolve({[title]: status})
            }
          }

          resolve(undefined)
        })
      })
        .then(results => {
          return resolve(results)
        })
        .catch(error => {
          return reject(error)
        })
    })
  })
}

readFiles(dirname)
  .then(files => {
    const outputDir = path.resolve(__dirname, '../dist')
    const mappedFiles = files.filter(Boolean).reduce((acc, item) => ({...acc, ...item}), {})
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    console.log(outputDir + '/component-status.json')
    fs.writeFileSync(outputDir + '/component-status.json', JSON.stringify(mappedFiles))
  })
  .catch(error => {
    console.log(error)
  })

// @ts-nocheck

const fs = require('fs')
const path = require('path')
const fm = require('front-matter')

const sourceDirectory = path.resolve(__dirname, '../docs/content/')

function getComponentStatuses(filenames, dir) {
  const promises = []
  const handleCallback = (filename, resolve, reject) => {
    fs.readFile(path.resolve(dir, filename), 'utf-8', (err, content) => {
      if (err) return reject(err)

      if (fm.test(content)) {
        const {
          attributes: {title, status}
        } = fm(content)

        if (status) {
          return resolve({[title]: status})
        }
      }

      resolve(null)
    })
  }

  filenames.forEach(filename => {
    const promise = new Promise((resolve, reject) => {
      return handleCallback(filename, resolve, reject)
    })
    promises.push(promise)
  })
  return Promise.all(promises)
}

async function readFiles(dir) {
  try {
    const filenames = fs.readdirSync(dir)
    const componentStatuses = await getComponentStatuses(filenames, dir)
    return componentStatuses.filter(Boolean).reduce(
      (acc, file) => ({
        ...acc,
        ...file
      }),
      {}
    )
  } catch (err) {
    throw new Error(err)
  }
}

readFiles(sourceDirectory)
  .then(componentStatuses => {
    const outputDir = path.resolve(__dirname, '../dist')

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }

    fs.writeFileSync(outputDir + '/component-status.json', JSON.stringify(componentStatuses))
  })
  .catch(error => {
    console.log(error)
  })

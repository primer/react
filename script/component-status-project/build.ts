// ts-nocheck
import * as fs from 'fs'
import path from 'path'
import fm from 'front-matter'

const sourceDirectory = path.resolve(__dirname, '../../docs/content/')
const outputDir = path.resolve(__dirname, '../../dist')

type ComponentStatus = {
  [component: string]: string
}

function getComponentStatuses(filenames: string[], dir: string) {
  const promises: Promise<ComponentStatus | null>[] = []

  const handleCallback = (
    filename: string,
    resolve: (value: ComponentStatus | null) => void,
    reject: (value: unknown) => void
  ) => {
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

  filenames.forEach((filename: string) => {
    const promise: Promise<ComponentStatus | null> = new Promise((resolve, reject) => {
      return handleCallback(filename, resolve, reject)
    })
    promises.push(promise)
  })
  return Promise.all(promises)
}

async function readFiles(dir: string) {
  try {
    const filenames = fs.readdirSync(dir)
    const componentStatuses = await getComponentStatuses(filenames, dir)
    return componentStatuses
      .filter(Boolean)
      .reverse()
      .reduce(
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
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }

    fs.writeFileSync(outputDir + '/component-status.json', JSON.stringify(componentStatuses))
  })
  .catch(error => {
    console.log(error)
  })

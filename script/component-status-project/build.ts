import fs from 'fs'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fm = require('front-matter') // FIXME after this bugfix is merged https://github.com/jxson/front-matter/pull/77

const sourceDirectory = path.resolve(__dirname, '../../docs/content/')
const outputDir = path.resolve(__dirname, '../../dist/')

type ComponentStatus = {
  [component: string]: string
}

/**
 * Extracts the component status for each file in the given directory.
 *
 * @param filenames Array of filenames to read front-matter from
 * @param dir Absolute path to directory containing files
 * @returns A promise that resolves to an array containing outcome of file front-matter extraction
 */
function getComponentStatuses(filenames: string[], dir: string) {
  const promises: Promise<ComponentStatus | null>[] = []

  const handleCallback = (
    filename: string,
    resolve: (value: ComponentStatus | null) => void,
    reject: (value: unknown) => void,
  ) => {
    fs.readFile(path.resolve(dir, filename), 'utf-8', (err, content) => {
      if (err) return reject(err)

      if (fm.test(content)) {
        const {
          attributes: {title, status},
        } = fm(content)

        if (status) {
          return resolve({[title]: status})
        }
      }

      resolve(null)
    })
  }

  for (const filename of filenames) {
    const promise: Promise<ComponentStatus | null> = new Promise((resolve, reject) => {
      return handleCallback(filename, resolve, reject)
    })
    promises.push(promise)
  }

  return Promise.all(promises)
}

/**
 * Orchestrates the process of reading component status for each file in the given directory.
 *
 * @param dir Directory to source files where status will be extracted from
 * @returns A promise that resolves to an object containing component statuses
 */
async function readFiles(dir: string) {
  try {
    const dirContents = fs.readdirSync(dir, {withFileTypes: true})
    const filenames = dirContents.filter(dirent => dirent.isFile()).map(dirent => dirent.name)
    const componentStatuses = await getComponentStatuses(filenames, dir)

    return componentStatuses
      .filter(Boolean)
      .reverse()
      .reduce(
        (acc, file) => ({
          ...acc,
          ...file,
        }),
        {},
      )
  } catch (err) {
    throw new Error(`error reading files: ${err}`)
  }
}

/**
 * Writes the component status to the given file.
 */
async function build() {
  try {
    const componentStatuses = await readFiles(sourceDirectory)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }

    fs.writeFileSync(`${outputDir}/component-status.json`, JSON.stringify(componentStatuses))
  } catch (error) {
    throw new Error(`error building component status object: ${error}`)
  }
}

build()

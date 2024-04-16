#!/usr/bin/node

/* eslint-disable no-console */

const {exec} = require('child_process')
const versionsObject = require('./canary_versions_2022.json')

const startAtVersion = '0.0.0-202212321238'

const runCommand = async cmd => {
  const child = exec(cmd, err => {
    if (err) {
      console.error(err)
      process.exit(1) // exit on first error
    }
  })
  child.stderr.pipe(process.stderr)
  child.stdout.pipe(process.stdout)
  return await new Promise(resolve => child.on('close', resolve))
}

const unpublish = async version => {
  const command = `npm unpublish @primer/react@${version} --verbose`
  console.log('Running command:', command)
  await runCommand(command)
  console.log(`Command complete`)
}

async function sleep(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

const versions = Object.keys(versionsObject)

const run = async index => {
  const version = versions[index]
  console.log(`-----------------`)
  console.log(`Attempting to unpublish ${version}`)
  console.log(`-----------------`)

  await unpublish(version)
  await sleep(250) // to avoid hitting rate limit
  run(index + 1)
}

const startAtIndex = versions.indexOf(startAtVersion)

run(startAtIndex)

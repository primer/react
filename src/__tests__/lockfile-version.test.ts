import lockFile from '../../package-lock.json'
import docsLockFile from '../../docs/package-lock.json'

test('root: lockfileVersion should be 2', async () => {
  expect(lockFile.lockfileVersion).toEqual(2)
})

test('docs: lockfileVersion should be 2', async () => {
  expect(docsLockFile.lockfileVersion).toEqual(2)
})

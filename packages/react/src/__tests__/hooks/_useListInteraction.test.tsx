import {parseCodeFenceBegin, isCodeFenceEnd} from '../../drafts/MarkdownViewer/_useListInteraction'

describe('parseCodeFenceBegin', () => {
  it('should return null for a line without a code fence', () => {
    expect(parseCodeFenceBegin('This is a test line without a code fence')).toBeNull()
  })

  it('should return the code fence for a line with a code fence', () => {
    expect(parseCodeFenceBegin('```This is a test line with a code fence')).toBe('```')
  })

  it('should return the code fence for a line with a code fence and leading spaces', () => {
    expect(parseCodeFenceBegin('   ~~~This is a test line with a code fence and leading spaces')).toBe('~~~')
  })

  it('should return null for a line with more than 3 leading spaces before the code fence', () => {
    expect(
      parseCodeFenceBegin('    ```This is a test line with more than 3 leading spaces before the code fence'),
    ).toBeNull()
  })
})

describe('isCodeFenceEnd', () => {
  it('should return true for a line that ends a code fence', () => {
    expect(isCodeFenceEnd('```', '```')).toBe(true)
  })

  it('should return false for a line that does not end a code fence', () => {
    expect(isCodeFenceEnd('This is a test line', '```')).toBe(false)
  })

  it('should return true for a line that ends a code fence with leading spaces', () => {
    expect(isCodeFenceEnd('   ~~~', '~~~')).toBe(true)
  })

  it('should return true for a line that ends a code fence with different new line characteres', () => {
    expect(isCodeFenceEnd('~~~', '~~~')).toBe(true)
  })

  it('should return false for a line with more than 3 leading spaces before the code fence end', () => {
    expect(isCodeFenceEnd('    ```', '```')).toBe(false)
  })
})

/**
 * Converts authored component guidance to Markdown without executing Storybook MDX.
 * Unknown MDX fails generation rather than silently dropping consumer instructions.
 */
export function readComponentGuide(source, name, problems) {
  const heading = `# ${name}\n`
  const start = source.indexOf(heading)
  if (start === -1) {
    problems.push(`${name}: README.mdx has no "# ${name}" heading.`)
    return []
  }

  const sections = []
  let section = {heading: 'Usage', lines: []}
  let fence
  let storybookBlock = false
  let skipSection = false
  let pastIntent = false
  let hasExample = false

  function finishSection() {
    const text = section.lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    if (text) sections.push({heading: section.heading, text})
  }

  for (const line of source
    .slice(start + heading.length)
    .trimStart()
    .split('\n')) {
    if (!pastIntent) {
      if (line.trim() === '') pastIntent = true
      continue
    }

    const fenceMatch = /^\s*(`{3,}|~{3,})(.*)$/.exec(line)
    if (fence) {
      if (!skipSection) section.lines.push(line)
      if (
        fenceMatch &&
        fenceMatch[1][0] === fence[0] &&
        fenceMatch[1].length >= fence.length &&
        fenceMatch[2].trim() === ''
      ) {
        fence = undefined
      } else if (!skipSection && /<[A-Za-z][\w.]*(?:[\s/>]|$)/.test(line)) {
        hasExample = true
      }
      continue
    }
    if (fenceMatch) {
      fence = fenceMatch[1]
      if (!skipSection) section.lines.push(line)
      continue
    }
    const sectionMatch = /^## (.+)$/.exec(line)
    if (sectionMatch) {
      finishSection()
      skipSection = sectionMatch[1] === 'Alignment'
      section = {heading: sectionMatch[1] === 'Props' ? 'API notes' : sectionMatch[1], lines: []}
      continue
    }
    if (skipSection) continue
    if (storybookBlock || /^\s*<(?:Canvas|Controls|ApiReference|Meta)\b/.test(line)) {
      storybookBlock = !/\/>\s*$/.test(line)
      continue
    }
    if (/^\s*<\/?[A-Z]/.test(line) || /^\s*\{/.test(line)) {
      problems.push(`${name}: "${section.heading}" contains unsupported MDX outside a code fence.`)
      continue
    }
    section.lines.push(
      line.replace(/\[([^\]]+)\]\((\.\.?\/[^)]*)\)/g, (_, label, target) => {
        const component = /^\.\.\/([^/]+)\/README\.mdx(#.*)?$/.exec(target)
        return component ? `[${label}](./${component[1]}.md${component[2] ?? ''})` : label
      }),
    )
  }
  finishSection()
  if (fence) problems.push(`${name}: README.mdx contains an unclosed code fence.`)
  if (storybookBlock) problems.push(`${name}: README.mdx contains an unclosed Storybook block.`)
  if (!hasExample) problems.push(`${name}: README.mdx needs a fenced usage example, not only an import.`)
  return sections
}

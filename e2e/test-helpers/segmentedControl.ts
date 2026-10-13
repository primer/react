import {expect, type Locator} from '@playwright/test'

type Rgba = [number, number, number, number]

export function contrastRatio(first: Rgba, second: Rgba) {
  const luminance = (color: Rgba) => {
    const channels = color.slice(0, 3).map(value => {
      const channel = value / 255
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  }
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

export async function getControlColors(control: Locator) {
  const colors = await control.evaluate(root => {
    const resolve = (value: string): [number, number, number, number] => {
      const rgb = value.match(/^rgba?\((.+)\)$/)
      const srgb = value.match(/^color\(srgb (.+)\)$/)
      if (!rgb && !srgb) throw new Error(`Unsupported resolved color: ${value}`)
      const parts = (rgb?.[1] ?? srgb![1]).split(/[\s,/]+/)
      const channel = (part: string) => Number.parseFloat(part) * (part.endsWith('%') ? 2.55 : srgb ? 255 : 1)
      const alpha = parts[3] ? Number.parseFloat(parts[3]) / (parts[3].endsWith('%') ? 100 : 1) : 1
      return [channel(parts[0]), channel(parts[1]), channel(parts[2]), alpha]
    }
    const composite = (
      front: [number, number, number, number],
      back: [number, number, number, number],
    ): [number, number, number, number] => [
      front[0] * front[3] + back[0] * (1 - front[3]),
      front[1] * front[3] + back[1] * (1 - front[3]),
      front[2] * front[3] + back[2] * (1 - front[3]),
      1,
    ]
    const knob = getComputedStyle(root, '::before')
    const paintsKnob = knob.content !== 'none' && knob.display !== 'none'
    const background = (element: Element): [number, number, number, number] => {
      const layers = []
      for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
        if (ancestor === root && paintsKnob && element.closest('button')?.getAttribute('aria-pressed') === 'true') {
          layers.push(resolve(knob.backgroundColor))
        }
        layers.push(resolve(getComputedStyle(ancestor).backgroundColor))
      }
      return layers.reverse().reduce((back, front) => composite(front, back), [255, 255, 255, 1])
    }
    const track = background(root)
    const selectedContent = root.querySelector('[aria-pressed="true"] .segmentedControl-content')!
    const borderStyle = paintsKnob ? knob : getComputedStyle(selectedContent)
    const border = resolve(borderStyle.borderTopColor)
    const borderVisible = Number.parseFloat(borderStyle.borderTopWidth) > 0 && border[3] > 0
    return {
      track,
      surface: background(root.parentElement!),
      selected: {
        fill: background(selectedContent),
        border: composite(border, track),
        borderVisible,
      },
      text: Array.from(root.querySelectorAll('.segmentedControl-text, [data-component="CounterLabel"]')).map(
        element => ({
          label: element.textContent,
          foreground: composite(resolve(getComputedStyle(element).color), background(element)),
          background: background(element),
        }),
      ),
      icons: Array.from(root.querySelectorAll('svg')).map(element => ({
        foreground: composite(resolve(getComputedStyle(element).fill), background(element)),
        background: background(element),
      })),
    }
  })
  return {
    ...colors,
    selected: {
      ...colors.selected,
      borderContrast: colors.selected.borderVisible ? contrastRatio(colors.selected.border, colors.track) : null,
      borderAgainstFill: colors.selected.borderVisible
        ? contrastRatio(colors.selected.border, colors.selected.fill)
        : null,
      fillContrast: contrastRatio(colors.selected.fill, colors.track),
    },
    text: colors.text.map(color => ({...color, ratio: contrastRatio(color.foreground, color.background)})),
    icons: colors.icons.map(color => ({...color, ratio: contrastRatio(color.foreground, color.background)})),
  }
}

export async function expectVisibleFocus(button: Locator) {
  await expect(button).toBeFocused()
  const outline = await button.evaluate(element => {
    const style = getComputedStyle(element)
    return {
      visible: element.matches(':focus-visible'),
      style: style.outlineStyle,
      width: Number.parseFloat(style.outlineWidth),
      offset: Number.parseFloat(style.outlineOffset),
      color: style.outlineColor,
      rect: element.getBoundingClientRect().toJSON(),
    }
  })
  expect(outline.visible).toBe(true)
  expect(outline.style).toBe('solid')
  expect(outline.width).toBeGreaterThanOrEqual(2)
  const clip = {
    x: Math.floor(outline.rect.left - outline.width - Math.abs(outline.offset) - 2),
    y: Math.floor(outline.rect.top - outline.width - Math.abs(outline.offset) - 2),
    width: Math.ceil(outline.rect.width) + 2 * (outline.width + Math.abs(outline.offset) + 3),
    height: Math.ceil(outline.rect.height) + 2 * (outline.width + Math.abs(outline.offset) + 3),
  }
  const image = await button.page().screenshot({clip, animations: 'disabled', scale: 'css'})
  const edges = await button.page().evaluate(
    async ({image, outline, clip}) => {
      const source = new Image()
      source.src = `data:image/png;base64,${image}`
      await source.decode()
      const canvas = document.createElement('canvas')
      canvas.width = source.width
      canvas.height = source.height
      const context = canvas.getContext('2d')!
      context.fillStyle = outline.color
      context.fillRect(0, 0, 1, 1)
      const expected = context.getImageData(0, 0, 1, 1).data
      context.drawImage(source, 0, 0)
      const pixel = (x: number, y: number): [number, number, number, number] => {
        const value = context.getImageData(Math.floor(x - clip.x), Math.floor(y - clip.y), 1, 1).data
        return [value[0], value[1], value[2], value[3] / 255]
      }
      const inset = outline.offset + outline.width / 2
      return ['left', 'right', 'top', 'bottom'].map(edge => {
        const vertical = edge === 'left' || edge === 'right'
        const position =
          edge === 'left'
            ? outline.rect.left - inset
            : edge === 'right'
              ? outline.rect.right + inset
              : edge === 'top'
                ? outline.rect.top - inset
                : outline.rect.bottom + inset
        const samples = [0.3, 0.4, 0.5, 0.6, 0.7].map(fraction => {
          const along = vertical
            ? outline.rect.top + outline.rect.height * fraction
            : outline.rect.left + outline.rect.width * fraction
          const color = vertical ? pixel(position, along) : pixel(along, position)
          return {
            painted: color.slice(0, 3).every((value, index) => Math.abs(value - expected[index]) <= 12),
            foreground: [expected[0], expected[1], expected[2], 1] as [number, number, number, number],
            adjacent: [
              vertical ? pixel(position - outline.width, along) : pixel(along, position - outline.width),
              vertical ? pixel(position + outline.width, along) : pixel(along, position + outline.width),
            ],
          }
        })
        return {edge, samples}
      })
    },
    {image: image.toString('base64'), outline, clip},
  )
  const colors = await getControlColors(button.locator('xpath=ancestor::*[@data-component="SegmentedControl"][1]'))
  const foreground = edges[0].samples[0].foreground
  const backgroundRatios = [colors.surface, colors.track, colors.selected.fill].map(background =>
    contrastRatio(foreground, background),
  )
  for (const ratio of backgroundRatios)
    expect(ratio, 'focus contrast against adjacent surfaces').toBeGreaterThanOrEqual(3)
  for (const edge of edges) {
    expect(
      edge.samples.filter(sample => sample.painted).length,
      `${edge.edge} focus outline is painted`,
    ).toBeGreaterThanOrEqual(3)
  }
  return {outline, edges, backgroundRatios}
}

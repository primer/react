import panelClasses from '../SelectPanel.module.css'
import classes from './SelectPanelFilm.module.css'
import {filmRequests, filmRequestTiming, filmTiming} from './filmTimeline'

type Point = {x: number; y: number}

const cardFlights = [
  {
    name: 'SelectPanel.Trigger',
    approach: filmTiming.triggerDrag,
    pickup: filmTiming.triggerPickup,
    drop: filmTiming.triggerDrop,
  },
  {name: 'ActionList', approach: filmTiming.listDrag, pickup: filmTiming.listPickup, drop: filmTiming.listDrop},
  ...filmRequests
    .filter(request => request.time < filmTiming.mobile && request.part !== 'selectionMode="multiple"')
    .map(request => {
      const approach =
        request.part === 'ActionList.Description'
          ? filmTiming.draftShareEnd
          : request.time + filmRequestTiming.delivery + filmRequestTiming.entrance + filmRequestTiming.readingPause
      const pickup = approach + filmRequestTiming.approach
      return {
        name: request.part === 'SelectPanel.SearchInput' ? 'SelectPanel.SearchInput / TextInput' : request.part,
        approach,
        pickup,
        drop: pickup + filmRequestTiming.drag,
      }
    }),
]

function movePointer(from: Point, to: Point, start: number, end: number, time: number): Point {
  const progress = Math.max(0, Math.min(1, (time - start) / (end - start)))
  const eased = progress * progress * (3 - 2 * progress)
  return {x: from.x + (to.x - from.x) * eased, y: from.y + (to.y - from.y) * eased}
}

function getDescriptionDrop(document: Document) {
  const row = document.querySelector<HTMLElement>('[aria-label="Available agents"] [role="option"]')
  const label = row?.querySelector<HTMLElement>('[data-component="ActionList.Item.Label"]')
  if (!row || !label) throw new Error('The SelectPanel film needs an agent row for its description drop.')
  const bounds = row.getBoundingClientRect()
  const text = label.getBoundingClientRect()
  return {
    left: bounds.left,
    // The preview has a 1px border and 24px top padding; block descriptions have a 4px gap.
    top: text.bottom + 4 - 25,
    width: bounds.width,
    padding: `24px ${bounds.right - text.right - 1}px 16px ${text.left - bounds.left - 1}px`,
    previewWidth: text.width,
  }
}

function getFeatureDrop(document: Document, name: string, source: HTMLElement) {
  const view = document.defaultView
  const list = document.querySelector<HTMLElement>('[aria-label="Available agents"]')
  const panel = list?.closest<HTMLElement>('[role="dialog"]')
  const measurement = panel?.cloneNode(true)
  if (!view || !list || !panel || !(measurement instanceof view.HTMLElement)) {
    throw new Error('The SelectPanel film needs its live picker to measure a drop.')
  }
  const rows: {element: HTMLElement; x: number; y: number}[] = []
  measurement.inert = true
  measurement.setAttribute('aria-hidden', 'true')
  measurement.removeAttribute('id')
  Object.assign(measurement.style, {visibility: 'hidden', pointerEvents: 'none'})
  for (const element of measurement.querySelectorAll('[id]')) element.removeAttribute('id')
  panel.after(measurement)
  try {
    const measuredList = measurement.querySelector<HTMLElement>('[aria-label="Available agents"]')!
    let target: HTMLElement
    if (name === 'ActionList.GroupHeading') {
      for (const group of measuredList.querySelectorAll<HTMLElement>('[data-component="ActionList.Group"]')) {
        group.style.setProperty('--group-clock', '-650ms')
        group.setAttribute('data-grouped', 'true')
      }
      target = measuredList.querySelector<HTMLElement>('[data-component="GroupHeadingWrap"]')!
    } else {
      const preview = source.cloneNode(true)
      if (!(preview instanceof view.HTMLElement)) throw new Error('The SelectPanel film needs an HTML preview.')
      preview.removeAttribute('style')
      preview.style.flexShrink = '0'
      target = preview
      if (name === 'SelectPanel.SearchInput / TextInput') {
        const inserted = measurement.querySelector<HTMLElement>(`.${panelClasses.SearchInput}`)
        if (inserted) {
          inserted.parentElement!.style.animation = 'none'
          target = inserted
        } else {
          const wrapper = document.createElement('div')
          wrapper.style.flexShrink = '0'
          wrapper.appendChild(preview)
          measuredList.before(wrapper)
        }
      } else if (name === 'SelectPanel.Footer') {
        const inserted = measurement.querySelector<HTMLElement>(`.${panelClasses.Footer}`)
        if (inserted) {
          inserted.style.animation = 'none'
          target = inserted
        } else {
          measuredList.parentElement!.appendChild(preview)
        }
      } else if (name === 'ActionList.TrailingVisual') {
        Object.assign(preview.style, {
          position: 'fixed',
          left: '0',
          top: '0',
          margin: '0',
          width: `${measuredList.getBoundingClientRect().width}px`,
        })
        measurement.appendChild(preview)
        const originals = source.querySelectorAll<HTMLElement>('[data-component="ActionList.Item"]')
        const previews = preview.querySelectorAll<HTMLElement>('[data-component="ActionList.Item"]')
        const assigned = measuredList.querySelectorAll<HTMLElement>('[role="option"][aria-selected="true"]')
        if (assigned.length !== originals.length)
          throw new Error('The film needs one status preview per assigned agent.')
        const landings = Array.from(assigned, (row, index) => {
          const visual = previews[index].querySelector<HTMLElement>('[data-component="ActionList.TrailingVisual"]')!
          if (!row.querySelector('[data-component="ActionList.TrailingVisual"]')) {
            row
              .querySelector('[data-component="ActionList.Item--DividerContainer"]')!
              .appendChild(visual.cloneNode(true))
          }
          return row
            .querySelector<HTMLElement>('[data-component="ActionList.TrailingVisual"] > span')!
            .getBoundingClientRect()
        })
        const icons = Array.from(previews, row =>
          row
            .querySelector<HTMLElement>('[data-component="ActionList.TrailingVisual"] > span')!
            .getBoundingClientRect(),
        )
        for (const [index, element] of Array.from(originals).entries()) {
          rows.push({
            element,
            x: landings[index].left - landings[0].left - (icons[index].left - icons[0].left),
            y: landings[index].top - landings[0].top - (icons[index].top - icons[0].top),
          })
        }
        const bounds = preview.getBoundingClientRect()
        const last = previews[previews.length - 1].getBoundingClientRect()
        const height = last.bottom + rows[rows.length - 1].y + parseFloat(view.getComputedStyle(preview).paddingBottom)
        return {
          left: landings[0].left - icons[0].left - 17,
          top: landings[0].top - icons[0].top - 25,
          width: bounds.width + 34,
          height: height + 42,
          padding: '24px 16px 16px',
          previewWidth: bounds.width,
          previewHeight: height,
          rows,
        }
      } else {
        throw new Error(`The SelectPanel film has no drop target for ${name}.`)
      }
    }
    const bounds = target.getBoundingClientRect()
    return {
      left: bounds.left - 17,
      top: bounds.top - 25,
      width: bounds.width + 34,
      height: bounds.height + 42,
      padding: '24px 16px 16px',
      previewWidth: bounds.width,
      previewHeight: bounds.height,
      rows,
    }
  } finally {
    measurement.remove()
  }
}

export function updateFilmPointer(document: Document, time: number) {
  const options = document.querySelectorAll<HTMLElement>('[aria-label="Available agents"] [role="option"]')
  const pointer = document.querySelector<SVGSVGElement>('[data-film-pointer]')
  const target = document.querySelector<HTMLElement>('[data-film-trigger-target]')
  if (!pointer || !target) {
    for (const option of options) option.removeAttribute('data-film-hovered')
    return
  }
  const bounds = target.getBoundingClientRect()
  const triggerDrop = {x: bounds.left + 327, y: bounds.top + 23}
  const listDrop = {x: bounds.left + 328, y: bounds.bottom + 28}
  let point = movePointer({x: 209, y: 29}, triggerDrop, filmTiming.minimizeEnd, filmTiming.draftZoomEnd, time)
  for (const spec of [
    {
      name: 'SelectPanel.Trigger',
      approach: filmTiming.triggerDrag,
      pickup: filmTiming.triggerPickup,
      drop: filmTiming.triggerDrop,
      destination: triggerDrop,
    },
    {
      name: 'ActionList',
      approach: filmTiming.listDrag,
      pickup: filmTiming.listPickup,
      drop: filmTiming.listDrop,
      destination: listDrop,
    },
  ]) {
    if (time < spec.approach) break
    if (time >= spec.drop) {
      point = spec.destination
      continue
    }
    const card = document.querySelector<HTMLElement>(`[data-film-tile="${spec.name}"]`)
    if (!card) return
    const cardBounds = card.getBoundingClientRect()
    const grip = {x: cardBounds.left + 328, y: cardBounds.top + 24}
    point = time < spec.pickup ? movePointer(point, grip, spec.approach, spec.pickup - 100, time) : grip
    break
  }
  if (time >= filmTiming.draftSelect - 500) {
    const architect = Array.from(
      document.querySelectorAll<HTMLElement>('[aria-label="Available agents"] [role="option"]'),
    ).find(option => option.textContent.startsWith('Architect'))
    if (architect) {
      const row = architect.getBoundingClientRect()
      point = movePointer(
        listDrop,
        {x: row.right - 20, y: row.top + 16},
        filmTiming.draftSelect - 500,
        filmTiming.draftSelect - 100,
        time,
      )
    }
  }
  pointer.style.visibility = time >= filmTiming.draftScreenshot && time < filmTiming.draftShare ? 'hidden' : ''
  if (time >= filmTiming.draftShare && time < filmTiming.descriptions) {
    const minimized = {x: 209, y: 29}
    const chat = document.querySelector<HTMLElement>('[data-reviewing="true"]')
    const send = chat?.querySelector('[data-film-send]')?.getBoundingClientRect()
    const minimize = chat?.querySelector('[data-film-minimize]')?.getBoundingClientRect()
    if (time >= filmTiming.draftShareMinimize) {
      point = minimized
    } else if (send && minimize) {
      const sent = {x: send.left + send.width / 2, y: send.top + send.height / 2}
      point = movePointer(point, sent, filmTiming.draftShare + 500, filmTiming.draftShared - 120, time)
      point = movePointer(
        point,
        {x: minimize.left + minimize.width / 2, y: minimize.top + minimize.height / 2},
        filmTiming.draftShareMinimize - 700,
        filmTiming.draftShareMinimize - 80,
        time,
      )
    }
  }
  for (const request of filmRequests.filter(request => request.time < filmTiming.mobile)) {
    const approach =
      request.part === 'ActionList.Description'
        ? filmTiming.draftShareEnd
        : request.time + filmRequestTiming.delivery + filmRequestTiming.entrance + filmRequestTiming.readingPause
    const pickup = approach + filmRequestTiming.approach
    const drop = pickup + filmRequestTiming.drag
    if (time < approach) break
    if (request.part === 'selectionMode="multiple"') {
      const button = document.querySelector<HTMLElement>('[aria-label="Selection mode"]')
      if (!button) continue
      const control = button.getBoundingClientRect()
      const start = {x: control.left + 16, y: control.top + control.height / 2}
      const end = {x: start.x, y: control.bottom + 60}
      point =
        time < pickup ? movePointer(point, start, approach, pickup, time) : movePointer(start, end, pickup, drop, time)
      if (time >= drop) {
        let previousClick = filmTiming.multipleSelectionStart
        for (const selection of [
          {name: 'Developer', time: filmTiming.developerSelect},
          {name: 'Accessibility Reviewer', time: filmTiming.reviewerSelect},
        ]) {
          const option = Array.from(options).find(option => option.textContent.startsWith(selection.name))
          const checkbox = option?.querySelector<HTMLElement>('[data-component="ActionList.Selection"]')
          if (!checkbox) throw new Error(`The SelectPanel film needs the ${selection.name} checkbox.`)
          const box = checkbox.getBoundingClientRect()
          const destination = {x: box.left + box.width / 2, y: box.top + box.height / 2}
          point = movePointer(point, destination, previousClick, selection.time, time)
          if (time < selection.time) break
          previousClick = selection.time
        }
      }
    } else {
      const name = request.part === 'SelectPanel.SearchInput' ? 'SelectPanel.SearchInput / TextInput' : request.part
      const card = document.querySelector<HTMLElement>(`[data-film-tile="${name}"]`)
      if (!card) return
      const source = card.getBoundingClientRect()
      const grip = {x: source.left + 328, y: source.top + 24}
      const destination = name === 'ActionList.Description' ? getDescriptionDrop(document) : null
      const measured =
        !destination && !card.hasAttribute('data-film-drop-x') && time >= drop
          ? getFeatureDrop(document, name, card.querySelector<HTMLElement>('[data-film-part]')!)
          : null
      if (measured) {
        card.setAttribute('data-film-drop-x', String(measured.left + 328))
        card.setAttribute('data-film-drop-y', String(measured.top + 24))
      }
      const release = destination
        ? {x: destination.left + 328, y: destination.top + 24}
        : measured
          ? {x: measured.left + 328, y: measured.top + 24}
          : {x: Number(card.getAttribute('data-film-drop-x')), y: Number(card.getAttribute('data-film-drop-y'))}
      point = time < pickup ? movePointer(point, grip, approach, pickup, time) : time < drop ? grip : release
    }
    if (time < drop) break
  }
  if (time >= filmTiming.statuses) {
    const panel = document.querySelector('[aria-label="Available agents"]')?.closest('[role="dialog"]')
    if (!panel) throw new Error('The film needs the agent picker to park its cursor after the status drop.')
    point = movePointer(
      point,
      {x: panel.getBoundingClientRect().right + 28, y: point.y + 24},
      filmTiming.statuses + 100,
      filmTiming.statuses + 450,
      time,
    )
  }
  const scale = [
    filmTiming.draftSelect,
    filmTiming.draftShared,
    filmTiming.draftShareMinimize,
    filmTiming.modeOpen,
    filmTiming.multiple,
    filmTiming.developerSelect,
    filmTiming.reviewerSelect,
  ].some(click => Math.abs(time - click) < 70)
    ? '0.85'
    : '1'
  pointer.style.transform = `translate(${point.x}px, ${point.y}px) scale(${scale})`
  const transform = pointer.getScreenCTM()
  if (!transform) return
  const tip = new DOMPoint(3, 2).matrixTransform(transform)
  for (const option of options) {
    const row = option.getBoundingClientRect()
    option.toggleAttribute(
      'data-film-hovered',
      tip.x >= row.left && tip.x < row.right && tip.y >= row.top && tip.y < row.bottom,
    )
  }
}

export function animateSelectPanel(panel: HTMLElement, trigger: HTMLElement) {
  const document = panel.ownerDocument
  const view = document.defaultView
  if (!view) throw new Error('The SelectPanel film needs a browser document.')
  const issue = trigger.closest('[data-film-issue]')
  if (!issue) throw new Error('The SelectPanel film trigger must belong to its source issue.')
  const cardHome = panel.parentElement!
  const flightLayer = panel.closest('[data-component="Portal"]')?.parentElement
  if (!flightLayer) throw new Error('The SelectPanel film needs a shared portal root for its carried cards.')
  const find = (selector: string, root: HTMLElement = panel) => {
    const element = root.querySelector<HTMLElement>(selector)
    if (!element) throw new Error(`SelectPanel film could not find ${selector}.`)
    return element
  }
  const component = (name: string) => `[data-component="${name}"]`
  const list = find('[role="listbox"]')
  const listSource = find('[data-film-list-source]', document.body)
  const statusSource = find('[data-film-status-source]', document.body)
  const triggerText = find('[data-component="text"]', trigger)
  const originalTriggerText = triggerText.textContent
  const originalTriggerClass = trigger.className
  const originalTriggerVariant = trigger.getAttribute('data-variant')
  const groups = Array.from(list.querySelectorAll<HTMLElement>(component('ActionList.Group')))
  const items = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]'))
  if (groups.length !== 2 || items.length !== 5) {
    throw new Error('The film expects the two groups and five labels in ExplicitApplyCancel.')
  }
  const parts = [
    {element: trigger, name: 'SelectPanel.Trigger', side: 'above'},
    {element: find(`.${panelClasses.Header}`), name: 'SelectPanel.Header', side: 'left'},
    {element: find(`.${panelClasses.SearchInput}`), name: 'SelectPanel.SearchInput / TextInput', side: 'left'},
    {element: find(component('GroupHeadingWrap'), groups[0]), name: 'ActionList.GroupHeading', side: 'right'},
    {element: items[0], name: 'SelectPanel.Item / ActionList.Item', side: 'right'},
    {element: items[1], name: 'ActionList.Item', side: 'right', labelOffset: -12},
    {
      element: find(component('ActionList.LeadingVisual'), items[0]),
      name: 'ActionList.LeadingVisual',
      side: 'left',
      labelOffset: 34,
    },
    {
      element: find(component('ActionList.Description'), items[1]),
      name: 'ActionList.Description',
      side: 'right',
      labelOffset: 8,
    },
    {element: find(component('ActionList.Selection'), items[0]), name: 'selectionMode="multiple"', side: 'left'},
    {element: find(`.${panelClasses.Footer}`), name: 'SelectPanel.Footer', side: 'left'},
    {element: groups[1], name: 'SelectPanel.Group / ActionList.Group', side: 'left'},
    {element: listSource, name: 'ActionList', side: 'left'},
    {element: statusSource, name: 'ActionList.TrailingVisual', side: 'right'},
  ]
  const stackOrder = [
    ...parts.filter(part => !part.name.startsWith('ActionList')),
    ...parts.filter(part => part.name.startsWith('ActionList')),
  ]
  const originalPanelStyle = panel.getAttribute('style')
  panel.style.animation = 'none'
  const anchor = panel.getBoundingClientRect()
  // The live positioner must not follow the trigger when its card moves.
  panel.style.position = 'fixed'
  panel.style.left = `${anchor.left}px`
  panel.style.top = `${anchor.top}px`
  panel.style.transform = 'none'

  const bounds = parts.map(part => (part.name === 'ActionList' ? list : part.element).getBoundingClientRect())
  const stackHeight =
    Math.max(...bounds.filter((_, index) => parts[index].name !== 'ActionList').map(rect => rect.height)) + 66
  const columns = [92, 92, 92]
  const animations: Animation[] = []
  const svg = <K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string>) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag)
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
    return element
  }
  const anatomy = svg('svg', {
    class: classes.Anatomy,
    width: '1440',
    height: '810',
    'aria-hidden': 'true',
    'data-film-anatomy': '',
  })
  panel.parentElement!.appendChild(anatomy)
  const componentHighlight = svg('g', {
    class: classes.AnatomyPart,
    'data-film-component-highlight': 'SelectPanel',
  })
  const componentBox = svg('rect', {
    class: classes.AnatomyBox,
    x: String(anchor.x + 0.75),
    y: String(anchor.y + 0.75),
    width: String(anchor.width - 1.5),
    height: String(anchor.height - 1.5),
    rx: '4',
    pathLength: '1',
  })
  const componentLabel = svg('g', {class: classes.AnatomyLabel})
  const componentLabelY = anchor.top + anchor.height / 2
  const componentText = svg('text', {
    class: `${classes.AnatomyName} ${classes.ComponentName}`,
    x: String(anchor.left - 28),
    y: String(componentLabelY),
    'text-anchor': 'end',
    'dominant-baseline': 'middle',
  })
  componentText.textContent = 'SelectPanel'
  componentLabel.appendChild(componentText)
  componentHighlight.append(
    componentBox,
    svg('line', {
      class: classes.AnatomyLeader,
      x1: String(anchor.left),
      y1: String(componentLabelY),
      x2: String(anchor.left - 28),
      y2: String(componentLabelY),
    }),
    componentLabel,
  )
  anatomy.appendChild(componentHighlight)
  const componentLabelBounds = componentText.getBBox()
  componentLabel.prepend(
    svg('rect', {
      class: classes.AnatomyTag,
      x: String(componentLabelBounds.x - 12),
      y: String(componentLabelBounds.y - 10),
      width: String(componentLabelBounds.width + 24),
      height: String(componentLabelBounds.height + 20),
      rx: '8',
    }),
  )
  animations.push(
    componentBox.animate([{strokeDashoffset: 1}, {strokeDashoffset: 0}], {
      duration: 200,
      delay: filmTiming.panelHighlight,
      fill: 'both',
    }),
    componentLabel.animate([{opacity: 0}, {opacity: 1}], {
      duration: 150,
      delay: filmTiming.panelHighlight + 200,
      fill: 'both',
    }),
  )
  const labelSlices = svg('g', {'data-film-label-slices': ''})
  const sliceDefinitions = svg('defs', {})
  const labelBounds = componentLabel.getBBox()
  const sliceWidth = (labelBounds.width + 2) / 3
  for (const [index, motion] of [
    {x: -10, y: -7, angle: -7},
    {x: 0, y: 7, angle: 4},
    {x: 10, y: -3, angle: -4},
  ].entries()) {
    const clipId = `${panel.id}-film-label-slice-${index}`
    const clip = svg('clipPath', {id: clipId})
    clip.appendChild(
      svg('rect', {
        x: String(labelBounds.x - 1 + index * sliceWidth),
        y: String(labelBounds.y - 1),
        width: String(sliceWidth),
        height: String(labelBounds.height + 2),
      }),
    )
    sliceDefinitions.appendChild(clip)
    const slice = svg('g', {'data-film-label-slice': String(index)})
    const clippedLabel = svg('g', {'clip-path': `url(#${clipId})`})
    clippedLabel.appendChild(componentLabel.cloneNode(true))
    slice.appendChild(clippedLabel)
    slice.style.transformOrigin = `${labelBounds.x + (index + 0.5) * sliceWidth}px ${labelBounds.y + labelBounds.height / 2}px`
    labelSlices.appendChild(slice)
    animations.push(
      slice.animate(
        [
          {transform: 'translate(0px, 0px) rotate(0deg)'},
          {transform: `translate(${motion.x}px, ${motion.y}px) rotate(${motion.angle}deg)`},
        ],
        {
          duration: 100 / 0.8,
          delay: filmTiming.panelLabelCut + (index === 0 ? 160 : 360) / 0.8,
          easing: 'cubic-bezier(.16,1,.3,1)',
          fill: 'both',
        },
      ),
    )
  }
  for (const index of [0, 1]) {
    const knife = svg('g', {'data-film-label-knife': String(index)})
    knife.append(
      svg('path', {
        d: 'M -6 -34 H 18 V -9 Q 18 1 4 14 L -6 22 Z',
        fill: 'var(--bgColor-muted)',
        stroke: 'var(--fgColor-muted)',
        'stroke-width': '1.5',
        'stroke-linejoin': 'round',
      }),
      svg('path', {
        d: 'M -6 -76 Q -6 -82 0 -82 H 12 Q 18 -82 18 -76 V -34 H -6 Z',
        fill: 'var(--fgColor-default)',
        stroke: 'var(--fgColor-onEmphasis)',
        'stroke-width': '1.5',
      }),
      svg('circle', {cx: '6', cy: '-68', r: '2', fill: 'var(--bgColor-muted)'}),
      svg('circle', {cx: '6', cy: '-46', r: '2', fill: 'var(--bgColor-muted)'}),
    )
    labelSlices.appendChild(knife)
    const x = labelBounds.x - 1 + (index + 1) * sliceWidth + 6
    animations.push(
      knife.animate(
        [
          {opacity: 0, transform: `translate(${x}px, ${labelBounds.y - 24}px) rotate(-12deg)`},
          {opacity: 1, offset: 0.1},
          {opacity: 1, offset: 0.8},
          {
            opacity: 0,
            transform: `translate(${x}px, ${labelBounds.y + labelBounds.height + 20}px) rotate(-12deg)`,
          },
        ],
        {
          duration: 190 / 0.8,
          delay: filmTiming.panelLabelCut + (index * 200) / 0.8,
          easing: 'ease-in-out',
          fill: 'both',
        },
      ),
    )
  }
  componentHighlight.append(sliceDefinitions, labelSlices)
  const annotationBounds = parts.map((part, index) => {
    // This additional library part is not present in the opening Labels picker.
    if (part.name === 'ActionList.TrailingVisual') return new view.DOMRect()
    const origin = bounds[index]
    const annotation = svg('g', {
      class: classes.AnatomyPart,
      'data-foundation': String(part.name.startsWith('ActionList')),
    })
    const box = svg('rect', {
      class: classes.AnatomyBox,
      'data-film-outline': part.name,
      x: String(origin.x + 0.75),
      y: String(origin.y + 0.75),
      width: String(origin.width - 1.5),
      height: String(origin.height - 1.5),
      rx: '4',
      pathLength: '1',
    })
    const left = part.side === 'left'
    const above = part.side === 'above'
    const x = above ? origin.x + 6 : left ? anchor.left - 28 : anchor.right + 28
    const labelY = above ? origin.top - 22 : origin.y + origin.height / 2 + (part.labelOffset ?? 0)
    const y = Math.max(16, Math.min(794, labelY))
    const edge = left ? origin.left : origin.right
    const leader = svg('path', {
      class: classes.AnatomyLeader,
      d: above
        ? `M ${x},${origin.top} V ${y + 10}`
        : `M ${edge},${origin.y + origin.height / 2} h ${left ? -4 : 4} V ${y} H ${x}`,
    })
    const label = svg('g', {class: classes.AnatomyLabel, 'data-film-anatomy-label': part.name})
    const text = svg('text', {
      class: classes.AnatomyName,
      x: String(x),
      y: String(y),
      'text-anchor': left ? 'end' : 'start',
      'dominant-baseline': 'middle',
    })
    text.textContent = part.name
    label.appendChild(text)
    annotation.append(box, leader, label)
    anatomy.appendChild(annotation)
    const labelBounds = text.getBBox()
    label.prepend(
      svg('rect', {
        class: classes.AnatomyTag,
        x: String(labelBounds.x - 6),
        y: String(labelBounds.y - 4),
        width: String(labelBounds.width + 12),
        height: String(labelBounds.height + 8),
        rx: '4',
      }),
    )
    const delay = filmTiming.anatomy + index * 25
    animations.push(
      box.animate([{strokeDashoffset: 1}, {strokeDashoffset: 0}], {duration: 350, delay, fill: 'both'}),
      leader.animate([{opacity: 0}, {opacity: 1}], {duration: 180, delay: delay + 350, fill: 'both'}),
      label.animate([{opacity: 0}, {opacity: 1}], {duration: 180, delay: delay + 350, fill: 'both'}),
    )
    return label.getBBox()
  })
  const panelStyle = view.getComputedStyle(panel)
  const outlineColor = panelStyle.getPropertyValue('--fgColor-accent')
  const restingColor = panelStyle.getPropertyValue('--borderColor-muted')
  const cards = parts.map((part, index) => {
    const stackIndex = stackOrder.indexOf(part)
    const foundation = part.name.startsWith('ActionList')
    const origin = bounds[index]
    const column = columns.indexOf(Math.min(...columns))
    const x = 128 + column * 416
    const y = columns[column]
    const height = (part.name === 'ActionList' ? listSource.getBoundingClientRect().height : origin.height) + 66
    columns[column] += height + 40
    const card = document.createElement('div')
    card.className = classes.Tile
    card.inert = true
    card.setAttribute('aria-hidden', 'true')
    card.setAttribute('data-film-tile', part.name)
    card.setAttribute('data-foundation', String(foundation))
    card.setAttribute('data-film-opening', 'true')
    card.style.zIndex = String(100 + stackIndex)
    const label = document.createElement('code')
    label.className = classes.Callout
    label.textContent = part.name
    label.setAttribute('data-film-label', part.name)
    label.setAttribute('data-foundation', String(foundation))
    label.style.width = `${annotationBounds[index].width}px`
    label.style.height = `${annotationBounds[index].height}px`
    card.appendChild(label)
    let host: HTMLElement = card
    if (part.element.tagName === 'LI') {
      host = document.createElement('ul')
      host.className = list.className
      for (const {name, value} of list.attributes) {
        if (name.startsWith('data-') && !name.startsWith('data-film-')) host.setAttribute(name, value)
      }
      Object.assign(host.style, {display: 'block', padding: '0', margin: '0', overflow: 'visible'})
      card.appendChild(host)
    } else if (part.name === 'selectionMode="multiple"') {
      // ActionList's checkbox styling is scoped to its item ancestor.
      host = document.createElement('div')
      host.className = items[0].className
      host.setAttribute('aria-selected', items[0].getAttribute('aria-selected')!)
      Object.assign(host.style, {display: 'block', padding: '0', minHeight: '16px', background: 'transparent'})
      card.appendChild(host)
    }
    let placeholder: HTMLElement | null = null
    if (parts.some(parent => parent !== part && parent.element.contains(part.element))) {
      placeholder = document.createElement(part.element.tagName)
      placeholder.className = part.element.className
      const name = part.element.getAttribute('data-component')
      if (name) placeholder.setAttribute('data-component', name)
      placeholder.setAttribute('aria-hidden', 'true')
      Object.assign(placeholder.style, {
        visibility: 'hidden',
        width: `${origin.width}px`,
        height: `${origin.height}px`,
        boxSizing: 'border-box',
        flexShrink: '0',
      })
    }
    panel.parentElement!.appendChild(card)
    card.setAttribute('data-film-opening', 'false')
    const restingStyle = view.getComputedStyle(card)
    const restingFrame = {
      borderColor: restingColor,
      borderWidth: restingStyle.borderWidth,
      borderRadius: restingStyle.borderRadius,
      boxShadow: restingStyle.boxShadow,
    }
    card.setAttribute('data-film-opening', 'true')
    const translate = (left: number, top: number) => `translate(${left}px, ${top}px)`
    const grid = translate(x, y)
    const stack = translate(1020, 90 + stackIndex * 32 + (foundation ? 12 : 0))
    const originFrame = {
      transform: translate(origin.x, origin.y),
      width: `${origin.width}px`,
      height: `${origin.height}px`,
      padding: '0px',
    }
    const cardFrame = {width: '354px', height: `${height}px`, padding: '48px 16px 16px'}
    const labelOrigin = {
      left: `${annotationBounds[index].x - origin.x - 1.5}px`,
      top: `${annotationBounds[index].y - origin.y - 1.5}px`,
    }
    const partColor = foundation ? panelStyle.getPropertyValue('--fgColor-done') : outlineColor
    const outlineFrame = {
      borderColor: partColor,
      borderWidth: '1.5px',
      borderRadius: '4px',
      boxShadow: 'none',
    }
    const externalLabel = {
      backgroundColor: panelStyle.getPropertyValue(
        foundation ? '--bgColor-done-emphasis' : '--bgColor-accent-emphasis',
      ),
      borderColor: panelStyle.getPropertyValue(
        foundation ? '--borderColor-done-emphasis' : '--borderColor-accent-emphasis',
      ),
      fontSize: '12px',
      borderWidth: '1px',
      borderRadius: '4px',
      padding: '0px 5px',
      height: `${annotationBounds[index].height}px`,
    }
    const internalLabel = {
      backgroundColor: panelStyle.getPropertyValue('--bgColor-default'),
      borderColor: partColor,
      fontSize: '11px',
      borderWidth: '0px',
      borderRadius: '0px',
      padding: '0px',
      height: '18px',
    }
    animations.push(
      card.animate(
        [
          {...originFrame, zIndex: part.name === 'ActionList' ? 75 : 100 + stackIndex, offset: 0},
          {
            ...originFrame,
            zIndex: part.name === 'ActionList' ? 75 : 100 + stackIndex,
            offset: filmTiming.split / 8_000,
            easing: 'cubic-bezier(.16,1,.3,1)',
          },
          {...cardFrame, transform: grid, zIndex: 100 + stackIndex, offset: filmTiming.masonry / 8_000},
          {...cardFrame, transform: grid, offset: filmTiming.stacking / 8_000, easing: 'cubic-bezier(.22,1,.36,1)'},
          {...cardFrame, transform: stack, height: `${stackHeight}px`, offset: filmTiming.stacked / 8_000},
          {...cardFrame, transform: stack, height: `${stackHeight}px`, offset: 1},
        ],
        {duration: 8_000, fill: 'both'},
      ),
      card.animate(
        [
          {opacity: 0, offset: 0},
          {
            opacity: 0,
            offset: (part.name === 'ActionList.TrailingVisual' ? filmTiming.stacking : filmTiming.split - 1) / 8_000,
          },
          {
            opacity: 1,
            offset: (part.name === 'ActionList.TrailingVisual' ? filmTiming.stacked : filmTiming.split) / 8_000,
          },
          {opacity: 1},
        ],
        {duration: 8_000, fill: 'both'},
      ),
      card.animate(
        [
          {...outlineFrame, offset: 0},
          {...outlineFrame, offset: filmTiming.stacking / 8_000},
          {...restingFrame, offset: filmTiming.stacked / 8_000},
          {...restingFrame, offset: 1},
        ],
        {duration: 8_000, fill: 'both'},
      ),
      label.animate(
        [
          {...labelOrigin, offset: 0},
          {...labelOrigin, offset: filmTiming.split / 8_000, easing: 'cubic-bezier(.16,1,.3,1)'},
          {left: '0px', top: '-28px', offset: filmTiming.masonry / 8_000},
          {left: '0px', top: '-28px', offset: filmTiming.stacking / 8_000},
          {left: '16px', top: '12px', offset: filmTiming.stacked / 8_000},
          {left: '16px', top: '12px', offset: 1},
        ],
        {duration: 8_000, fill: 'both'},
      ),
      label.animate(
        [
          {...externalLabel, offset: 0},
          {...externalLabel, offset: filmTiming.stacking / 8_000},
          {...internalLabel, offset: filmTiming.stacked / 8_000},
          {...internalLabel, offset: 1},
        ],
        {duration: 8_000, fill: 'both'},
      ),
      label.animate(
        [
          {color: panelStyle.getPropertyValue('--fgColor-onEmphasis'), offset: 0},
          {
            color: panelStyle.getPropertyValue('--fgColor-onEmphasis'),
            offset: filmTiming.stacking / 8_000,
            easing: 'steps(1, end)',
          },
          {color: partColor, offset: (filmTiming.stacking + filmTiming.stacked) / 2 / 8_000},
          {color: partColor, offset: 1},
        ],
        {duration: 8_000, fill: 'both'},
      ),
    )
    part.element.setAttribute('data-film-part', part.name)
    return {
      ...part,
      card,
      host,
      label,
      labelBounds: annotationBounds[index],
      placeholder,
      marker: document.createComment(part.name),
      style: part.element.getAttribute('style'),
      width: origin.width,
    }
  })

  for (const element of issue.querySelectorAll<HTMLElement>('[data-film-backdrop]')) {
    animations.push(
      element.animate(
        [
          {opacity: 1, offset: 0},
          {opacity: 1, offset: filmTiming.split / 8_000},
          {opacity: 0, offset: 0.5625},
          {opacity: 0},
        ],
        {duration: 8_000, fill: 'both'},
      ),
    )
  }
  for (const element of issue.querySelectorAll<HTMLElement>('[data-film-backdrop-border]')) {
    const color = view.getComputedStyle(element).borderColor
    animations.push(
      element.animate(
        [
          {borderColor: color, offset: 0},
          {borderColor: color, offset: filmTiming.split / 8_000},
          {borderColor: 'transparent', offset: 0.5625},
          {borderColor: 'transparent'},
        ],
        {duration: 8_000, fill: 'both'},
      ),
    )
  }
  for (const animation of animations) {
    animation.pause()
    animation.currentTime = 0
  }

  let separated = false
  const pickupAnimations: Animation[] = []
  const animationEnds = new WeakMap<Animation, number>()
  const initializedFlights = new Set<string>()
  const restore = () => {
    if (!separated) return
    // Restore nested ActionList pieces before restoring their parent item.
    for (const {element, marker, style, placeholder} of [...cards].reverse()) {
      placeholder?.remove()
      marker.replaceWith(element)
      if (style === null) element.removeAttribute('style')
      else element.setAttribute('style', style)
    }
    panel.style.visibility = 'visible'
    separated = false
  }
  return {
    seek(time: number) {
      const reducedMotion = view.matchMedia('(prefers-reduced-motion: reduce)').matches
      componentHighlight.style.display = time >= filmTiming.panelHighlight && time < filmTiming.anatomy ? '' : 'none'
      const slicing = !reducedMotion && time >= filmTiming.panelLabelCut
      componentLabel.style.display = slicing ? 'none' : ''
      labelSlices.style.display = slicing ? '' : 'none'
      const statusActive = String(time >= filmTiming.statuses)
      if (statusSource.getAttribute('data-film-status-active') !== statusActive)
        statusSource.setAttribute('data-film-status-active', statusActive)
      anatomy.style.display = time >= filmTiming.split ? 'none' : ''
      for (const {card, name, label, labelBounds} of cards) {
        const opening = time < filmTiming.stacked
        card.setAttribute('data-film-opening', String(opening))
        label.style.width = opening ? `${labelBounds.width}px` : ''
        label.style.height = opening ? `${labelBounds.height}px` : ''
        card.style.display =
          time >= filmTiming.platform ||
          (name === 'ActionList.TrailingVisual' && time < filmTiming.stacking) ||
          cardFlights.some(flight => flight.name === name && time >= flight.drop)
            ? 'none'
            : ''
        const carrying =
          !reducedMotion &&
          cardFlights.some(flight => flight.name === name && time >= flight.pickup - 100 && time < flight.drop)
        // A later popup Portal must not cover the carried preview.
        const layer = carrying ? flightLayer : cardHome
        if (card.parentElement !== layer) layer.appendChild(card)
      }
      const button = time >= filmTiming.draft
      const text = button ? 'Button' : originalTriggerText
      if (triggerText.textContent !== text) triggerText.textContent = text
      if (button) {
        trigger.setAttribute('data-film-button', 'true')
        trigger.setAttribute('data-variant', 'default')
        trigger.classList.remove(classes.SidebarHeading)
      } else {
        trigger.removeAttribute('data-film-button')
        trigger.className = originalTriggerClass
        if (originalTriggerVariant === null) trigger.removeAttribute('data-variant')
        else trigger.setAttribute('data-variant', originalTriggerVariant)
      }
      const target = document.querySelector<HTMLElement>('[data-film-trigger-target]')
      for (const spec of cardFlights) {
        if (initializedFlights.has(spec.name) || time < spec.approach || time >= spec.drop || !target) continue
        const bounds = target.getBoundingClientRect()
        const isTrigger = spec.name === 'SelectPanel.Trigger'
        const isDraft = isTrigger || spec.name === 'ActionList'
        const isDescription = spec.name === 'ActionList.Description'
        const source = cards.find(card => card.name === spec.name)!
        const descriptionDrop = isDescription ? getDescriptionDrop(document) : null
        const featureDrop = !isDraft && !isDescription ? getFeatureDrop(document, spec.name, source.element) : null
        const destination = {
          left: isDraft ? bounds.left - (isTrigger ? 1 : 0) : bounds.right - 352,
          top: isTrigger ? bounds.top - 1 : bounds.bottom + (isDraft ? 4 : 60),
          width: bounds.width + (isTrigger ? 2 : 0),
          height: isTrigger
            ? bounds.height + 2
            : isDraft
              ? 178
              : (isDescription
                  ? parseFloat(view.getComputedStyle(source.element).lineHeight)
                  : source.element.getBoundingClientRect().height) + 42,
          padding: isDraft ? '0px' : '24px 16px 16px',
          previewWidth: isDraft ? bounds.width : bounds.width - 34,
          ...descriptionDrop,
          ...featureDrop,
        }
        source.card.setAttribute('data-film-drop-x', String(destination.left + 328))
        source.card.setAttribute('data-film-drop-y', String(destination.top + 24))
        const {card, element, label} = source
        const stackIndex = stackOrder.findIndex(part => part.name === spec.name)
        const sourceY = 90 + stackIndex * 32 + (spec.name.startsWith('ActionList') ? 12 : 0)
        const color = spec.name.startsWith('ActionList') ? panelStyle.getPropertyValue('--fgColor-done') : outlineColor
        const timing = {
          duration: spec.drop - spec.pickup,
          delay: spec.pickup,
          easing: 'cubic-bezier(0.3, 0, 0.2, 1)',
          fill: 'none',
        } as const
        const flight = [
          card.animate([{borderColor: color}, {borderColor: color}], {
            duration: spec.drop - spec.pickup + 100,
            delay: spec.pickup - 100,
            fill: 'none',
          }),
          card.animate(
            [
              {
                transform: `translate(1020px, ${sourceY}px)`,
                width: '354px',
                height: `${stackHeight}px`,
                padding: '48px 16px 16px',
                overflow: 'visible',
                zIndex: 490,
              },
              {
                transform: `translate(${destination.left}px, ${destination.top}px)`,
                width: `${destination.width}px`,
                height: `${destination.height}px`,
                padding: destination.padding,
                overflow: 'visible',
                zIndex: 490,
              },
            ],
            timing,
          ),
          label.animate([{top: '12px'}, {top: '-26px'}], timing),
          element.animate(
            [
              {width: `${source.width}px`, height: `${element.getBoundingClientRect().height}px`},
              {
                width: `${destination.previewWidth}px`,
                ...(featureDrop ? {height: `${featureDrop.previewHeight}px`} : {}),
              },
            ],
            timing,
          ),
        ]
        for (const row of featureDrop?.rows ?? []) {
          flight.push(
            row.element.animate([{transform: 'none'}, {transform: `translate(${row.x}px, ${row.y}px)`}], timing),
          )
        }
        for (const animation of flight) animation.pause()
        initializedFlights.add(spec.name)
        pickupAnimations.push(...flight)
        animations.push(...flight)
      }
      if (time >= filmTiming.split && !separated) {
        for (const {element, host, marker, width, placeholder} of cards) {
          element.before(marker)
          if (placeholder) marker.after(placeholder)
          host.appendChild(element)
          element.style.position = 'relative'
          element.style.inset = 'auto'
          element.style.margin = '0'
          element.style.width = `${width}px`
          element.style.transform = 'none'
          if (element.getAttribute('data-film-part') === 'ActionList.Description') element.style.display = 'block'
          if (element.getAttribute('data-film-part') === 'SelectPanel.SearchInput / TextInput')
            element.style.maxWidth = 'none'
        }
        panel.style.visibility = 'hidden'
        separated = true
      } else if (time < filmTiming.split) {
        restore()
      }
      if (separated)
        statusSource.style.setProperty('--film-status-angle', `${reducedMotion ? 0 : (time % 1_000) * 0.36}deg`)
      for (const animation of animations) {
        let end = animationEnds.get(animation)
        if (end === undefined) {
          const timing = animation.effect!.getTiming()
          if (typeof timing.duration !== 'number') throw new Error('Film animations must have a fixed duration.')
          end = (timing.delay ?? 0) + timing.duration
          animationEnds.set(animation, end)
        }
        const currentTime = reducedMotion && pickupAnimations.includes(animation) ? 0 : Math.min(time, end)
        if (animation.currentTime !== currentTime) animation.currentTime = currentTime
      }
      updateFilmPointer(document, time)
    },
    dispose() {
      restore()
      statusSource.setAttribute('data-film-status-active', 'false')
      triggerText.textContent = originalTriggerText
      trigger.removeAttribute('data-film-button')
      trigger.className = originalTriggerClass
      if (originalTriggerVariant === null) trigger.removeAttribute('data-variant')
      else trigger.setAttribute('data-variant', originalTriggerVariant)
      for (const animation of animations) animation.cancel()
      anatomy.remove()
      for (const {element, card} of cards) {
        element.removeAttribute('data-film-part')
        card.remove()
      }
      if (originalPanelStyle === null) panel.removeAttribute('style')
      else panel.setAttribute('style', originalPanelStyle)
    },
  }
}

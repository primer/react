import {useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import Label from '../../Label'
import {ThemeProvider} from '../../ThemeProvider'
import classes from './AnatomyInspector.module.css'

const foundations = {
  Trigger: 'Button',
  Overlay: 'AnchoredOverlay',
  Content: null,
  Header: null,
  Title: null,
  Description: null,
  SearchInput: 'TextInput',
  List: 'ActionList',
  Group: 'ActionList.Group',
  Item: 'ActionList.Item',
  Footer: null,
  CancelButton: 'Button',
  SubmitButton: 'Button',
  BackButton: 'Button',
  CloseButton: 'IconButton',
  Message: null,
  Loading: null,
} as const

const visuals = {
  'SearchInput.leadingVisual': {
    name: 'SearchIcon',
    parent: 'SearchInput',
    property: 'leadingVisual',
    foundation: 'TextInput',
  },
  'Trigger.trailingAction': {
    name: 'ChevronDownIcon',
    parent: 'Trigger',
    property: 'trailingAction',
    foundation: 'Button',
  },
  'Item.secondaryActions': {
    name: 'InfoIcon',
    parent: 'Item',
    property: 'secondaryActions',
    foundation: 'ActionList.TrailingVisual',
  },
  'Item.trailingVisual': {name: 'ActionList.TrailingVisual', parent: 'Item', property: null, foundation: null},
  'Item.description': {name: 'ActionList.Description', parent: 'Item', property: null, foundation: null},
} as const

export type AnatomyPart = keyof typeof foundations | keyof typeof visuals

function isVisual(part: AnatomyPart): part is keyof typeof visuals {
  return Object.hasOwn(visuals, part)
}

function isPart(name: string | null): name is AnatomyPart {
  return name !== null && (Object.hasOwn(foundations, name) || Object.hasOwn(visuals, name))
}

function getDefinition(part: AnatomyPart) {
  return isVisual(part)
    ? visuals[part]
    : {name: `SelectPanel.${part}`, foundation: foundations[part], parent: null, property: null}
}

export type AnatomyMarker = (part: AnatomyPart) => {
  'data-select-panel-part': AnatomyPart
  'data-select-panel-owner': string
}

interface Inspection {
  target: Element | null
  left: number
  top: number
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
  calloutHeight: number
  path: AnatomyPart[]
}

function getPart(element: Element): AnatomyPart | undefined {
  const name = element.getAttribute('data-select-panel-part')
  return isPart(name) ? name : undefined
}

export function AnatomyInspector({
  enabled,
  owner,
  scriptedPart,
  variant = 'default',
}: {
  enabled: boolean
  owner: string
  scriptedPart?: AnatomyPart | null
  variant?: 'default' | 'clippy'
}) {
  if (!enabled) return null
  return scriptedPart === undefined ? (
    <ActiveInspector key={owner} owner={owner} variant={variant} />
  ) : (
    <MeasuredInspector owner={owner} scriptedPart={scriptedPart} variant={variant} />
  )
}

function findPart(node: EventTarget | null, owner: string) {
  const element = node instanceof Element ? node.closest('[data-select-panel-part]') : null
  return element?.getAttribute('data-select-panel-owner') === owner && getPart(element) ? element : null
}

function ActiveInspector({owner, variant}: {owner: string; variant: 'default' | 'clippy'}) {
  const [target, setTarget] = useState<Element | null>(() =>
    typeof document === 'undefined' ? null : findPart(document.activeElement, owner),
  )
  useEffect(() => {
    let hovered: Element | null = null
    const onPointerMove = (event: PointerEvent) => {
      hovered = findPart(event.target, owner)
      // Visual slots can ignore pointer events; inspect their bounds without changing click behavior.
      for (const visual of document.querySelectorAll('[data-select-panel-part*="."]')) {
        if (
          visual.getAttribute('data-select-panel-owner') !== owner ||
          !(event.target instanceof Element) ||
          (!event.target.contains(visual) && !visual.contains(event.target))
        )
          continue
        const bounds = visual.getBoundingClientRect()
        if (
          bounds.width > 0 &&
          bounds.height > 0 &&
          event.clientX >= bounds.left &&
          event.clientX <= bounds.right &&
          event.clientY >= bounds.top &&
          event.clientY <= bounds.bottom
        ) {
          hovered = visual
        }
      }
      setTarget(hovered ?? findPart(document.activeElement, owner))
    }
    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return
      hovered = null
      setTarget(findPart(document.activeElement, owner))
    }
    const onFocus = (event: FocusEvent) => setTarget(findPart(event.target, owner))
    const onBlur = (event: FocusEvent) => setTarget(findPart(event.relatedTarget, owner) ?? hovered)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', onBlur)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', onBlur)
    }
  }, [owner])

  return <MeasuredInspector owner={owner} target={target} variant={variant} />
}

function MeasuredInspector({
  owner,
  target,
  scriptedPart,
  variant,
}: {
  owner: string
  target?: Element | null
  scriptedPart?: AnatomyPart | null
  variant: 'default' | 'clippy'
}) {
  const clippy = variant === 'clippy'
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const inspectionRef = useRef<Inspection | null>(null)
  const calloutRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!target && !scriptedPart && !clippy) return
    let animationFrame: number
    function measure() {
      const previous = inspectionRef.current
      const candidates = scriptedPart
        ? Array.from(document.querySelectorAll('[data-select-panel-part]')).filter(
            element =>
              element.getAttribute('data-select-panel-owner') === owner &&
              element.getAttribute('data-select-panel-part') === scriptedPart &&
              element.getClientRects().length > 0,
          )
        : []
      const candidate = scriptedPart === 'Overlay' ? candidates.at(-1) : scriptedPart ? candidates[0] : target
      const currentTarget = candidate?.isConnected && candidate.getClientRects().length > 0 ? candidate : null
      if (!currentTarget && !clippy) {
        if (previous) setInspection(null)
        inspectionRef.current = null
        if (scriptedPart) animationFrame = requestAnimationFrame(measure)
        return
      }
      const rect = currentTarget?.getBoundingClientRect()
      const path: AnatomyPart[] = currentTarget ? [] : (previous?.path ?? [])
      for (let element: Element | null = currentTarget; element; element = element.parentElement) {
        const part = getPart(element)
        if (part && element.getAttribute('data-select-panel-owner') === owner) path.unshift(part)
      }
      const leaf = path.at(-1)
      if (leaf && isVisual(leaf) && path[path.length - 2] !== visuals[leaf].parent) {
        path.splice(path.length - 1, 0, visuals[leaf].parent)
      }
      const next = {
        target: currentTarget,
        left: rect?.left ?? 0,
        top: rect?.top ?? 0,
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        calloutHeight: calloutRef.current?.getBoundingClientRect().height ?? 128,
        path,
      }
      if (
        !previous ||
        previous.target !== next.target ||
        previous.left !== next.left ||
        previous.top !== next.top ||
        previous.width !== next.width ||
        previous.height !== next.height ||
        previous.viewportWidth !== next.viewportWidth ||
        previous.viewportHeight !== next.viewportHeight ||
        previous.calloutHeight !== next.calloutHeight ||
        previous.path.join() !== path.join()
      ) {
        inspectionRef.current = next
        setInspection(next)
      }
      animationFrame = requestAnimationFrame(measure)
    }
    animationFrame = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, owner, scriptedPart, clippy])

  if (
    !inspection ||
    (!clippy &&
      (scriptedPart === undefined
        ? !target || inspection.target !== target
        : !scriptedPart || inspection.path.at(-1) !== scriptedPart))
  )
    return null
  const part = inspection.path.at(-1)
  const definition = part ? getDefinition(part) : undefined
  const foundation = definition?.foundation
  const gap = 20
  const badgeWidth = Math.min(280, inspection.viewportWidth - 16)
  const onRight = inspection.left + inspection.width + gap + badgeWidth <= inspection.viewportWidth - 8
  const onLeft = inspection.left - gap - badgeWidth >= 8
  const beside = !clippy && (onRight || onLeft)
  const badgeLeft = onRight
    ? inspection.left + inspection.width + gap
    : onLeft
      ? inspection.left - gap - badgeWidth
      : Math.max(8, Math.min(inspection.left, inspection.viewportWidth - badgeWidth - 8))
  const badgeTop = beside
    ? Math.max(
        8,
        Math.min(
          inspection.top + inspection.height / 2 - inspection.calloutHeight / 2,
          inspection.viewportHeight - inspection.calloutHeight - 8,
        ),
      )
    : inspection.top + inspection.height + gap + inspection.calloutHeight <= inspection.viewportHeight - 8
      ? inspection.top + inspection.height + gap
      : Math.max(8, inspection.top - gap - inspection.calloutHeight)
  const targetY = inspection.top + inspection.height / 2
  const labelY = Math.max(badgeTop + 12, Math.min(targetY, badgeTop + inspection.calloutHeight - 12))
  const startX = onRight ? inspection.left + inspection.width : inspection.left
  const endX = onRight ? badgeLeft : badgeLeft + badgeWidth
  const middleX = (startX + endX) / 2

  return createPortal(
    <ThemeProvider>
      <div className={classes.Inspector} data-variant={variant} aria-hidden="true">
        {inspection.target?.isConnected &&
        (scriptedPart === undefined ? inspection.target === target : inspection.path.at(-1) === scriptedPart) ? (
          <div
            className={classes.Highlight}
            data-anatomy-highlight=""
            style={{
              left: inspection.left,
              top: inspection.top,
              width: inspection.width,
              height: inspection.height,
            }}
          />
        ) : null}
        {beside ? (
          <svg className={classes.Connector} width="100%" height="100%" aria-hidden="true">
            <path d={`M ${startX} ${targetY} H ${middleX} V ${labelY} H ${endX}`} />
          </svg>
        ) : null}
        <div
          className={classes.Callout}
          ref={calloutRef}
          data-anatomy-callout=""
          style={clippy ? undefined : {left: badgeLeft, top: badgeTop, width: badgeWidth}}
        >
          {clippy ? <span>It looks like you&apos;re composing a picker!</span> : null}
          {definition ? (
            <Label className={classes.Name} size="large" data-anatomy-name="">
              {definition.name}
            </Label>
          ) : (
            <span>Hover or focus a part to explore its anatomy.</span>
          )}
          {foundation ? (
            <div className={classes.Foundation}>
              Built on <Label>{foundation}</Label>
            </div>
          ) : null}
          {definition?.property ? (
            <div className={classes.Foundation}>
              <Label>SelectPanel.{definition.parent}</Label>
              <span> / {definition.property}</span>
            </div>
          ) : null}
          <span className={classes.Path}>
            {inspection.path
              .map(piece => (isVisual(piece) ? (visuals[piece].property ?? visuals[piece].name) : piece))
              .join(' > ')}
          </span>
        </div>
        {clippy ? (
          <img
            className={classes.Clippy}
            data-anatomy-clippy=""
            src={new URL('./clippy.png', import.meta.url).href}
            width={122}
            height={88}
            alt=""
            draggable={false}
          />
        ) : null}
      </div>
      <span className={classes.SrOnly} role="status">
        {definition ? `${definition.name}.` : ''}
        {foundation ? ` Built on ${foundation}.` : ''}
        {definition?.property ? ` Configured with SelectPanel.${definition.parent}'s ${definition.property} prop.` : ''}
      </span>
    </ThemeProvider>,
    document.body,
  )
}

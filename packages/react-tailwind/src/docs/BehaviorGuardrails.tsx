import React from 'react'
import {ScrollableRegion} from '../components/ScrollableRegion'

export interface BuiltInBehaviorItem {
  readonly id: string
  readonly description: string
  readonly related?: readonly string[]
}

export interface DefaultBehaviorItem {
  readonly id: string
  readonly description: string
  readonly overriddenBy: readonly string[]
  readonly related?: readonly string[]
}

export interface UsageGuidelineItem {
  readonly id: string
  readonly guidance: 'do' | 'dont' | (string & {})
  readonly check: 'runtime' | 'review' | (string & {})
  readonly description: string
  readonly related?: readonly string[]
}

export interface RelatedGuardrailGroup {
  readonly sourceComponent: string
  readonly builtInBehaviors?: readonly BuiltInBehaviorItem[]
  readonly defaultBehaviors?: readonly DefaultBehaviorItem[]
  readonly usageGuidelines?: readonly UsageGuidelineItem[]
}

export interface BehaviorGuardrailsProps {
  readonly builtInBehaviors?: readonly BuiltInBehaviorItem[]
  readonly defaultBehaviors?: readonly DefaultBehaviorItem[]
  readonly usageGuidelines?: readonly UsageGuidelineItem[]
  readonly relatedGuardrails?: readonly RelatedGuardrailGroup[]
}

const pillBaseClassName =
  'primer:inline-flex primer:items-center primer:justify-center primer:rounded-full primer:px-2.5 primer:py-0.5 primer:text-xs primer:font-semibold primer:leading-4 primer:whitespace-nowrap'

function GuidancePill({guidance}: {readonly guidance: string}) {
  if (guidance === 'dont') {
    return (
      <span className={`${pillBaseClassName} primer:bg-[var(--bgColor-danger-emphasis)] primer:text-on-emphasis`}>
        Don&apos;t
      </span>
    )
  }
  return (
    <span className={`${pillBaseClassName} primer:bg-[var(--bgColor-success-emphasis)] primer:text-on-emphasis`}>
      Do
    </span>
  )
}

function CheckPill({check}: {readonly check: string}) {
  if (check === 'runtime') {
    return (
      <span
        className={`${pillBaseClassName} primer:border-thin primer:border-[var(--borderColor-attention-muted)] primer:bg-[var(--bgColor-attention-muted)] primer:text-attention`}
      >
        Runtime
      </span>
    )
  }
  return (
    <span className={`${pillBaseClassName} primer:border-thin primer:border-default primer:bg-muted primer:text-muted`}>
      Review
    </span>
  )
}

function RelatedCategoryPill({category}: {readonly category: 'built-in' | 'default' | 'do' | 'dont'}) {
  if (category === 'do' || category === 'dont') {
    return <GuidancePill guidance={category} />
  }
  if (category === 'default') {
    return (
      <span
        className={`${pillBaseClassName} primer:border-thin primer:border-default primer:bg-muted primer:text-default`}
      >
        Default
      </span>
    )
  }
  return (
    <span className={`${pillBaseClassName} primer:bg-[var(--bgColor-accent-muted)] primer:text-accent`}>Built-in</span>
  )
}

export function BehaviorGuardrails({
  builtInBehaviors,
  defaultBehaviors,
  usageGuidelines,
  relatedGuardrails,
}: BehaviorGuardrailsProps) {
  const hasBuiltIn = Boolean(builtInBehaviors && builtInBehaviors.length > 0)
  const hasDefaults = Boolean(defaultBehaviors && defaultBehaviors.length > 0)
  const orderedGuidelines =
    usageGuidelines && usageGuidelines.length > 0
      ? [
          ...usageGuidelines.filter(item => item.guidance === 'do'),
          ...usageGuidelines.filter(item => item.guidance !== 'do'),
        ]
      : []
  const hasGuidelines = orderedGuidelines.length > 0

  const nonEmptyRelated = (relatedGuardrails ?? []).filter(
    group =>
      (group.builtInBehaviors?.length ?? 0) > 0 ||
      (group.defaultBehaviors?.length ?? 0) > 0 ||
      (group.usageGuidelines?.length ?? 0) > 0,
  )
  const hasRelated = nonEmptyRelated.length > 0

  if (!hasBuiltIn && !hasDefaults && !hasGuidelines && !hasRelated) {
    return null
  }

  return (
    <div className="primer:my-6 primer:flex primer:flex-col primer:gap-6" data-component="BehaviorGuardrails">
      {hasBuiltIn && builtInBehaviors ? (
        <section>
          <h3 className="primer:m-0 primer:mb-2 primer:text-body-large primer:font-semibold primer:text-default">
            Built-in behaviors
          </h3>
          <ScrollableRegion aria-label="Built-in behaviors">
            <table>
              <caption className="primer:sr-only">Built-in behaviors</caption>
              <thead>
                <tr>
                  <th scope="col">Behavior</th>
                </tr>
              </thead>
              <tbody>
                {builtInBehaviors.map(item => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableRegion>
        </section>
      ) : null}

      {hasDefaults && defaultBehaviors ? (
        <section>
          <h3 className="primer:m-0 primer:mb-2 primer:text-body-large primer:font-semibold primer:text-default">
            Default behaviors
          </h3>
          <ScrollableRegion aria-label="Default behaviors">
            <table>
              <caption className="primer:sr-only">Default behaviors</caption>
              <thead>
                <tr>
                  <th scope="col">Behavior</th>
                  <th scope="col">Override</th>
                </tr>
              </thead>
              <tbody>
                {defaultBehaviors.map(item => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td className="primer:whitespace-nowrap">
                      {item.overriddenBy.map((prop, index) => (
                        <React.Fragment key={prop}>
                          {index > 0 ? ', ' : null}
                          <code>{prop}</code>
                        </React.Fragment>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableRegion>
        </section>
      ) : null}

      {hasGuidelines ? (
        <section>
          <h3 className="primer:m-0 primer:mb-2 primer:text-body-large primer:font-semibold primer:text-default">
            Usage guidelines
          </h3>
          <ScrollableRegion aria-label="Usage guidelines">
            <table>
              <caption className="primer:sr-only">Usage guidelines</caption>
              <thead>
                <tr>
                  <th scope="col">Guidance</th>
                  <th scope="col">Guideline</th>
                  <th scope="col">Check</th>
                </tr>
              </thead>
              <tbody>
                {orderedGuidelines.map(item => (
                  <tr key={item.id}>
                    <td>
                      <GuidancePill guidance={item.guidance} />
                    </td>
                    <td>{item.description}</td>
                    <td>
                      <CheckPill check={item.check} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableRegion>
        </section>
      ) : null}

      {hasRelated ? (
        <section>
          <h3 className="primer:m-0 primer:mb-2 primer:text-body-large primer:font-semibold primer:text-default">
            Related component guidelines
          </h3>
          <ScrollableRegion aria-label="Related component guidelines">
            <table>
              <caption className="primer:sr-only">Related component guidelines</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Type</th>
                  <th scope="col">Guideline</th>
                </tr>
              </thead>
              <tbody>
                {nonEmptyRelated.flatMap(group => [
                  ...(group.builtInBehaviors ?? []).map(item => (
                    <tr key={`${group.sourceComponent}-builtin-${item.id}`}>
                      <td>
                        <code>{group.sourceComponent}</code>
                      </td>
                      <td>
                        <RelatedCategoryPill category="built-in" />
                      </td>
                      <td>{item.description}</td>
                    </tr>
                  )),
                  ...(group.defaultBehaviors ?? []).map(item => (
                    <tr key={`${group.sourceComponent}-default-${item.id}`}>
                      <td>
                        <code>{group.sourceComponent}</code>
                      </td>
                      <td>
                        <RelatedCategoryPill category="default" />
                      </td>
                      <td>{item.description}</td>
                    </tr>
                  )),
                  ...(group.usageGuidelines ?? []).map(item => (
                    <tr key={`${group.sourceComponent}-guideline-${item.id}`}>
                      <td>
                        <code>{group.sourceComponent}</code>
                      </td>
                      <td>
                        <RelatedCategoryPill category={item.guidance === 'dont' ? 'dont' : 'do'} />
                      </td>
                      <td>{item.description}</td>
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          </ScrollableRegion>
        </section>
      ) : null}
    </div>
  )
}

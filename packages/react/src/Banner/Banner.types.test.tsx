import {Banner} from '../Banner'

export function supportsLeadingVisualForInfoAndUpsellVariants() {
  return (
    <>
      <Banner title="Info" leadingVisual={<span />} />
      <Banner title="Info" variant="info" leadingVisual={<span />} />
      <Banner title="Upsell" variant="upsell" leadingVisual={<span />} />
    </>
  )
}

export function doesNotSupportLeadingVisualForDefaultVisualVariants() {
  return (
    <>
      {/* @ts-expect-error leadingVisual is only supported for info and upsell variants */}
      <Banner title="Critical" variant="critical" leadingVisual={<span />} />
      {/* @ts-expect-error leadingVisual is only supported for info and upsell variants */}
      <Banner title="Success" variant="success" leadingVisual={<span />} />
      {/* @ts-expect-error leadingVisual is only supported for info and upsell variants */}
      <Banner title="Warning" variant="warning" leadingVisual={<span />} />
    </>
  )
}

export function doesNotSupportIconForDefaultVisualVariants() {
  return (
    <>
      {/* @ts-expect-error icon is only supported for info and upsell variants */}
      <Banner title="Critical" variant="critical" icon={<span />} />
      {/* @ts-expect-error icon is only supported for info and upsell variants */}
      <Banner title="Success" variant="success" icon={<span />} />
      {/* @ts-expect-error icon is only supported for info and upsell variants */}
      <Banner title="Warning" variant="warning" icon={<span />} />
    </>
  )
}

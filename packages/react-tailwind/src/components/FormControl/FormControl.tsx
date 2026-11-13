'use client'

import {Field} from '@base-ui/react/field'
import {useFieldRootContext} from '@base-ui/react/internals/field-root-context'
import {NOOP} from '@base-ui/react/internals/noop'
import {useRender} from '@base-ui/react/use-render'
import React from 'react'
import {useChoiceGroupContext} from '../../internal/choiceGroupContext'
import {cn} from '../../internal/cn'
import {
  isFormControlInput,
  markFormControlInput,
  usesBaseUiAccessibleLabel,
  usesBaseUiControlId,
} from '../../internal/formControlParts'
import {joinIdRefs} from '../../internal/idRefs'
import {mergeClassName} from '../../internal/mergeClassName'
import {isPartOf, regionElements, resolveRegions} from '../../internal/regions'
import {ValidationMessage} from '../../internal/ValidationMessage'
import type {RegionProps} from '../../utils/types'
import {Checkbox} from '../Checkbox/Checkbox'
import {Radio} from '../Radio/Radio'
import {
  FormControlContextProvider,
  FormControlValidationStatusProvider,
  useFormControlContext,
  useFormControlForwardedProps,
  useFormControlLabelId,
} from './useFormControlForwardedProps'

export interface FormControlProps
  extends Omit<Field.Root.Props, 'className' | 'data-component'>,
    RegionProps<'label' | 'caption' | 'validation' | 'leadingVisual'> {
  className?: Field.Root.Props['className']
  /**
   * Whether the label sits above the control or beside it. Defaults to `horizontal` when a direct child is a
   * `Checkbox` or `Radio`, and `vertical` otherwise.
   */
  layout?: 'horizontal' | 'vertical'
  /** Marks the field required, which is reflected on the control and shown on the label. */
  required?: boolean
}

const FormControlLayoutContext = React.createContext<FormControlProps['layout']>('vertical')
const FormControlBaseLabelContext = React.createContext(false)

function isChoiceInput(child: React.ReactElement): child is React.ReactElement {
  return child.type === Checkbox || child.type === Radio
}

function omitOverriddenParts(children: React.ReactNode, parts: readonly React.ElementType[]): React.ReactNode {
  return React.Children.map(children, child => {
    if (!React.isValidElement<{children?: React.ReactNode}>(child)) return child
    if ((child.type === React.Fragment || typeof child.type === 'string') && child.props.children !== undefined) {
      return React.cloneElement(child, {children: omitOverriddenParts(child.props.children, parts)})
    }
    return parts.some(part => part === child.type) ? null : child
  })
}

function findFieldParts(children: React.ReactNode): React.ReactElement[] {
  const parts: React.ReactElement[] = []
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<{children?: React.ReactNode}>(child)) continue
    if (child.type === React.Fragment || typeof child.type === 'string') {
      parts.push(...findFieldParts(child.props.children))
    } else {
      parts.push(child)
    }
  }
  return parts
}

function getRegionElement<Props>(
  region: React.ReactNode,
  part: React.ElementType,
): React.ReactElement<Props> | undefined {
  const elements = regionElements<Props>(findFieldParts(region), [])
  return elements.find(element => element.type === part) ?? regionElements<Props>(region, [])[0]
}

function getRegionId(element: React.ReactElement<{id?: string}> | undefined, defaultId: string): string | undefined {
  if (!element) return undefined
  return element.props.id ?? (typeof element.type === 'string' ? undefined : defaultId)
}

function prepareDescriptionRegion(
  region: React.ReactNode,
  part: React.ElementType,
  defaultId: string,
): React.ReactNode {
  if (typeof region === 'string' || typeof region === 'number' || typeof region === 'bigint') {
    return <span id={defaultId}>{region}</span>
  }
  if (React.isValidElement<{children?: React.ReactNode}>(region) && region.type === React.Fragment) {
    const children = React.Children.toArray(region.props.children)
    if (children.length === 1) {
      return React.cloneElement(region, {children: prepareDescriptionRegion(children[0], part, defaultId)})
    }
  }
  if (
    React.isValidElement<{id?: string}>(region) &&
    typeof region.type === 'string' &&
    region.props.id === undefined &&
    getRegionElement(region, part)?.type !== part
  ) {
    return React.cloneElement(region, {id: defaultId})
  }
  return region
}

const Root = React.forwardRef<HTMLDivElement, FormControlProps>(function FormControl(
  {
    caption: captionProp,
    children,
    className,
    id: idProp,
    label: labelProp,
    layout: layoutProp,
    leadingVisual: leadingVisualProp,
    required = false,
    validation: validationProp,
    ...rest
  },
  ref,
) {
  const generatedId = React.useId()
  const fieldParts = findFieldParts(children)
  const {regions, matched: fieldMatches} = resolveRegions(
    fieldParts,
    {
      label: {match: isPartOf(Label)},
      caption: {match: isPartOf(Caption)},
      validation: {match: isPartOf(Validation)},
      control: {match: isFormControlInput, multiple: true, keep: true},
    },
    {label: labelProp, caption: captionProp, validation: validationProp},
  )
  const {regions: directRegions, matched: directMatches} = resolveRegions(
    children,
    {
      label: {match: isPartOf(Label), keep: true},
      leadingVisual: {match: isPartOf(LeadingVisual), keep: true},
      control: {match: isFormControlInput, multiple: true, keep: true},
    },
    {label: labelProp, leadingVisual: leadingVisualProp},
  )
  const primaryControl = directMatches.control.at(0) ?? fieldMatches.control.at(0)
  const controlId = primaryControl?.props.id ?? idProp ?? generatedId
  const baseUiLabel = primaryControl ? usesBaseUiControlId(primaryControl) : false
  const labelRegion = getRegionElement<FormControlLabelProps>(regions.label, Label)
  const preparedCaptionProp = prepareDescriptionRegion(captionProp, Caption, `${controlId}-caption`)
  const preparedValidationProp = prepareDescriptionRegion(validationProp, Validation, `${controlId}-validation`)
  const captionRegion = getRegionElement<FormControlCaptionProps>(preparedCaptionProp ?? regions.caption, Caption)
  const validationRegion = getRegionElement<FormControlValidationProps>(
    preparedValidationProp ?? regions.validation,
    Validation,
  )
  const labelId =
    labelRegion && (labelRegion.type === Label || labelRegion.props.id !== undefined)
      ? (labelRegion.props.id ?? `${controlId}-label`)
      : undefined
  const accessibleLabelId = primaryControl && usesBaseUiAccessibleLabel(primaryControl) ? labelId : undefined
  const layout = layoutProp ?? (directMatches.control.some(isChoiceInput) ? 'horizontal' : 'vertical')
  const hasLeadingVisual = directRegions.leadingVisual !== undefined
  const validationStatus = validationRegion?.props.variant
  const hasErrorValidation = validationStatus === 'error'
  const captionId = getRegionId(captionRegion, `${controlId}-caption`)
  const validationId = getRegionId(validationRegion, `${controlId}-validation`)
  const describedBy = joinIdRefs(validationId, captionId)
  const directLabel = regionElements<FormControlLabelProps>(directRegions.label, []).find(
    element => element.type === Label,
  )
  const isLabelHidden = directLabel?.props.visuallyHidden === true
  // A visually hidden label leaves the flow, so it must not push the following control down.
  const verticalLayoutClassName = cn(
    'primer:flex primer:flex-col primer:items-start',
    isLabelHidden ? 'primer:[&>*:not(label)+*]:mt-1' : 'primer:[&>*+*]:mt-1',
  )
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Root.State) =>
          cn(
            layout === 'horizontal'
              ? cn(
                  "primer:grid primer:gap-0 primer:[&>input]:mx-0 primer:[&>[data-component='Checkbox']]:col-start-1 primer:[&>[data-component='Checkbox']]:row-start-1 primer:[&>[data-component='Radio']]:col-start-1 primer:[&>[data-component='Radio']]:row-start-1 primer:[&>[data-component='FormControl.Caption']]:row-start-2 primer:[&>[data-component='FormControl.Label']]:row-start-1 primer:[&>[data-component='FormControl.LeadingVisual']]:col-start-2 primer:[&>[data-component='FormControl.LeadingVisual']]:row-start-1 primer:[&>[data-component='FormControl.Validation']]:row-start-3",
                  hasLeadingVisual
                    ? "primer:grid-cols-[auto_auto_minmax(0,1fr)] primer:items-center primer:[&>[data-component='FormControl.Caption']]:col-start-3 primer:[&>[data-component='FormControl.Label']]:col-start-3 primer:[&>[data-component='FormControl.Validation']]:col-start-3"
                    : "primer:grid-cols-[auto_minmax(0,1fr)] primer:items-start primer:[&>[data-component='FormControl.Caption']]:col-start-2 primer:[&>[data-component='FormControl.Label']]:col-start-2 primer:[&>[data-component='FormControl.Validation']]:col-start-2",
                )
              : verticalLayoutClassName,
            className(state),
          )
      : cn(
          layout === 'horizontal'
            ? cn(
                "primer:grid primer:gap-0 primer:[&>input]:mx-0 primer:[&>[data-component='Checkbox']]:col-start-1 primer:[&>[data-component='Checkbox']]:row-start-1 primer:[&>[data-component='Radio']]:col-start-1 primer:[&>[data-component='Radio']]:row-start-1 primer:[&>[data-component='FormControl.Caption']]:row-start-2 primer:[&>[data-component='FormControl.Label']]:row-start-1 primer:[&>[data-component='FormControl.LeadingVisual']]:col-start-2 primer:[&>[data-component='FormControl.LeadingVisual']]:row-start-1 primer:[&>[data-component='FormControl.Validation']]:row-start-3",
                hasLeadingVisual
                  ? "primer:grid-cols-[auto_auto_minmax(0,1fr)] primer:items-center primer:[&>[data-component='FormControl.Caption']]:col-start-3 primer:[&>[data-component='FormControl.Label']]:col-start-3 primer:[&>[data-component='FormControl.Validation']]:col-start-3"
                  : "primer:grid-cols-[auto_minmax(0,1fr)] primer:items-start primer:[&>[data-component='FormControl.Caption']]:col-start-2 primer:[&>[data-component='FormControl.Label']]:col-start-2 primer:[&>[data-component='FormControl.Validation']]:col-start-2",
              )
            : verticalLayoutClassName,
          className,
        )
  const choiceGroup = useChoiceGroupContext()
  // Base UI disables the nested Field itself; the context also mutes parts such as the leading visual.
  const disabled = rest.disabled || choiceGroup?.disabled
  const context = React.useMemo(
    () => ({
      controlProps: {
        'aria-describedby': describedBy,
        'aria-invalid': hasErrorValidation || undefined,
        'aria-labelledby': accessibleLabelId,
        disabled,
        id: controlId,
        name: rest.name,
        required,
      },
      labelId,
    }),
    [accessibleLabelId, controlId, describedBy, disabled, hasErrorValidation, labelId, required, rest.name],
  )

  const overriddenParts = [
    ...(leadingVisualProp == null ? [] : [LeadingVisual]),
    ...(labelProp == null ? [] : [Label]),
    ...(captionProp == null ? [] : [Caption]),
    ...(validationProp == null ? [] : [Validation]),
  ]
  const content = (
    <>
      {leadingVisualProp}
      {labelProp}
      {omitOverriddenParts(children, overriddenParts)}
      {preparedCaptionProp}
      {preparedValidationProp}
    </>
  )

  return (
    <FormControlLayoutContext.Provider value={layout}>
      <FormControlBaseLabelContext.Provider value={baseUiLabel}>
        <FormControlContextProvider value={context}>
          <FormControlValidationStatusProvider value={validationStatus}>
            <Field.Root
              {...rest}
              ref={ref}
              data-component="FormControl"
              data-layout={layout}
              data-required={required || undefined}
              className={mergedClassName}
            >
              {content}
            </Field.Root>
          </FormControlValidationStatusProvider>
        </FormControlContextProvider>
      </FormControlBaseLabelContext.Provider>
    </FormControlLayoutContext.Provider>
  )
})

export interface FormControlLabelProps extends Omit<Field.Label.Props, 'className' | 'data-component'> {
  className?: Field.Label.Props['className']
  /** Hides the label visually while keeping it available to assistive technology. */
  visuallyHidden?: boolean
  /** Shows the required marker. Set `false` to keep the field required without marking it. */
  requiredIndicator?: boolean
  /** Text used for the required marker in place of the default. */
  requiredText?: string
}

function FormControlLabel(
  {
    children,
    className,
    htmlFor,
    id,
    nativeLabel = true,
    requiredIndicator = true,
    requiredText,
    visuallyHidden,
    ...rest
  }: FormControlLabelProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const context = useFormControlContext()
  const contextLabelId = useFormControlLabelId()
  const layout = React.useContext(FormControlLayoutContext)
  const baseUiLabel = React.useContext(FormControlBaseLabelContext)
  const labelFor = !nativeLabel
    ? undefined
    : baseUiLabel && (htmlFor === undefined || htmlFor === context?.id)
      ? undefined
      : (htmlFor ?? context?.id)
  const labelId = id ?? contextLabelId
  const indicatorText = requiredText ?? (context?.required ? '*' : undefined)
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Label.State) =>
          cn(
            'primer:block primer:text-sm primer:text-default primer:data-[disabled]:text-[var(--control-fgColor-disabled)]',
            layout === 'horizontal' ? 'primer:pl-2 primer:font-normal' : 'primer:font-semibold',
            visuallyHidden && 'primer:sr-only',
            className(state),
          )
      : cn(
          'primer:block primer:text-sm primer:text-default primer:data-[disabled]:text-[var(--control-fgColor-disabled)]',
          layout === 'horizontal' ? 'primer:pl-2 primer:font-normal' : 'primer:font-semibold',
          visuallyHidden && 'primer:sr-only',
          className,
        )

  return (
    <Field.Label
      {...rest}
      {...(labelFor === undefined ? {} : {htmlFor: labelFor})}
      {...(labelId === undefined ? {} : {id: labelId})}
      nativeLabel={nativeLabel}
      ref={ref}
      data-component="FormControl.Label"
      className={mergedClassName}
    >
      {indicatorText ? (
        <span className="primer:flex primer:gap-1">
          <span>{children}</span>
          <span aria-hidden={requiredIndicator ? undefined : true}>{indicatorText}</span>
        </span>
      ) : (
        children
      )}
    </Field.Label>
  )
}
const Label = React.forwardRef<HTMLElement, FormControlLabelProps>(FormControlLabel)

export interface FormControlCaptionProps extends Omit<Field.Description.Props, 'className' | 'data-component'> {
  className?: Field.Description.Props['className']
}
const Caption = React.forwardRef<HTMLParagraphElement, FormControlCaptionProps>(function Caption(
  {className, id, ...rest},
  ref,
) {
  const context = useFormControlContext()
  const layout = React.useContext(FormControlLayoutContext)
  const mergedClassName =
    typeof className === 'function'
      ? (state: Field.Description.State) =>
          cn(
            'primer:m-0 primer:text-xs primer:leading-[18px] primer:text-muted primer:data-[disabled]:text-disabled',
            layout === 'horizontal' && 'primer:pl-2',
            className(state),
          )
      : cn(
          'primer:m-0 primer:text-xs primer:leading-[18px] primer:text-muted primer:data-[disabled]:text-disabled',
          layout === 'horizontal' && 'primer:pl-2',
          className,
        )

  return (
    <Field.Description
      {...rest}
      ref={ref}
      id={id ?? (context?.id ? `${context.id}-caption` : undefined)}
      data-component="FormControl.Caption"
      className={mergedClassName}
    />
  )
})

export interface FormControlValidationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'data-component'> {
  className?: string
  /** Whether the message reports a problem or confirms success. */
  variant: 'error' | 'success'
}
const Validation = React.forwardRef<HTMLDivElement, FormControlValidationProps>(function Validation(
  {children, className, id, variant, ...rest},
  ref,
) {
  const context = useFormControlContext()
  const field = useFieldRootContext()
  const validationClassName = ValidationMessage.getClassName(variant, className)
  const validationId = id ?? (context?.id ? `${context.id}-validation` : undefined)
  const content = <ValidationMessage variant={variant}>{children}</ValidationMessage>

  // Base UI uses this same sentinel to distinguish its default context from a Field.Root provider.
  if (variant === 'success' || field.setValidityData === NOOP) {
    return (
      <div
        {...rest}
        ref={ref}
        id={validationId}
        role={variant === 'success' ? 'status' : rest.role}
        data-component="FormControl.Validation"
        data-variant={variant}
        className={validationClassName}
      >
        {content}
      </div>
    )
  }

  return (
    <Field.Error
      {...rest}
      ref={ref}
      id={validationId}
      match
      data-component="FormControl.Validation"
      data-variant={variant}
      className={validationClassName}
    >
      {content}
    </Field.Error>
  )
})

export type FormControlLeadingVisualProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'data-component'>
const LeadingVisual = React.forwardRef<HTMLDivElement, FormControlLeadingVisualProps>(function LeadingVisual(
  {className, ...rest},
  ref,
) {
  const context = useFormControlContext()

  return (
    <div
      {...rest}
      ref={ref}
      data-component="FormControl.LeadingVisual"
      data-control-disabled={context?.disabled || undefined}
      className={cn(
        'primer:ml-2 primer:flex primer:shrink-0 primer:items-center primer:leading-none primer:[&>*]:min-h-4 primer:[&>*]:min-w-4 primer:[&>*]:fill-current',
        // The visual grows to sit beside a label and caption, even when they share a wrapper.
        "primer:[[data-component='FormControl']:has([data-component='FormControl.Caption'])_&>*]:min-h-6 primer:[[data-component='FormControl']:has([data-component='FormControl.Caption'])_&>*]:min-w-6",
        context?.disabled ? 'primer:text-[var(--control-fgColor-disabled)]' : 'primer:text-default',
        className,
      )}
    />
  )
})

export type FormControlControlProps = Omit<Field.Control.Props, 'data-component'>
const Control = React.forwardRef<HTMLElement, FormControlControlProps>(function Control({render, ...props}, ref) {
  const forwardedProps = useFormControlForwardedProps(props)
  return (
    <Field.Control
      {...forwardedProps}
      ref={ref}
      data-component="FormControl.Control"
      className={mergeClassName(
        'primer:m-0 primer:h-8 primer:appearance-none primer:rounded-md primer:border-thin primer:border-[var(--control-borderColor-rest)] primer:bg-default primer:px-3 primer:text-sm primer:leading-5 primer:text-default primer:shadow-[var(--shadow-inset)] primer:placeholder:text-muted primer:disabled:cursor-not-allowed primer:disabled:border-[var(--control-borderColor-disabled)] primer:disabled:bg-[var(--control-bgColor-disabled)] primer:disabled:text-disabled primer:disabled:shadow-none primer:focus:border-accent-emphasis primer:focus:outline-2 primer:focus:outline-offset-[-1px] primer:focus:outline-[var(--borderColor-accent-emphasis)] primer:aria-invalid:border-danger-emphasis primer:aria-invalid:focus:border-[var(--control-borderColor-danger)] primer:aria-invalid:focus:outline-[var(--control-borderColor-danger)]',
        props.className,
      )}
      render={(elementProps, state) => (
        <ControlElement {...elementProps} controlId={forwardedProps.id} render={render} state={state} />
      )}
    />
  )
})

interface ControlElementProps extends React.HTMLAttributes<HTMLElement> {
  controlId?: string
  render: FormControlControlProps['render']
  state: Field.Control.State
}

const ControlElement = React.forwardRef<HTMLElement, ControlElementProps>(function ControlElement(
  {controlId, render, state, ...props},
  ref,
) {
  return useRender<Record<string, unknown>, HTMLElement>({
    defaultTagName: 'input',
    render: typeof render === 'function' ? elementProps => render(elementProps, state) : render,
    // Field.Control registers an explicit ID after hydration; use it for the initial HTML too.
    props: {...props, id: controlId ?? props.id},
    ref,
  })
})

markFormControlInput(Control)

/**
 * A Field.Root config component with composable label, caption, validation, and visual pieces.
 * Compose its children in the needed semantic order; region props replace matching children.
 */
export const FormControl = Object.assign(Root, {Label, Caption, Validation, LeadingVisual, Control})

import {XIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import type React from 'react'

import {AnchoredOverlay} from '../AnchoredOverlay'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {Banner} from '../Banner'
import {IconButton} from '../Button'
import {FilteredActionList} from '../FilteredActionList'
import type {FilteredActionListProps, ItemProps} from '../FilteredActionList'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import Heading from '../Heading'
import classes from './SelectPanel.module.css'
import {SelectPanelNextFooter} from './SelectPanelNextFooter'
import type {SelectPanelListProps, SelectPanelProps} from './SelectPanel.shared'
import type {FooterLayout} from './SelectPanelNext.shared.utils'

type SelectPanelNextFrameListProps = Omit<SelectPanelListProps, 'items' | 'onFilterChange'>

interface SelectPanelNextFrameProps {
  align: SelectPanelProps['align']
  anchorId: SelectPanelProps['id']
  anchorRef: React.RefObject<HTMLElement | null>
  className: SelectPanelProps['className']
  closeButtonProps: Record<string, string>
  currentResponsiveVariant: 'anchored' | 'fullscreen'
  displayInViewport: SelectPanelProps['displayInViewport']
  filterValue: string
  focusPrependedElements: SelectPanelProps['focusPrependedElements']
  focusZoneSettings: Partial<FocusZoneHookSettings>
  focusTrapSettings: {initialFocusRef?: React.RefObject<HTMLInputElement | null>}
  footer: SelectPanelProps['footer']
  footerLayout: FooterLayout
  fullScreenOnNarrow: boolean
  height: SelectPanelProps['height']
  isNarrowScreenSize: boolean
  itemsToRender: ItemProps[]
  listProps: SelectPanelNextFrameListProps
  loading: boolean
  loadingType: FilteredActionListProps['loadingType']
  mergedOverlayProps: SelectPanelProps['overlayProps']
  message: SelectPanelProps['message']
  notice: SelectPanelProps['notice']
  noticeRef: React.RefObject<HTMLDivElement>
  onCancel: SelectPanelProps['onCancel']
  onCancelRequested: () => void
  onClose: AnchoredOverlayProps['onClose']
  onFilterChange: FilteredActionListProps['onFilterChange']
  onInputRefChanged: (ref: React.RefObject<HTMLInputElement | null>) => void
  onListContainerRefChanged: (node: HTMLElement | null) => void
  onOpen: AnchoredOverlayProps['onOpen']
  onSave: () => void
  onSelectAllChange?: (checked: boolean) => void
  open: boolean
  placeholderText: string
  renderAnchor: AnchoredOverlayProps['renderAnchor']
  renderedMessage: React.ReactNode
  responsiveOverlayVariant: AnchoredOverlayProps['variant']
  secondaryAction: SelectPanelProps['secondaryAction']
  selectionVariant: 'single' | 'multiple' | 'radio'
  showXCloseIcon: boolean
  subtitle: SelectPanelProps['subtitle']
  subtitleId: string
  textInputProps: FilteredActionListProps['textInputProps']
  title: SelectPanelProps['title']
  titleId: string
  variant: SelectPanelProps['variant']
  virtualized: SelectPanelProps['virtualized']
  width: SelectPanelProps['width']
}

const EMPTY_MESSAGE = {
  title: 'No items available',
  description: '',
}

export function SelectPanelNextFrame({
  align,
  anchorId,
  anchorRef,
  className,
  closeButtonProps,
  currentResponsiveVariant,
  displayInViewport,
  filterValue,
  focusPrependedElements,
  focusZoneSettings,
  focusTrapSettings,
  footer,
  footerLayout,
  fullScreenOnNarrow,
  height,
  isNarrowScreenSize,
  itemsToRender,
  listProps,
  loading,
  loadingType,
  mergedOverlayProps,
  message,
  notice,
  noticeRef,
  onCancel,
  onCancelRequested,
  onClose,
  onFilterChange,
  onInputRefChanged,
  onListContainerRefChanged,
  onOpen,
  onSave,
  onSelectAllChange,
  open,
  placeholderText,
  renderAnchor,
  renderedMessage,
  responsiveOverlayVariant,
  secondaryAction,
  selectionVariant,
  showXCloseIcon,
  subtitle,
  subtitleId,
  textInputProps,
  title,
  titleId,
  variant,
  virtualized,
  width,
}: SelectPanelNextFrameProps) {
  return (
    <>
      <AnchoredOverlay
        renderAnchor={renderAnchor}
        anchorRef={anchorRef}
        align={align}
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        overlayProps={mergedOverlayProps}
        focusTrapSettings={focusTrapSettings}
        focusZoneSettings={focusZoneSettings}
        height={height}
        width={width}
        anchorId={anchorId}
        variant={responsiveOverlayVariant}
        pinPosition={!height}
        className={classes.Overlay}
        displayCloseButton={showXCloseIcon}
        closeButtonProps={closeButtonProps}
        displayInViewport={displayInViewport}
      >
        <div className={classes.Wrapper} data-variant={variant}>
          <div className={classes.Header} data-variant={currentResponsiveVariant}>
            <div>
              <Heading as="h1" id={titleId} className={classes.Title}>
                {title}
              </Heading>
              {subtitle ? (
                <div id={subtitleId} className={classes.Subtitle}>
                  {subtitle}
                </div>
              ) : null}
            </div>
            {variant === 'modal' && !isNarrowScreenSize ? (
              <IconButton
                type="button"
                variant="invisible"
                icon={XIcon}
                aria-label="Cancel and close"
                className={classes.ResponsiveCloseButton}
                onClick={() => {
                  onCancel?.()
                  onCancelRequested()
                }}
              />
            ) : null}
          </div>
          {notice ? (
            <div ref={noticeRef}>
              <Banner
                variant={notice.variant === 'error' ? 'critical' : notice.variant}
                description={notice.text}
                title="Notice"
                hideTitle
                className={classes.Notice}
                layout="compact"
              />
            </div>
          ) : null}
          <FilteredActionList
            filterValue={filterValue}
            onFilterChange={onFilterChange}
            onInputRefChanged={onInputRefChanged}
            onListContainerRefChanged={onListContainerRefChanged}
            placeholderText={placeholderText}
            {...listProps}
            variant={listProps.groupMetadata?.length ? 'horizontal-inset' : 'inset'}
            role="listbox"
            aria-labelledby={listProps['aria-label'] ? undefined : titleId}
            aria-multiselectable={selectionVariant === 'multiple' ? 'true' : 'false'}
            selectionVariant={selectionVariant}
            items={itemsToRender}
            textInputProps={textInputProps}
            loading={loading}
            loadingType={loadingType}
            onSelectAllChange={onSelectAllChange}
            message={renderedMessage}
            messageText={{
              title: message?.title || EMPTY_MESSAGE.title,
              description: typeof message?.body === 'string' ? message.body : EMPTY_MESSAGE.description,
            }}
            fullScreenOnNarrow={fullScreenOnNarrow}
            className={clsx(className, classes.FilteredActionList)}
            focusPrependedElements={focusPrependedElements}
            virtualized={virtualized}
          />
          <SelectPanelNextFooter
            footer={footer}
            footerLayout={footerLayout}
            onCancel={onCancel}
            onCancelRequested={onCancelRequested}
            onSave={onSave}
            secondaryAction={secondaryAction}
            usingFullScreenOnNarrow={fullScreenOnNarrow}
            variant={variant}
          />
        </div>
      </AnchoredOverlay>
      {variant === 'modal' && open ? <div className={classes.Backdrop} /> : null}
    </>
  )
}

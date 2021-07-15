export interface Colors {
  auto: Auto
  text: Text
  icon: Icon
  border: Border
  bg: Bg
  state: State
  fade: Fade
  alert: Alert
  autocomplete: Autocomplete
  blankslate: Blankslate
  btn: Btn
  counter: Counter
  label: Label
  input: Input
  avatar: Avatar
  toast: Toast
  timeline: Timeline
  selectMenu: SelectMenu
  box: Box
  branchName: BranchName
  markdown: Markdown
  menu: Menu
  sidenav: Sidenav
  header: Header
  filterItem: FilterItem
  hiddenTextExpander: HiddenTextExpander
  dragAndDrop: FocusOrDragAndDropOrPreviewableCommentForm
  uploadEnabled: UploadEnabled
  previewableCommentForm: FocusOrDragAndDropOrPreviewableCommentForm
  underlinenav: Underlinenav
  verifiedBadge: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  socialCount: SocialCount
  tooltip: PrimaryOrSecondaryOrTooltipOrHighlight
  headerSearch: HeaderSearch
  searchKeyword: SearchKeyword
  diffstat: Diffstat
  mktg: Mktg
  filesExplorerIcon: string
  hlAuthorBg: string
  hlAuthorBorder: string
  logoSubdued: string
  discussionBorder: string
  discussionBgSuccess: string
  actionsWorkflowTableStickyBg: string
  repoLanguageColorBorder: string
  codeSelectionBg: string
  highlight: PrimaryOrSecondaryOrTooltipOrHighlight
  blob: Blob
  diff: Diff
  diffBlob: DiffBlob
  globalNav: GlobalNav
  footerInvertocat: FooterInvertocat
  prState: PrState
  topicTag: TopicTag
  mergeBox: MergeBox
  project: Project
  checks: Checks
  introShelf: IntroShelf
  marketingIcon: MarketingIcon
  prettylights: Prettylights
  codemirror: Codemirror
  ansi: Ansi
}
export interface Auto {
  black: string
  white: string
  gray?: string[] | null
  blue?: string[] | null
  green?: string[] | null
  yellow?: string[] | null
  orange?: string[] | null
  red?: string[] | null
  purple?: string[] | null
  pink?: string[] | null
}
export interface Text {
  primary: string
  secondary: string
  tertiary: string
  placeholder: string
  disabled: string
  inverse: string
  link: string
  danger: string
  success: string
  warning: string
  white: string
}
export interface Icon {
  primary: string
  secondary: string
  tertiary: string
  info: string
  danger: string
  success: string
  warning: string
}
export interface Border {
  primary: string
  secondary: string
  tertiary: string
  overlay: string
  inverse: string
  info: string
  danger: string
  success: string
  warning: string
}
export interface Bg {
  canvas: string
  canvasMobile: string
  canvasInverse: string
  canvasInset: string
  primary: string
  secondary: string
  tertiary: string
  overlay: string
  backdrop: string
  info: string
  infoInverse: string
  danger: string
  dangerInverse: string
  success: string
  successInverse: string
  warning: string
  warningInverse: string
}
export interface State {
  hover: Hover
  selected: Selected
  focus: FocusOrDragAndDropOrPreviewableCommentForm
}
export interface Hover {
  primaryBg: string
  primaryBorder: string
  primaryText: string
  primaryIcon: string
  secondaryBg: string
  secondaryBorder: string
}
export interface Selected {
  primaryBg: string
  primaryBorder: string
  primaryText: string
  primaryIcon: string
}
export interface FocusOrDragAndDropOrPreviewableCommentForm {
  border: string
}
export interface Fade {
  fg10: string
  fg15: string
  fg30: string
  fg50: string
  fg70: string
  fg85: string
  black10: string
  black15: string
  black30: string
  black50: string
  black70: string
  black85: string
  white10: string
  white15: string
  white30: string
  white50: string
  white70: string
  white85: string
}
export interface Alert {
  info: InfoOrWarnOrErrorOrSuccess
  warn: InfoOrWarnOrErrorOrSuccess
  error: InfoOrWarnOrErrorOrSuccess
  success: InfoOrWarnOrErrorOrSuccess
}
export interface InfoOrWarnOrErrorOrSuccess {
  text: string
  icon: string
  bg: string
  border: string
}
export interface Autocomplete {
  rowBorder: string
}
export interface Blankslate {
  icon: string
}
export interface Btn {
  text: string
  bg: string
  border: string
  hoverBg: string
  hoverBorder: string
  activeBg: string
  activeBorder: string
  selectedBg: string
  focusBg: string
  focusBorder: string
  counterBg: string
  primary: Primary
  outline: Outline
  danger: Danger
}
export interface Primary {
  text: string
  bg: string
  border: string
  hoverBg: string
  hoverBorder: string
  selectedBg: string
  disabledText: string
  disabledBg: string
  disabledBorder: string
  focusBg: string
  focusBorder: string
  icon: string
  counterBg: string
}
export interface Outline {
  text: string
  hoverText: string
  hoverBg: string
  hoverBorder: string
  hoverCounterBg: string
  selectedText: string
  selectedBg: string
  selectedBorder: string
  disabledText: string
  disabledBg: string
  disabledCounterBg: string
  focusBorder: string
  counterBg: string
}
export interface Danger {
  text: string
  hoverText: string
  hoverBg: string
  hoverBorder: string
  hoverCounterBg: string
  selectedText: string
  selectedBg: string
  selectedBorder: string
  disabledText: string
  disabledBg: string
  disabledCounterBg: string
  focusBorder: string
  counterBg: string
  icon: string
  hoverIcon: string
}
export interface Counter {
  text: string
  bg: string
  primary: PrimaryOrSecondaryOrTooltipOrHighlight
  secondary: PrimaryOrSecondaryOrTooltipOrHighlight
}
export interface PrimaryOrSecondaryOrTooltipOrHighlight {
  text: string
  bg: string
}
export interface Label {
  border: string
  primary: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
  secondary: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
  info: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
  success: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
  warning: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
  danger: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
  orange: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
}
export interface PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover {
  text: string
  border: string
}
export interface Input {
  bg: string
  contrastBg: string
  border: string
  disabledBg: string
  disabledBorder: string
  warningBorder: string
  errorBorder: string
  tooltip: Tooltip
}
export interface Tooltip {
  success: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  warning: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  error: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
}
export interface SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge {
  text: string
  bg: string
  border: string
}
export interface Avatar {
  bg: string
  border: string
  stackFade: string
  stackFadeMore: string
}
export interface Toast {
  text: string
  bg: string
  border: string
  icon: string
  iconBg: string
  iconBorder: string
  success: SuccessOrWarningOrDangerOrLoading
  warning: SuccessOrWarningOrDangerOrLoading
  danger: SuccessOrWarningOrDangerOrLoading
  loading: SuccessOrWarningOrDangerOrLoading
}
export interface SuccessOrWarningOrDangerOrLoading {
  text: string
  border: string
  icon: string
  iconBg: string
  iconBorder: string
}
export interface Timeline {
  text: string
  badgeBg: string
  badgeSuccessBorder: string
  targetBadgeBorder: string
  targetBadgeShadow: string
}
export interface SelectMenu {
  borderSecondary: string
  backdropBg: string
  backdropBorder: string
  tapHighlight: string
  tapFocusBg: string
}
export interface Box {
  blueBorder: string
  rowYellowBg: string
  rowBlueBg: string
  headerBlueBg: string
  headerBlueBorder: string
  borderInfo: string
  bgInfo: string
  borderWarning: string
  bgWarning: string
}
export interface BranchName {
  text: string
  icon: string
  bg: string
  link: Link
}
export interface Link {
  text: string
  icon: string
  bg: string
}
export interface Markdown {
  codeBg: string
  frameBorder: string
  blockquoteBorder: string
  tableBorder: string
  tableTrBorder: string
}
export interface Menu {
  headingText: string
  borderActive: string
  bgActive: string
}
export interface Sidenav {
  selectedBg: string
  borderActive: string
}
export interface Header {
  text: string
  bg: string
  logo: string
}
export interface FilterItem {
  barBg: string
}
export interface HiddenTextExpander {
  bg: string
  bgHover: string
}
export interface UploadEnabled {
  border: string
  borderFocused: string
}
export interface Underlinenav {
  border: string
  borderHover: string
  borderActive: string
  text: string
  textHover: string
  textActive: string
  icon: string
  iconHover: string
  iconActive: string
  counterText: string
  counterBg: string
}
export interface SocialCount {
  bg: string
}
export interface HeaderSearch {
  bg: string
  border: string
}
export interface SearchKeyword {
  hl: string
}
export interface Diffstat {
  neutralBg: string
  neutralBorder: string
  deletionBg: string
  deletionBorder: string
  additionBg: string
  additionBorder: string
}
export interface Mktg {
  success: string
  info: string
  bgShadeGradient: BgOrBgOverlayOrBgShadeGradient
  btn: Btn1
}
export interface BgOrBgOverlayOrBgShadeGradient {
  top: string
  bottom: string
}
export interface Btn1 {
  bg: BgOrBgOverlayOrBgShadeGradient
  bgOverlay: BgOrBgOverlayOrBgShadeGradient
  text: string
  primary: PrimaryOrEnterprise
  enterprise: PrimaryOrEnterprise
  outline: OutlineOrDark
  dark: OutlineOrDark
}
export interface PrimaryOrEnterprise {
  bg: BgOrBgOverlayOrBgShadeGradient
  bgOverlay: BgOrBgOverlayOrBgShadeGradient
  text: string
}
export interface OutlineOrDark {
  text: string
  border: string
  hover: PrimaryOrSecondaryOrInfoOrSuccessOrWarningOrDangerOrOrangeOrHover
  focus: Focus
}
export interface Focus {
  border: string
  borderInset: string
}
export interface Blob {
  lineHighlightBg: string
  lineHighlightBorder: string
}
export interface Diff {
  addition: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  deletion: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  change: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
}
export interface DiffBlob {
  numText: string
  numHoverText: string
  addition: AdditionOrDeletion
  deletion: AdditionOrDeletion
  hunk: Hunk
  emptyBlockBg: string
  selectedLineHighlightBg: string
  selectedLineHighlightBorder: string
  expander: Expander
  commentButton: CommentButton
}
export interface AdditionOrDeletion {
  numText: string
  numHoverText: string
  numBg: string
  lineBg: string
  wordBg: string
}
export interface Hunk {
  text: string
  numBg: string
  lineBg: string
}
export interface Expander {
  icon: string
  hoverIcon: string
  hoverBg: string
}
export interface CommentButton {
  icon: string
  bg: string
  gradientBg: string
}
export interface GlobalNav {
  logo: string
  bg: string
  text: string
  icon: string
  inputBg: string
  inputBorder: string
  inputIcon: string
  inputPlaceholder: string
}
export interface FooterInvertocat {
  octicon: string
  octiconHover: string
}
export interface PrState {
  draft: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  open: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  merged: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
  closed: SuccessOrWarningOrErrorOrAdditionOrDeletionOrChangeOrDraftOrOpenOrMergedOrClosedOrVerifiedBadge
}
export interface TopicTag {
  text: string
  bg: string
  hoverBg: string
  activeBg: string
}
export interface MergeBox {
  successIconBg: string
  successIconText: string
  successIconBorder: string
  successIndicatorBg: string
  successIndicatorBorder: string
  mergedIconBg: string
  mergedIconText: string
  mergedIconBorder: string
  mergedBoxBorder: string
  neutralIconBg: string
  neutralIconText: string
  neutralIconBorder: string
  neutralIndicatorBg: string
  neutralIndicatorBorder: string
  warningIconBg: string
  warningIconText: string
  warningIconBorder: string
  warningBoxBorder: string
  warningMergeHighlight: string
  errorIconBg: string
  errorIconText: string
  errorIconBorder: string
  errorIndicatorBg: string
  errorIndicatorBorder: string
}
export interface Project {
  cardBg: string
  headerBg: string
  sidebarBg: string
  gradientIn: string
  gradientOut: string
}
export interface Checks {
  bg: string
  textPrimary: string
  textSecondary: string
  textLink: string
  btnIcon: string
  btnHoverIcon: string
  btnHoverBg: string
  inputText: string
  inputPlaceholderText: string
  inputFocusText: string
  inputBg: string
  dropdownText: string
  dropdownBg: string
  dropdownBorder: string
  dropdownHoverText: string
  dropdownHoverBg: string
  dropdownBtnHoverText: string
  dropdownBtnHoverBg: string
  scrollbarThumbBg: string
  headerLabelText: string
  headerLabelOpenText: string
  headerBorder: string
  headerIcon: string
  lineText: string
  lineNumText: string
  lineTimestampText: string
  lineHoverBg: string
  lineSelectedBg: string
  lineSelectedNumText: string
  lineDtFmText: string
  lineDtFmBg: string
  gateBg: string
  gateText: string
  gateWaitingText: string
  stepHeaderOpenBg: string
  stepErrorText: string
  stepWarningText: string
  loglineText: string
  loglineNumText: string
  loglineDebugText: string
  loglineErrorText: string
  loglineErrorNumText: string
  loglineErrorBg: string
  loglineWarningText: string
  loglineWarningNumText: string
  loglineWarningBg: string
  loglineCommandText: string
  loglineSectionText: string
  ansi: Ansi
}
export interface Ansi {
  black: string
  blackBright: string
  white: string
  whiteBright: string
  gray: string
  red: string
  redBright: string
  green: string
  greenBright: string
  yellow: string
  yellowBright: string
  blue: string
  blueBright: string
  magenta: string
  magentaBright: string
  cyan: string
  cyanBright: string
}
export interface IntroShelf {
  gradientLeft: string
  gradientRight: string
  gradientIn: string
  gradientOut: string
}
export interface MarketingIcon {
  primary: string
  secondary: string
}
export interface Prettylights {
  syntax: Syntax
}
export interface Syntax {
  comment: string
  constant: string
  entity: string
  storageModifierImport: string
  entityTag: string
  keyword: string
  string: string
  variable: string
  brackethighlighterUnmatched: string
  invalidIllegalText: string
  invalidIllegalBg: string
  carriageReturnText: string
  carriageReturnBg: string
  stringRegexp: string
  markupList: string
  markupHeading: string
  markupItalic: string
  markupBold: string
  markupDeletedText: string
  markupDeletedBg: string
  markupInsertedText: string
  markupInsertedBg: string
  markupChangedText: string
  markupChangedBg: string
  markupIgnoredText: string
  markupIgnoredBg: string
  metaDiffRange: string
  brackethighlighterAngle: string
  sublimelinterGutterMark: string
  constantOtherReferenceLink: string
}
export interface Codemirror {
  text: string
  bg: string
  guttersBg: string
  guttermarkerText: string
  guttermarkerSubtleText: string
  linenumberText: string
  cursor: string
  selectionBg: string
  activelineBg: string
  matchingbracketText: string
  linesBg: string
  syntax: Syntax1
}
export interface Syntax1 {
  comment: string
  constant: string
  entity: string
  keyword: string
  storage: string
  string: string
  support: string
  variable: string
}

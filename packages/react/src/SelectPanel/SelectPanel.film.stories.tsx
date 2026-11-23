import type {Meta, StoryObj} from '@storybook/react-vite'
import {SelectPanelFilm} from './playground/SelectPanelFilm'
import {SelectPanelFilmSurface} from './playground/SelectPanelFilmSurface'

const meta = {
  title: 'Components/SelectPanel/Film',
  component: SelectPanelFilm,
  parameters: {
    layout: 'fullscreen',
    controls: {disable: true},
    docs: {
      description: {
        component:
          'A short film made from real SelectPanel and ActionList components. The opening establishes a macOS-style desktop with original gradient wallpaper, a menu bar, and a Chrome-like window showing the GitHub issue. The camera zooms into Labels before the browser framing gives way to reusable blocks, finishing in a straight stack grouped by SelectPanel and ActionList. Scene two opens #feature-agent-assignment in Slack with a dock-style expansion and gentle push-in. Brief reaction bursts settle before the next reply, with a short pause before composing the draft offer. After the final message, the pointer waits 1.5 seconds before minimizing Slack in 300ms to reveal the already-open issue browser and waiting card stack. The camera moves straight into the draft: first drag in the Assign agents trigger under Agents, then a plain, unskinned SelectPanel list. Later chapters add groups, search, multiple selection, footer actions, and CI-style agent status icons before mobile and native-platform experiments. Notification chimes are synthesized locally; no external assets or requests are needed. Present scene hides controls after a three-second countdown; Escape restores them. Use the scene buttons below the timeline for review. Autoplay next scene is on by default; turn it off to pause at each scene end, then press Play scene to continue.',
      },
    },
  },
  globals: {showSurroundingElements: false, colorScheme: 'light'},
} satisfies Meta<typeof SelectPanelFilm>

export default meta
type Story = StoryObj<typeof meta>

export const FullFilm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Before the parts appear, the complete picker receives a blue outline and a prominent 40px “SelectPanel” label on its left, vertically centered in the panel close-up and over three times the size of the part labels. At 2.2 seconds, a small knife makes two cuts through the label at 0.8× speed. Each cut releases the corresponding blue pieces into staggered tilts, hinting at the panel’s upcoming breakup. The cut label holds for 225ms before the part annotations begin at three seconds. The panel splits at 3.9 seconds. Reduced motion keeps the label intact and hides the knife. ' +
          'At 21.22 seconds, the user selects the Agents section for a screenshot. A capture flash and thumbnail precede restoring Slack, attaching the real draft-picker screenshot, and typing and sending “what do you think?”. Maya replies “I think we should add a short description for each agent”. The reply holds for 1.65 seconds before the user minimizes Slack and drags the description card into the same picker. After the description drop, the group request arrives one second later, removing 500ms of waiting. Subsequent requests keep their spacing. Later requests arrive as notifications while the remaining cards are added. The screenshot and caption remain in the channel history when Slack returns. ' +
          'Slack notification messages use prominent 24px text while keeping the complete history visible. The first request appears only in Slack, not as a duplicate banner. Each later banner has a 1.2-second reading pause before the cursor approaches; feature drags remain 900ms. The first description holds for 500ms after finishing its entrance; later features have at least 800ms to absorb the settled result before the next banner arrives. The ActionList.TrailingVisual card keeps generic items and neutral chevrons while parked and throughout its drag. Agent statuses appear in the picker only after the drop. ' +
          'The closing card shows “SelectPanel” immediately. After a 600ms pause, “, now composable” fades in over 900ms. The completed title holds for 300ms, then “what will you build?” fades in over 900ms, within the same three-second ending. ' +
          'Dark macOS-style Slack banners accumulate in chronological order at the top left, with each new message appended below the earlier messages without moving them. They remain readable until Slack returns, without covering the feature-card bank or picker. Completed intro animations stop advancing, the opening issue is memoized, and the preloaded phone receives clock updates only during its own scene. ' +
          'Feature cards land on their real insertion sites: ActionList.GroupHeading at the first group heading, search at the top, footer at the panel bottom, and status icons on their assigned rows. After the status drop, the same cursor glides outside the picker so Architect’s checkmark stays visible. After their drops, search slides in from above and the footer slides in from below, with no sideways motion. The complete Group card stays in the bank. ' +
          'Switching to multiple selection preserves Architect alone. The cursor holds for 200ms, then clicks Developer and Accessibility Reviewer in order, and the footer counts three selected agents. ' +
          'The description card keeps its populated preview throughout the drag and lands that preview directly in the first agent row before the descriptions appear. ' +
          "On returning from mobile, typing “Here's a draft PR” starts immediately as Slack opens. Leo’s “Wow, that was fast!” comes before Maya’s “This looks incredible!!”. The approval request holds for 1.5 seconds, then cuts directly to Platform and performance without minimizing Slack. " +
          'The seven-second platform scene first types “Platform and performance. Future proof.” over 750ms and holds the completed title for 250ms. Only then does the original showcase’s six-second capability wheel begin: Popover API, CSS Anchor Positioning, Invoker Commands API, Native <dialog> element, and Virtualization. The film clock drives the title, rotation and outline-to-fill transitions, including pause and rewind; reduced motion shows all five capabilities as a static list after the title. The original showcase is unchanged. ' +
          'Sharing the draft PR includes a GitHub link, larger reaction bursts, and excited replies from Maya, Leo and Sam. ' +
          'A gray ActionList hover follows the animated cursor across rows and remains visible through selection. On mobile, the issue appears with the picker closed; a touch ripple on Assign agents opens the real responsive bottom sheet, without a cursor. ' +
          'The quick draft picks up a real Button card, highlighting it only when the cursor arrives, and drops it into the issue as Assign agents. It then picks up the ActionList card and drops a plain list without autofocus, matching the button width, before selecting Architect. One continuous cursor carries through into Build with the team, which preserves the browser, issue, popup, option nodes and selection. Larger macOS Slack notifications brainstorm descriptions first, then groups, search, multiple selection, an Apply button and agent statuses. The cursor waits 1.2 seconds after each banner finishes entering, then picks up the actual populated card from the stack. Its live component preview stays visible above the popup throughout the flight, and the card disappears only on release. Group headings expand in place without replacing or fading existing options. The search box appears empty without a typing demonstration, and the film moves on to multiple selection. A real ActionMenu edits selectionMode="single" to "multiple" in a blue anatomy-style label and leader to the left of the picker. The footer pairs a normal-sized, muted selection count with Cancel and Apply. An additional ActionList.TrailingVisual card previews CI-style green checks, a yellow spinner and a small filled light-gray queued dot; the live picker shows statuses only on assigned rows. After the mobile notification enters and its 1.2-second reading pause finishes, the phone slides up over the same desktop browser, issue and picker. The phone then slides down and Slack restores over that desktop. The channel opens already at the bottom, with every earlier message in place and settled, varied thumbs-up and heart reactions on the feature requests. You types and sends “Here\'s a draft PR”. Excited emoji replies, rocket/fire/mind-blown reactions and “Wow, that was fast!” follow. You then types and sends “can someone approve it so we can deploy to preview 🙏”. After a reading pause, Slack minimizes directly into the native-platform chapter.',
      },
    },
  },
}

export const SceneOne: Story = {
  args: {duration: 8_000},
  parameters: {
    docs: {
      description: {
        story:
          'The Labels close-up pulls back to show the entire open panel. Matching outlines and solid external tags identify its real parts: blue for SelectPanel and purple for ActionList, both with white text. Extraction begins at 3.9 seconds, after the label-cutting pause and the complete part annotations. Those same DOM nodes become cards without changing their outline, tag colors or label geometry at the handoff. As they stack, the outlines soften into rounded, subtly shadowed cards; the tags move inside, their fills fade, and their text switches back to blue or purple without fading into its background. The additional status-preview card joins the bank. By 7.54 seconds the complete stack matches scene two, with no restyling at the scene boundary.',
      },
    },
  },
}

export const SourceSurface = () => <SelectPanelFilmSurface />

export const MobileSurface = () => <SelectPanelFilmSurface mobile />

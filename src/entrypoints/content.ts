import { storage } from "@wxt-dev/storage";
import { EmojiState, EmojiStateMap } from "../lib/types";
import { EMOJI_STATE_MAP_KEY } from "@/lib/storageKeys";

export default defineContentScript({
  matches: ["*://meet.google.com/*"],
  main,
});

async function main() {
  let emojiStateMap: EmojiStateMap = await storage.getItem(
    EMOJI_STATE_MAP_KEY,
    { fallback: {} }
  );

  storage.watch<EmojiStateMap>(EMOJI_STATE_MAP_KEY, (newValue) => {
    emojiStateMap = newValue ?? {};
    updateReactionButtons(emojiStateMap);
  });

  const observer = new MutationObserver(() => {
    updateReactionButtons(emojiStateMap);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("message", (event) => {
    if (event.data?.type === "GET_MEET_EMOJIS") {
      const result = getEmojiButtons();
      if (result === undefined) return;
      const [buttons, _] = result;
      const emojis = Object.keys(buttons);
      window.postMessage({ type: "MEET_EMOJIS", emojis }, "*");
    }
  });
}

function updateReactionButtons(emojiStates: Record<string, EmojiState>) {
  const result = getEmojiButtons();
  if (result === undefined) return;
  const [buttons, buttonWrappers] = result;

  for (const [emoji, state] of Object.entries(emojiStates)) {
    const button = buttons[emoji];
    const buttonWrapper = buttonWrappers[emoji];
    setButtonDisplay(buttonWrapper, state);
    setConfirmListener(button, state);
  }
}

function setButtonDisplay(buttonWrapper: Element, state: EmojiState) {
  if (!(buttonWrapper instanceof HTMLElement)) return;
  if (state === "hide") {
    buttonWrapper.style.display = "none";
  } else {
    buttonWrapper.style.display = "";
  }
}

function setConfirmListener(button: HTMLButtonElement, state: EmojiState) {
  if (state === "confirm") {
    if (!button.dataset.reactionShieldConfirm) {
      button.addEventListener("click", confirmHandler);
      button.dataset.reactionShieldConfirm = "1";
    }
  } else {
    if (button.dataset.reactionShieldConfirm) {
      button.removeEventListener("click", confirmHandler);
      delete button.dataset.reactionShieldConfirm;
    }
  }
}

function confirmHandler(e: Event) {
  const emoji =
    (e.currentTarget as HTMLElement)?.getAttribute("data-emoji") || "";
  const ok = window.confirm(`「${emoji}」リアクションを送信しますか？`);
  if (!ok) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function getEmojiButtons():
  | [Record<string, HTMLButtonElement>, Record<string, Element>]
  | undefined {
  const buttonWrappers: Record<string, Element> = {};
  const buttons: Record<string, HTMLButtonElement> = {};
  const REACTION_LABELS = [
    "リアクション",
    "Reactions",
    "リアクションを送信",
    "Send a reaction",
  ];
  const emojiContainer = document.querySelector(
    REACTION_LABELS.map((label) => `div[aria-label="${label}"]`).join(", ")
  );
  if (emojiContainer === null) return;
  const emojiButtonElements =
    emojiContainer.querySelectorAll<HTMLButtonElement>(
      "button[data-emoji][aria-label]"
    ) ?? [];
  if (emojiContainer.children.length !== emojiButtonElements.length) return;

  emojiButtonElements.forEach((button, index) => {
    const emoji =
      button.getAttribute("data-emoji") || button.getAttribute("aria-label");
    if (emoji === null) return;
    buttonWrappers[emoji] = emojiContainer.children[index];
    buttons[emoji] = button;
  });

  return [buttons, buttonWrappers];
}

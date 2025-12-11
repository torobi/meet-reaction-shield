const HIDE_EMOJIS = ["👎"];
const CONFIRM_EMOJIS = ["😢", "🤔"];

export default defineContentScript({
  matches: ["*://meet.google.com/*"],
  main,
});

function main() {
  const observer = new MutationObserver(() => {
    updateReactionButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  updateReactionButtons();

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

function updateReactionButtons() {
  const result = getEmojiButtons();
  if (result === undefined) return;
  const [buttons, buttonWrappers] = result;

  hideButtons(buttonWrappers);
  addConfirmListeners(buttons);
}

function hideButtons(buttonWrappers: Record<string, Element>) {
  for (const emoji of HIDE_EMOJIS) {
    const wrapper = buttonWrappers[emoji];
    if (wrapper && wrapper instanceof HTMLElement) {
      wrapper.style.display = "none";
    }
  }
}

function addConfirmListeners(buttons: Record<string, HTMLButtonElement>) {
  for (const emoji of CONFIRM_EMOJIS) {
    const btn = buttons[emoji];
    if (btn && !btn.dataset.reactionShieldConfirm) {
      btn.addEventListener("click", (e) => {
        const ok = window.confirm(`「${emoji}」リアクションを送信しますか？`);
        if (!ok) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      btn.dataset.reactionShieldConfirm = "1";
    }
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

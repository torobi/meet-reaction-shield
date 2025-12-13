<script lang="ts">
import { type EmojiState, EMOJI_STATES, type EmojiStateMap } from '../types';

type Props = {
  meetEmojis: string[];
  emojiState: EmojiStateMap;
};

let { meetEmojis, emojiState = $bindable({}) }: Props = $props();

function nextState(current: EmojiState, reverse = false): EmojiState {
  const idx = EMOJI_STATES.indexOf(current);
  if (reverse) {
    return EMOJI_STATES[(idx - 1 + EMOJI_STATES.length) % EMOJI_STATES.length];
  } else {
    return EMOJI_STATES[(idx + 1) % EMOJI_STATES.length];
  }
}

function onToggle(emoji: string, reverse = false) {
  emojiState[emoji] = nextState(emojiState[emoji] ?? "default", reverse);
}
</script>

<div class="emoji-toggle-row">
  {#each meetEmojis as emoji}
    <div class="emoji-toggle-item"
      role="button"
      tabindex="0"
      onclick={(e) => { onToggle(emoji, e.shiftKey); (e.currentTarget as HTMLElement).blur(); }}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onToggle(emoji, e.shiftKey);
        } else if (e.key === 'ArrowRight') {
          const next = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (next) next.focus();
        } else if (e.key === 'ArrowLeft') {
          const prev = e.currentTarget.previousElementSibling as HTMLElement | null;
          if (prev) prev.focus();
        }
      }}>
      <span class="emoji-icon">{emoji}</span>
      {#if (emojiState[emoji] === 'confirm')}
        <span class="badge">⚠️</span>
      {:else if (emojiState[emoji] === 'hide')}
        <span class="badge">🚫</span>
      {/if}
    </div>
  {/each}
</div>

<style>
.emoji-toggle-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2c2c2c;
  border-radius: 2.25rem;
  padding: 0 10px;
  height: 48px;
  width: fit-content;
}
.emoji-toggle-item {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: 0.2s;
}
.emoji-toggle-item:hover,
.emoji-toggle-item:focus-visible {
  background-color: #444;
}
.emoji-icon {
  z-index: 1;
}
.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 1rem;
  background: #222;
  border-radius: 50%;
  padding: 0 2px;
  z-index: 2;
  pointer-events: none;
  user-select: none;
}
</style>

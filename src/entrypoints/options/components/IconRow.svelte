<script lang="ts">
import { type EmojiState } from "../types";

interface Props {
  label: string;
  state: EmojiState;
  meetEmojis: string[];
  emojiState: Record<string, EmojiState>;
}

let { label, state, meetEmojis, emojiState = $bindable({}) }: Props = $props();
let emojiListWidth = $derived.by(() => {
  const emojiWidth = 40;
  const listPadding = 5 * 2;
  return meetEmojis.length * emojiWidth + listPadding;
});

function handleDrop(emoji: string, newState: EmojiState) {
  emojiState[emoji] = newState;
}
</script>

<div class="state-row">
  <div class="state-label">{label}</div>
  <div class="emoji-list" role="list"
    style={`width: ${emojiListWidth}px`}
    ondragover={(e) => e.preventDefault()}
    ondrop={(e) => {
      if (e.dataTransfer) {
        const emoji = e.dataTransfer.getData('emoji');
        if (meetEmojis.includes(emoji)) handleDrop(emoji, state);
      }
    }}>
    {#each meetEmojis.filter(e => emojiState[e] === state) as emoji}
      <div class="emoji-item" draggable="true" role="listitem"
        ondragstart={(e) => { if(e.dataTransfer) e.dataTransfer.setData('emoji', emoji); }}
        ondragend={() => {}}>
        {emoji}
      </div>
    {/each}
  </div>
</div>

<style>
.state-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.state-label {
  width: 2.5rem;
  text-align: center;
  font-size: 1.5rem;
}
.emoji-list {
  height: 40px;
  display: flex;
  border-radius: 2.25rem;
  background-color: #2c2c2c;
  padding: 0 5px;
}
.emoji-item {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: grab;
  user-select: none;
  border-radius: 0.5rem;
  transition: margin 0.2s;
}
.emoji-item:hover {
  background-color: #3d3d3d;
  margin: 0 3px;
}
</style>

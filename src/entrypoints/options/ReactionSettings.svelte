<script lang="ts">
import { storage } from '@wxt-dev/storage';

type EmojiState = "default" | "confirm" | "hide";
interface StorageData {
  emojiStates: Record<string, EmojiState>;
}

function getMeetEmojis(): Promise<string[]> {
  return new Promise((resolve) => {
    window.postMessage({ type: 'GET_MEET_EMOJIS' }, '*');
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'MEET_EMOJIS') {
        resolve(event.data.emojis);
      } else {
        resolve(["💖", "👍", "🎉", "👏", "😂", "😮", "😢", "🤔", "👎"]);
      }
    }, { once: true });
  });
}

function isStorageData(obj: unknown): obj is StorageData {
  return typeof obj === 'object' && obj !== null && 'emojiStates' in obj;
}

function emojiListWidthStyle() {
  const emojiWidth = 40;
  const listPadding = 5 * 2;
  return `width: ${meetEmojis.length * emojiWidth + listPadding}px;`;
}

onMount(() => {
  Promise
    .all([getMeetEmojis(), storage.getItem("local:emojiStates")])
    .then(([emojis, storedData]) => {
      meetEmojis = emojis;
      if (isStorageData(storedData)) {
        emojiState = storedData.emojiStates;
      } else {
        emojiState = Object.fromEntries(emojis.map(e => [e, "default"]));
      }
    });
})

let meetEmojis = $state<string[]>([]);
let emojiState = $state<Record<string, EmojiState>>({});

function handleDrop(emoji: string, newState: EmojiState) {
  emojiState[emoji] = newState;
}
</script>

<style>
:global(body) {
  background: #414141;
}
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

  &:hover {
    background-color: #3d3d3d;
    margin: 0 3px;
  }

  transition: margin 0.2s;
}
</style>

<!-- 通常 -->
<div class="state-row">
  <div class="state-label"></div>
  <div class="emoji-list" role="list"
    style={emojiListWidthStyle()}
    ondragover={(e) => e.preventDefault()}
    ondrop={(e) => {
      if (e.dataTransfer) {
        const emoji = e.dataTransfer.getData('emoji');
        if (meetEmojis.includes(emoji)) handleDrop(emoji, "default");
      }
    }}>
    {#each meetEmojis.filter(e => emojiState[e] === "default") as emoji}
      <div class="emoji-item" draggable="true" role="listitem"
        ondragstart={(e) => { if(e.dataTransfer) e.dataTransfer.setData('emoji', emoji); }}
        ondragend={() => {}}>
        {emoji}
      </div>
    {/each}
  </div>
</div>
<!-- 確認 -->
<div class="state-row">
  <div class="state-label">⚠️</div>
  <div class="emoji-list" role="list"
    style={emojiListWidthStyle()}
    ondragover={(e) => e.preventDefault()}
    ondrop={(e) => {
      if (e.dataTransfer) {
        const emoji = e.dataTransfer.getData('emoji');
        if (meetEmojis.includes(emoji)) handleDrop(emoji, "confirm");
      }
    }}>
    {#each meetEmojis.filter(e => emojiState[e] === "confirm") as emoji}
      <div class="emoji-item" draggable="true" role="listitem"
        ondragstart={(e) => { if(e.dataTransfer) e.dataTransfer.setData('emoji', emoji); }}
        ondragend={() => {}}>
        {emoji}
      </div>
    {/each}
  </div>
</div>
<!-- 非表示 -->
<div class="state-row">
  <div class="state-label">🚫</div>
  <div class="emoji-list" role="list"
    style={emojiListWidthStyle()}
    ondragover={(e) => e.preventDefault()}
    ondrop={(e) => {
      if (e.dataTransfer) {
        const emoji = e.dataTransfer.getData('emoji');
        if (meetEmojis.includes(emoji)) handleDrop(emoji, "hide");
      }
    }}>
    {#each meetEmojis.filter(e => emojiState[e] === "hide") as emoji}
      <div class="emoji-item" draggable="true" role="listitem"
        ondragstart={(e) => { if(e.dataTransfer) e.dataTransfer.setData('emoji', emoji); }}
        ondragend={() => {}}>
        {emoji}
      </div>
    {/each}
  </div>
</div>

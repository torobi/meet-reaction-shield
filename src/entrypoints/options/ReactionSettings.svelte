<script lang="ts">
import { storage } from '@wxt-dev/storage';
import EmojiToggleRow from './components/EmojiToggleRow.svelte';
import { type EmojiState } from './types';
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

</script>

<style>
  :root {
    --c-foreground: #ffffff;
  }
  :global(body) {
    background-color: #414141;
  }
  .container {
    padding: 3rem;
    margin: 0 auto;
    max-width: 64rem;
    display: flex;
    flex-direction: column;
  }
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 3rem;
    color: var(--c-foreground);
  }
</style>

<div class="container">
  <div class="title">
    Meet Reaction Shield
  </div>
  <EmojiToggleRow {meetEmojis} bind:emojiState />
</div>

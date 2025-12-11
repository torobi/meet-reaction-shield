<script lang="ts">
import { storage } from '@wxt-dev/storage';
import IconRow from './components/IconRow.svelte';
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

$inspect(meetEmojis)
</script>

<style>
  :global(body) {
    background-color: #414141;
  }
</style>

<IconRow
  label=""
  state="default"
  {meetEmojis}
  bind:emojiState
/>
<IconRow
  label="⚠️"
  state="confirm"
  {meetEmojis}
  bind:emojiState
/>
<IconRow
  label="🚫"
  state="hide"
  {meetEmojis}
  bind:emojiState
/>

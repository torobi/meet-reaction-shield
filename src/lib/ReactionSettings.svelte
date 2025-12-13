<script lang="ts">
import { storage } from '@wxt-dev/storage';
import EmojiToggleRow from './components/EmojiToggleRow.svelte';
import { type EmojiStateMap } from './types';
import { EMOJI_STATE_MAP_KEY } from '@/lib/storageKeys';

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

onMount(() => {
  Promise
    .all([getMeetEmojis(), storage.getItem<EmojiStateMap>(EMOJI_STATE_MAP_KEY)])
    .then(([emojis, stateMap]) => {
      meetEmojis = emojis;
      if (stateMap) {
        emojiState = stateMap;
      } else {
        emojiState = Object.fromEntries(emojis.map(e => [e, "default"]));
      }
    });
})

let meetEmojis = $state<string[]>([]);
let emojiState = $state<EmojiStateMap>({});

$effect(() => {
  storage.setItem(EMOJI_STATE_MAP_KEY, emojiState);
});

</script>

<style>
  :root {
    --c-foreground: #ffffff;
  }
  :global(body) {
    background-color: #414141;
    margin: 0;
    display: flex;
    place-items: center;
  }

  .container {
    padding: 3rem;
    margin: 0 30px;
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

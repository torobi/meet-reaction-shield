import { mount } from "svelte";
import ReactionSettings from "../../lib/ReactionSettings.svelte";
const app = mount(ReactionSettings, {
  target: document.getElementById("app")!,
});

export default app;

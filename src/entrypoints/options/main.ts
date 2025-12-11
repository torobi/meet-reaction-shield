import { mount } from "svelte";
import ReactionSettings from "./ReactionSettings.svelte";

const app = mount(ReactionSettings, {
  target: document.getElementById("app")!,
});

export default app;

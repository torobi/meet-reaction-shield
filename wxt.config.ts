import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte", "@wxt-dev/auto-icons"],
  manifest: {
    name: "Meet Reaction Shield",
    description:
      "Restrict or confirm reactions in Google Meet for better meeting control.",
    version: "0.1.0",
    permissions: ["storage"],
    options_ui: {
      page: "entrypoints/options/index.html",
      open_in_tab: true,
    },
  },
});

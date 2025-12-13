export const EMOJI_STATES = ["default", "confirm", "hide"] as const;
export type EmojiState = (typeof EMOJI_STATES)[number];
export type EmojiStateMap = Record<string, EmojiState>;

export const ANIMATION_STATE = {
    OPENING: "OPENING",
    OPEN: "OPEN",
    CLOSING: "CLOSING",
    CLOSED: "CLOSED",
} as const;

export type AnimationState = keyof typeof ANIMATION_STATE;

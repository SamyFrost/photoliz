"use client";

import { useSyncExternalStore } from "react";

export const INTRO_KEY = "pholiz-intro";

/*
 * Tells the page when the logo intro is over, so the navbar logo and the hero can make their
 * entrance after it. The state lives on <html data-intro="done">: the boot script in the root
 * layout sets it before paint when the intro already ran this session.
 */
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const isDone = () => document.documentElement.dataset.intro === "done";

function finish() {
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
  listeners.forEach((fn) => fn());
}

export function useIntro() {
  const done = useSyncExternalStore(subscribe, isDone, () => false);
  return { done, finish };
}

/** Runs before hydration: skip the intro for the rest of the session. */
export const introBootScript = `try{if(sessionStorage.getItem("${INTRO_KEY}"))document.documentElement.dataset.intro="done"}catch(e){}`;

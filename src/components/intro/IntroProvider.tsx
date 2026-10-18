"use client";

import { useEffect, useSyncExternalStore } from "react";

export const INTRO_KEY = "pholiz-intro";

/*
 * Tells the page when the logo intro is over, so the navbar logo and the hero can make their
 * entrance after it. The state lives on <html data-intro="done">.
 *
 * Nothing may touch the DOM before React hydrates: an inline script that did (even just one
 * attribute on <html>, or one <style> in <head>) made React throw away the server HTML and
 * re-render the page (error #418). So returning visitors are detected in effects, and the
 * server-rendered overlay starts as a plain night-violet cover (see globals.css).
 */
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const isDone = () => document.documentElement.dataset.intro === "done";

export function markIntroDone() {
  if (isDone()) return;
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
  listeners.forEach((fn) => fn());
}

export function useIntro() {
  const done = useSyncExternalStore(subscribe, isDone, () => false);
  useEffect(() => {
    // Returning visitor (the intro already ran this session): nothing to wait for.
    try {
      if (sessionStorage.getItem(INTRO_KEY)) markIntroDone();
    } catch {}
  }, []);
  return { done, finish: markIntroDone };
}

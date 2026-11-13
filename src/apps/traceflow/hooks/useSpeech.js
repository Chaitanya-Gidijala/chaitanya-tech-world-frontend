import { useCallback, useEffect, useRef, useState } from 'react';

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/** Pick a natural-sounding English voice when one is available. */
function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /en[-_](GB|US|IN)/i.test(v.lang) && /natural|neural|google|samantha|daniel/i.test(v.name)) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith('en')) ??
    null
  );
}

/**
 * useSpeech — reads a list of paragraphs aloud with the browser's built-in
 * speech synthesis, exposing which paragraph is currently being spoken.
 *
 *   const { supported, speaking, current, start, stop } = useSpeech(paragraphs);
 */
export function useSpeech(paragraphs) {
  const [current, setCurrent] = useState(-1);
  const cancelled = useRef(false);

  const stop = useCallback(() => {
    if (!supported) return;
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setCurrent(-1);
  }, []);

  const start = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    cancelled.current = false;
    const voice = pickVoice();

    paragraphs.forEach((text, i) => {
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.rate = 0.98;
      u.onstart = () => !cancelled.current && setCurrent(i);
      if (i === paragraphs.length - 1) u.onend = () => setCurrent(-1);
      window.speechSynthesis.speak(u);
    });
  }, [paragraphs]);

  // Stop talking when the component unmounts (e.g. navigating away).
  useEffect(() => () => supported && window.speechSynthesis.cancel(), []);

  return { supported, speaking: current !== -1, current, start, stop };
}

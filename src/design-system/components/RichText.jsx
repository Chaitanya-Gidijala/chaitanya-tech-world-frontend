/**
 * RichText — renders `**bold**` segments in plain content strings as <strong>.
 * Keeps data files free of JSX while allowing light emphasis.
 */
export default function RichText({ text }) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
    );
}

/**
 * Per-model metadata for the prompt library: display label, where to open it,
 * and the "how to use" steps shown on the prompt detail page.
 */
const MODELS = [
  {
    match: ['chatgpt', 'gpt'],
    label: 'ChatGPT',
    openUrl: 'https://chatgpt.com/',
    steps: [
      { text: 'Copy the prompt.' },
      { text: 'Open ChatGPT at', link: { label: 'chatgpt.com', href: 'https://chatgpt.com/' } },
      { text: 'Paste the prompt into the message box.' },
      { text: 'Send it and review the result.' },
    ],
  },
  {
    match: ['gemini'],
    label: 'Gemini',
    openUrl: 'https://gemini.google.com/',
    steps: [
      { text: 'Copy the prompt.' },
      { text: 'Open Google Gemini at', link: { label: 'gemini.google.com', href: 'https://gemini.google.com/' } },
      { text: 'Paste the prompt and submit.' },
      { text: 'Review and refine the result.' },
    ],
  },
  {
    match: ['midjourney'],
    label: 'Midjourney',
    openUrl: 'https://www.midjourney.com/',
    steps: [
      { text: 'Copy the prompt.' },
      { text: 'Open the', link: { label: 'Midjourney bot on Discord', href: 'https://discord.com/app' } },
      { text: 'Type /imagine and paste the prompt.' },
      { text: 'Submit and pick your favourite variation.' },
    ],
  },
  {
    match: ['dall'],
    label: 'DALL·E',
    openUrl: 'https://chatgpt.com/',
    steps: [
      { text: 'Copy the prompt.' },
      { text: 'Open', link: { label: 'chatgpt.com', href: 'https://chatgpt.com/' }, suffix: '(DALL·E is built in).' },
      { text: 'Paste the prompt into the message box.' },
      { text: 'Generate and download your image.' },
    ],
  },
  {
    match: ['claude'],
    label: 'Claude',
    openUrl: 'https://claude.ai/',
    steps: null,
  },
  {
    match: ['stable diffusion', 'stable_diffusion', 'stability'],
    label: 'Stable Diffusion',
    openUrl: 'https://stability.ai/',
    steps: null,
  },
];

const DEFAULT_STEPS = [
  { text: 'Copy the prompt.' },
  { text: 'Open your preferred AI tool.' },
  { text: 'Paste the prompt into the input area.' },
  { text: 'Submit and review the result.' },
];

/** Returns `{ label, openUrl, steps }` for a model name from the API. */
export function getModelInfo(model) {
  const key = (model ?? '').toLowerCase();
  const found = MODELS.find((m) => m.match.some((k) => key.includes(k)));
  return {
    label: found?.label ?? model ?? 'AI model',
    openUrl: found?.openUrl ?? null,
    steps: found?.steps ?? DEFAULT_STEPS,
  };
}

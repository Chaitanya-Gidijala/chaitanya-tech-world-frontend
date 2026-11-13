import { Code2, Database, Layers, Server, ShieldCheck, Zap } from 'lucide-react';

const ICONS = {
  code: Code2,
  database: Database,
  layers: Layers,
  server: Server,
  shield: ShieldCheck,
  zap: Zap,
};

/** Resolves an icon key from portfolioContent.js to a lucide icon. */
export function ContentIcon({ name, size = 18 }) {
  const Icon = ICONS[name];
  return Icon ? <Icon size={size} aria-hidden="true" /> : null;
}

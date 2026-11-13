import { Github, Linkedin, Mail } from 'lucide-react';

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail };

/** SocialIcon — maps a social key from config to a lucide icon. */
export default function SocialIcon({ name, size = 16 }) {
  const Icon = ICONS[name];
  return Icon ? <Icon size={size} aria-hidden="true" /> : null;
}

import ROUTES from '@/constants/routes';
import { profileConfig } from '@/config/profileConfig';

/**
 * Primary navigation shown in the shared SiteHeader.
 * (The /portfolio route exists but is intentionally not linked anywhere yet.)
 */
export const PRIMARY_NAV = [
  { label: 'Home', to: ROUTES.HOME, end: true },
  { label: 'Daily', to: ROUTES.DAILY, badge: 'New' },
  { label: 'Roadmaps', to: ROUTES.ROADMAPS, end: true },
  { label: 'Certifications', to: ROUTES.CLAUDE_CERTS },
  { label: 'Traceflow', to: ROUTES.TRACEFLOW },
  { label: 'Prompts', to: ROUTES.PROMPTS },
];

/** Call-to-action shown at the right of the header. */
export const HEADER_CTA = { label: 'Contact', to: ROUTES.CONTACT };

/** Grouped links rendered in the SiteFooter. */
export const FOOTER_NAV = [
  {
    title: 'Learn',
    links: [
      { label: 'Developer roadmaps', to: ROUTES.ROADMAPS },
      { label: 'Java backend roadmap', to: ROUTES.ROADMAP_DETAIL('java') },
      { label: 'Frontend roadmap', to: ROUTES.ROADMAP_DETAIL('frontend') },
      { label: 'Claude certifications', to: ROUTES.CLAUDE_CERTS },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Traceflow visualiser', to: ROUTES.TRACEFLOW },
      { label: 'Algorithm catalogue', to: `${ROUTES.TRACEFLOW}/catalogue` },
      { label: 'Image prompt library', to: ROUTES.PROMPTS },
      { label: 'Daily algorithm puzzle', to: ROUTES.DAILY },
      { label: 'Your progress', to: ROUTES.PROGRESS },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Contact', to: ROUTES.CONTACT },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: profileConfig.socialLinks.linkedin, icon: 'linkedin' },
  { label: 'GitHub', href: profileConfig.socialLinks.github, icon: 'github' },
  { label: 'Email', href: `mailto:${profileConfig.contact.email}`, icon: 'mail' },
];

/**
 * CTW Design System — public API.
 *
 *   import { Button, Card, SectionHeader, Reveal } from '@/design-system';
 *
 * Styles are loaded once globally from src/main.jsx (tokens → base → components).
 */
export { default as Button } from './components/Button';
export { default as IconButton } from './components/IconButton';
export { default as Spinner } from './components/Spinner';
export { default as Breadcrumbs } from './components/Breadcrumbs';
export { default as Disclosure } from './components/Disclosure';
export { default as ThemeToggle } from './components/ThemeToggle';
export { default as RichText } from './components/RichText';
export { Badge, Tag, TagList } from './components/Badge';
export { Container, Section, Eyebrow, SectionHeader, Card, StatGroup } from './components/Layout';
export { TextField, TextArea, SelectField } from './components/Field';
export { Skeleton, EmptyState, Callout } from './components/Feedback';

// Motion
export { default as Reveal } from './motion/Reveal';
export { default as CountUp } from './motion/CountUp';
export { default as Marquee } from './motion/Marquee';
export { default as AuroraBackground } from './motion/AuroraBackground';

// Hooks
export { useDocumentMeta } from './hooks/useDocumentMeta';
export { useSpotlight } from './hooks/useSpotlight';

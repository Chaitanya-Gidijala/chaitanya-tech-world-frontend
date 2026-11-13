import BrandLogo from '@/components/site/BrandLogo';
import '@/components/site/site.css';

/** Shown while a lazily loaded route chunk is downloading — the animated brand mark. */
export default function RouteFallback() {
  return (
    <div className="ds-page route-fallback" role="status" aria-label="Loading page">
      <BrandLogo size={56} animated className="route-fallback__logo" />
    </div>
  );
}

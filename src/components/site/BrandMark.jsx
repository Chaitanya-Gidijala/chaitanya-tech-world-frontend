import { Link } from 'react-router-dom';
import clsx from 'clsx';
import ROUTES from '@/constants/routes';
import BrandLogo from './BrandLogo';

/** BrandMark — logo + wordmark used in the header and footer. */
export default function BrandMark({ to = ROUTES.HOME, compact = false, className, onClick }) {
  return (
    <Link to={to} className={clsx('site-brand', className)} aria-label="Chaitanya Tech World — home" onClick={onClick}>
      <BrandLogo size={38} animated className="site-brand__logo" />
      {!compact && (
        <span className="site-brand__name">
          <span className="site-brand__primary">Chaitanya</span>
          <span className="site-brand__secondary">Tech World</span>
        </span>
      )}
    </Link>
  );
}

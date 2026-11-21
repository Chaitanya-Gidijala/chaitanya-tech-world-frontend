import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Award, LogOut, Trophy, User } from 'lucide-react';
import { openAuth, signOut, useAccount } from './session';
import { startAutoSync, stopAutoSync } from './sync';
import './account.css';

const initials = (name) =>
  (name || '?')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Header control: "Sign in" when signed out, avatar menu when signed in. */
export default function AccountMenu({ compact = false }) {
  const account = useAccount();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (account) startAutoSync();
  }, [account]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!account) {
    return (
      <button type="button" className={clsx('acc-signin', compact && 'is-compact')} onClick={() => openAuth()}>
        <User size={15} aria-hidden="true" />
        <span>Sign in</span>
      </button>
    );
  }

  return (
    <div className="acc-menu" ref={ref}>
      <button
        type="button"
        className="acc-avatar"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account: ${account.name}`}
      >
        {initials(account.name)}
      </button>
      {open && (
        <div className="acc-menu__panel" role="menu">
          <div className="acc-menu__who">
            <strong>{account.name}</strong>
            {account.email && <span>{account.email}</span>}
          </div>
          <Link to="/progress" role="menuitem" onClick={() => setOpen(false)}>
            <User size={15} /> My progress
          </Link>
          <Link to="/progress#certificates" role="menuitem" onClick={() => setOpen(false)}>
            <Award size={15} /> Certificates
          </Link>
          <Link to="/leaderboard" role="menuitem" onClick={() => setOpen(false)}>
            <Trophy size={15} /> Leaderboard
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              stopAutoSync();
              signOut();
              setOpen(false);
            }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

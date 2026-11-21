import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Award, Lock, Loader2 } from 'lucide-react';
import { accountRequest, openAuth, useAccount } from '@/features/account/session';
import './growth.css';

/** Certificates on the Progress page: progress towards each, claim when earned. */
export default function CertificatesPanel() {
  const account = useAccount();
  const qc = useQueryClient();
  const [error, setError] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ['my-certificates', account?.username],
    queryFn: () => accountRequest('/me/certificates'),
    enabled: Boolean(account),
    refetchInterval: 60_000,
  });
  const claim = useMutation({
    mutationFn: (kind) => accountRequest('/me/certificates', { method: 'POST', body: { kind, name: account?.name } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-certificates'] }),
    onError: (e) => setError(e.message),
  });

  if (!account) {
    return (
      <div className="gr-certs gr-certs--locked">
        <Award size={22} aria-hidden="true" />
        <div>
          <strong>Earn verifiable certificates</strong>
          <p>Finish a roadmap or keep a puzzle streak and get a certificate you can add to LinkedIn. Sign in so your progress is saved to your account.</p>
        </div>
        <button type="button" className="gr-btn" onClick={() => openAuth('Sign in to earn certificates for your progress.')}>
          Sign in
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="gr-certs">Loading certificates…</div>;

  return (
    <div className="gr-certs">
      {error && (
        <p className="gr-error" role="alert">
          {error}
        </p>
      )}
      <ul className="gr-certs__list">
        {(data?.available ?? []).map((c) => {
          const pct = Math.min(100, Math.round((c.current / Math.max(1, c.target)) * 100));
          return (
            <li key={c.kind} className={clsx('gr-certs__item', c.code && 'is-issued', c.eligible && !c.code && 'is-ready')}>
              <span className="gr-certs__icon" aria-hidden="true">
                {c.code || c.eligible ? <Award size={18} /> : <Lock size={16} />}
              </span>
              <span className="gr-certs__body">
                <strong>{c.title}</strong>
                <span className="gr-certs__desc">{c.description}</span>
                <span className="gr-certs__meter" aria-label={`${c.current} of ${c.target}`}>
                  <span style={{ '--p': `${pct}%` }} />
                </span>
                <span className="gr-certs__progress">
                  {Math.min(c.current, c.target)} / {c.target}
                </span>
              </span>
              {c.code ? (
                <Link className="gr-btn gr-btn--ghost" to={`/certificate/${c.code}`}>
                  View
                </Link>
              ) : c.eligible ? (
                <button type="button" className="gr-btn" disabled={claim.isPending} onClick={() => claim.mutate(c.kind)}>
                  {claim.isPending && claim.variables === c.kind ? <Loader2 size={14} className="gr-spin" /> : null}
                  Claim
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="gr-note">Progress syncs to your account automatically. Certificates are issued to “{account.name}”.</p>
    </div>
  );
}

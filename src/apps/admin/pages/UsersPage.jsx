import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { ago, num } from '../lib/format';
import { EmptyState, ErrorBanner, PageHeader, Panel, Segmented, SkeletonRows, StatTile, StatusPill } from '../components/ui';

const isAdminUser = (u) => u.roles?.some((r) => r.includes('ADMIN'));

export default function UsersPage() {
  useDocumentMeta({ title: 'Users | CTW Control', robots: 'noindex, nofollow' });
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: ({ signal }) => adminApi.users({ signal }),
  });

  const users = useMemo(() => [...(data ?? [])].sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)), [data]);
  const admins = users.filter(isAdminUser).length;
  const active = users.filter((u) => u.active).length;
  const list = users.filter((u) => {
    if (role === 'admin' && !isAdminUser(u)) return false;
    if (role === 'user' && isAdminUser(u)) return false;
    const q = query.trim().toLowerCase();
    return !q || [u.name, u.username, u.email, u.provider, u.location].filter(Boolean).join(' ').toLowerCase().includes(q);
  });

  return (
    <div className="ad-page">
      <PageHeader title="Users" description="Accounts registered in the authentication service." />
      <ErrorBanner error={error} onRetry={refetch} />
      <div className="ad-stats ad-stats--3">
        <StatTile label="Total accounts" icon={Users} value={num(users.length)} />
        <StatTile label="Active" icon={UserCheck} value={num(active)} />
        <StatTile label="Administrators" icon={ShieldCheck} value={num(admins)} />
      </div>
      <Panel
        padded={false}
        title={`${num(list.length)} account${list.length === 1 ? '' : 's'}`}
        actions={
          <div className="ad-toolbar">
            <Segmented
              label="Role"
              value={role}
              onChange={setRole}
              options={[
                { value: 'all', label: 'All' },
                { value: 'admin', label: 'Admins' },
                { value: 'user', label: 'Users' },
              ]}
            />
            <label className="ad-search">
              <Search size={15} aria-hidden="true" />
              <input type="search" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search users" />
            </label>
          </div>
        }
      >
        {isLoading ? (
          <div className="ad-panel__body">
            <SkeletonRows rows={6} />
          </div>
        ) : list.length ? (
          <>
            <div className="ad-table-wrap ad-only-desktop">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Sign-in</th>
                    <th scope="col">Status</th>
                    <th scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <span className="ad-cell-main">{u.name || u.username}</span>
                        <span className="ad-cell-sub">@{u.username}</span>
                      </td>
                      <td>{u.email}</td>
                      <td>{isAdminUser(u) ? <StatusPill tone="info">Admin</StatusPill> : 'User'}</td>
                      <td>{u.provider ?? 'local'}</td>
                      <td>{u.active ? <StatusPill tone="success">Active</StatusPill> : <StatusPill tone="muted">Disabled</StatusPill>}</td>
                      <td>{u.createdAt ? ago(new Date(u.createdAt).getTime()) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="ad-cards ad-only-mobile">
              {list.map((u) => (
                <li key={u.id} className="ad-card-btn">
                  <div className="ad-card-btn__top">
                    <strong>{u.name || u.username}</strong>
                    {isAdminUser(u) ? <StatusPill tone="info">Admin</StatusPill> : <span className="ad-muted">User</span>}
                  </div>
                  <span className="ad-card-btn__meta">
                    {u.email} · {u.provider ?? 'local'} · {u.active ? 'active' : 'disabled'}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState icon={Users} title="No accounts match" />
        )}
      </Panel>
    </div>
  );
}

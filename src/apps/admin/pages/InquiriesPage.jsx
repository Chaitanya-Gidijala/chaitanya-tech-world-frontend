import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Inbox, Mail, MailOpen, Phone, Search } from 'lucide-react';
import { useDocumentMeta } from '@/design-system';
import { adminApi } from '../lib/api';
import { ago, dateTime, num } from '../lib/format';
import { Drawer, EmptyState, ErrorBanner, KeyValues, PageHeader, Panel, Segmented, SkeletonRows, StatusPill } from '../components/ui';

const isRead = (i) => Boolean(i.read ?? i.isRead);

export default function InquiriesPage() {
  useDocumentMeta({ title: 'Inquiries | CTW Control', robots: 'noindex, nofollow' });
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'inquiries'],
    queryFn: ({ signal }) => adminApi.inquiries({ signal }),
    refetchInterval: 60_000,
  });

  const mark = useMutation({
    mutationFn: ({ id, read }) => adminApi.markInquiry(id, read),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inquiries'] }),
  });

  const all = useMemo(() => [...(Array.isArray(data) ? data : data?.content ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [data]);
  const unread = all.filter((i) => !isRead(i)).length;
  const list = all.filter((i) => {
    if (filter === 'unread' && isRead(i)) return false;
    const q = query.trim().toLowerCase();
    return !q || [i.name, i.email, i.message, i.serviceType, i.phone].filter(Boolean).join(' ').toLowerCase().includes(q);
  });
  const open = all.find((i) => i.id === openId);

  const openInquiry = (i) => {
    setOpenId(i.id);
    if (!isRead(i)) mark.mutate({ id: i.id, read: true });
  };

  return (
    <div className="ad-page">
      <PageHeader title="Inquiries" description="Messages sent through the contact form." />
      <ErrorBanner error={error} onRetry={refetch} />
      <Panel
        padded={false}
        title={`${num(list.length)} message${list.length === 1 ? '' : 's'}`}
        actions={
          <div className="ad-toolbar">
            <Segmented
              label="Filter"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All', count: all.length },
                { value: 'unread', label: 'Unread', count: unread },
              ]}
            />
            <label className="ad-search">
              <Search size={15} aria-hidden="true" />
              <input type="search" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search inquiries" />
            </label>
          </div>
        }
      >
        {isLoading ? (
          <div className="ad-panel__body">
            <SkeletonRows rows={6} />
          </div>
        ) : list.length ? (
          <ul className="ad-inbox">
            {list.map((i) => (
              <li key={i.id}>
                <button type="button" className={clsx('ad-inbox__item', !isRead(i) && 'is-unread')} onClick={() => openInquiry(i)}>
                  <span className="ad-inbox__icon" aria-hidden="true">
                    {isRead(i) ? <MailOpen size={16} /> : <Mail size={16} />}
                  </span>
                  <span className="ad-inbox__main">
                    <span className="ad-inbox__top">
                      <strong>{i.name}</strong>
                      <span className="ad-muted">{i.email}</span>
                    </span>
                    <span className="ad-inbox__preview">{i.message}</span>
                  </span>
                  <span className="ad-inbox__meta">
                    {i.serviceType && <StatusPill tone="info">{i.serviceType}</StatusPill>}
                    <time className="ad-muted">{ago(new Date(i.createdAt).getTime())}</time>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Inbox} title={all.length ? 'Nothing matches' : 'No inquiries yet'} />
        )}
      </Panel>

      <Drawer open={Boolean(open)} onClose={() => setOpenId(null)} title={open ? `From ${open.name}` : ''}>
        {open && (
          <div className="ad-stack">
            <KeyValues
              items={[
                ['Received', dateTime(new Date(open.createdAt).getTime())],
                ['Email', <a key="e" href={`mailto:${open.email}`} className="ad-link">{open.email}</a>],
                open.phone && ['Phone', <a key="p" href={`tel:${open.phone}`} className="ad-link">{open.phone}</a>],
                open.serviceType && ['Service', open.serviceType],
                open.budget != null && ['Budget', num(open.budget)],
              ]}
            />
            <div className="ad-message">{open.message}</div>
            <div className="ad-toolbar">
              <a className="ad-btn ad-btn--primary" href={`mailto:${open.email}?subject=${encodeURIComponent('Re: your message to Chaitanya Tech World')}`}>
                <Mail size={15} /> Reply by email
              </a>
              {open.phone && (
                <a className="ad-btn ad-btn--ghost" href={`tel:${open.phone}`}>
                  <Phone size={15} /> Call
                </a>
              )}
              <button type="button" className="ad-btn ad-btn--ghost" onClick={() => mark.mutate({ id: open.id, read: !isRead(open) })}>
                Mark as {isRead(open) ? 'unread' : 'read'}
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

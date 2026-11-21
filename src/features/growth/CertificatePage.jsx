import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, Download, ExternalLink } from 'lucide-react';
import { Button, Container, Section, useDocumentMeta } from '@/design-system';
import BrandLogo from '@/components/site/BrandLogo';
import { growthApi } from './api';
import ShareBar from './ShareBar';
import './growth.css';

const SITE = typeof window !== 'undefined' ? window.location.origin : 'https://www.chaitanyatechworld.com';

function linkedInUrl(cert) {
  const d = new Date(cert.issuedAt);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: cert.title,
    organizationName: 'Chaitanya Tech World',
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certUrl: `${SITE}/certificate/${cert.code}`,
    certId: cert.code,
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}

/** Render the certificate to a 1600×1130 PNG. */
async function downloadPng(cert) {
  const W = 1600;
  const H = 1130;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  try {
    await document.fonts?.ready;
  } catch {
    /* optional */
  }
  const sans = "'Geist', 'Segoe UI', system-ui, sans-serif";
  const display = "'Syne', 'Geist', system-ui, sans-serif";
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#6d4cff');
  g.addColorStop(1, '#0ea5c6');
  ctx.strokeStyle = g;
  ctx.lineWidth = 18;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#6b7280';
  ctx.font = `600 30px ${sans}`;
  ctx.fillText('CHAITANYA TECH WORLD', W / 2, 180);
  ctx.fillStyle = '#111827';
  ctx.font = `800 76px ${display}`;
  ctx.fillText('Certificate of Achievement', W / 2, 300);
  ctx.fillStyle = '#6b7280';
  ctx.font = `400 32px ${sans}`;
  ctx.fillText('This certifies that', W / 2, 400);
  ctx.fillStyle = g;
  ctx.font = `800 92px ${display}`;
  ctx.fillText(cert.recipientName, W / 2, 520);
  ctx.fillStyle = '#374151';
  ctx.font = `600 40px ${sans}`;
  ctx.fillText(cert.title, W / 2, 620);
  ctx.fillStyle = '#6b7280';
  ctx.font = `400 28px ${sans}`;
  ctx.fillText(cert.description ?? '', W / 2, 680);
  ctx.font = `500 26px ${sans}`;
  ctx.fillText(`Issued ${new Date(cert.issuedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}`, W / 2, 900);
  ctx.fillText(`Verify at ${SITE.replace(/^https?:\/\//, '')}/certificate/${cert.code}`, W / 2, 945);
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificate-${cert.code}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** /certificate/:code — public, verifiable certificate. */
export default function CertificatePage() {
  const { code } = useParams();
  const { data: cert, isLoading, error } = useQuery({ queryKey: ['certificate', code], queryFn: () => growthApi.certificate(code), retry: false });

  useDocumentMeta({
    title: cert ? `${cert.recipientName} — ${cert.title} | Chaitanya Tech World` : 'Certificate | Chaitanya Tech World',
    description: cert ? `${cert.recipientName} earned “${cert.title}” on Chaitanya Tech World. ${cert.description}` : 'Verify a Chaitanya Tech World certificate.',
    robots: 'noindex, follow',
  });

  return (
    <Section>
      <Container>
        {isLoading ? (
          <div className="gr-cert gr-cert--loading" aria-busy="true" />
        ) : error || !cert ? (
          <div className="gr-board__empty">
            <h1>Certificate not found</h1>
            <p>Check the code and try again.</p>
          </div>
        ) : (
          <div className="gr-stack">
            <article className="gr-cert">
              <div className="gr-cert__inner">
                <BrandLogo size={44} />
                <p className="gr-cert__org">Chaitanya Tech World</p>
                <h1 className="gr-cert__heading">Certificate of Achievement</h1>
                <p className="gr-cert__lead">This certifies that</p>
                <p className="gr-cert__name">{cert.recipientName}</p>
                <p className="gr-cert__title">{cert.title}</p>
                <p className="gr-cert__desc">{cert.description}</p>
                <p className="gr-cert__meta">
                  <BadgeCheck size={16} aria-hidden="true" /> Verified · Issued{' '}
                  {new Date(cert.issuedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} · {cert.code}
                </p>
              </div>
            </article>
            <div className="gr-cert__actions">
              <Button href={linkedInUrl(cert)} target="_blank" rel="noopener noreferrer" iconEnd={<ExternalLink size={15} />}>
                Add to LinkedIn
              </Button>
              <Button variant="secondary" onClick={() => downloadPng(cert)} iconStart={<Download size={15} />}>
                Download image
              </Button>
            </div>
            <ShareBar url={`/certificate/${cert.code}`} text={`I just earned “${cert.title}” on Chaitanya Tech World 🎉`} campaign="certificate" title="Share your achievement" />
          </div>
        )}
      </Container>
    </Section>
  );
}

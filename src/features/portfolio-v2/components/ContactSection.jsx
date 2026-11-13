import { ArrowUpRight, Check, Mail, Phone, Send } from 'lucide-react';
import SocialIcon from '@/components/site/SocialIcon';
import { useContactForm } from '../hooks/useContactForm';
import { PROFILE } from '../data/portfolioContent';
import { FadeIn, PfButton, SectionHeading } from './ui';

const CHANNELS = [
  { label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: <Mail size={18} /> },
  { label: 'Phone', value: PROFILE.phone, href: PROFILE.phoneHref, icon: <Phone size={18} /> },
  ...PROFILE.socials.map((s) => ({
    label: s.label,
    value: s.handle,
    href: s.href,
    icon: <SocialIcon name={s.icon} size={18} />,
    external: true,
  })),
];

/** Field — input/textarea with a floating label (label text sits inside until focused/filled). */
function Field({ label, as = 'input', ...rest }) {
  const Control = as;
  return (
    <label className="pf-field">
      <Control className="pf-field__control" placeholder=" " {...rest} />
      <span className="pf-field__label">{label}</span>
    </label>
  );
}

function ContactForm() {
  const { values, status, onChange, onSubmit } = useContactForm();
  const sending = status === 'sending';

  return (
    <FadeIn as="form" delay={0.1} className="pf-form" onSubmit={onSubmit}>
      <div className="pf-form__row">
        <Field label="Your name" name="name" autoComplete="name" value={values.name} onChange={onChange} required />
        <Field
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={onChange}
          required
        />
      </div>
      <Field label="Subject" name="subject" value={values.subject} onChange={onChange} required />
      <Field label="Message" as="textarea" name="message" rows={5} value={values.message} onChange={onChange} required />

      {status === 'sent' && (
        <p className="pf-form__notice pf-form__notice--ok" role="status">
          <Check size={16} aria-hidden="true" /> Message sent — thanks! I’ll reply by email soon.
        </p>
      )}
      {status === 'error' && (
        <p className="pf-form__notice pf-form__notice--err" role="alert">
          Couldn’t send your message. Please try again or email{' '}
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.
        </p>
      )}

      <PfButton type="submit" loading={sending} iconEnd={<Send size={16} />} className="pf-form__submit">
        {sending ? 'Sending…' : 'Send message'}
      </PfButton>
    </FadeIn>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="pf-section pf-contact" aria-labelledby="pf-contact-title">
      <div className="pf-container">
        <div className="pf-contact__grid">
          <div>
            <SectionHeading
              id="pf-contact-title"
              number="05"
              kicker="Contact"
              title="Let’s build something"
              accent="reliable."
              description="Reach out about backend roles, collaborations or anything on this page."
            />
            <ul className="pf-channels">
              {CHANNELS.map((c, i) => (
                <FadeIn as="li" key={c.label} delay={i * 0.06}>
                  <a
                    href={c.href}
                    className="pf-channel"
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="pf-channel__icon">{c.icon}</span>
                    <span className="pf-channel__text">
                      <span className="pf-channel__label">{c.label}</span>
                      <span className="pf-channel__value">{c.value}</span>
                    </span>
                    <ArrowUpRight size={18} className="pf-channel__arrow" aria-hidden="true" />
                  </a>
                </FadeIn>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

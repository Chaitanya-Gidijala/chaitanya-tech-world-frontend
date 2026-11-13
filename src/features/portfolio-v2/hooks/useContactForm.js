import { useState } from 'react';
import config from '@/config/apiConfig';

const EMPTY = { name: '', email: '', subject: '', message: '' };
const TIMEOUT_MS = 20000;

/**
 * useContactForm — state + submission for the portfolio contact form.
 * status: 'idle' | 'sending' | 'sent' | 'error'
 */
export function useContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState('idle');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(config.endpoints.contact.submit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: 'N/A', // backend schema shared with ContactPage requires a phone value
          serviceType: values.subject.trim() || 'Portfolio Contact',
          budget: 0,
          message: values.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setValues(EMPTY);
      setStatus('sent');
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setStatus('error');
    } finally {
      clearTimeout(timer);
    }
  };

  return { values, status, onChange, onSubmit };
}

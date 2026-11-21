import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button, Container, Section, useDocumentMeta } from '@/design-system';
import { completeOAuth } from './session';
import { linkAndSync } from './sync';
import './account.css';

/** /oauth2/callback?token=… — finishes Google / GitHub sign-in from the security-service. */
export default function OAuthCallbackPage() {
  useDocumentMeta({ title: 'Signing you in… | Chaitanya Tech World', robots: 'noindex, nofollow' });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [failure, setFailure] = useState(null);
  const error = token ? failure : 'Sign-in was cancelled or did not complete.';
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !token) return;
    started.current = true;
    completeOAuth(token)
      .then(async ({ account, returnTo }) => {
        await linkAndSync(account?.provider);
        navigate(returnTo, { replace: true });
      })
      .catch(() => setFailure('We could not finish signing you in. Please try again.'));
  }, [token, navigate]);

  return (
    <Section>
      <Container size="narrow">
        <div className="acc-callback" role="status">
          {error ? (
            <>
              <h1>Sign-in didn’t finish</h1>
              <p>{error}</p>
              <Button to="/">Back to the site</Button>
            </>
          ) : (
            <>
              <Loader2 size={36} className="acc-spin" aria-hidden="true" />
              <h1>Signing you in…</h1>
              <p>Saving your progress to your account.</p>
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}

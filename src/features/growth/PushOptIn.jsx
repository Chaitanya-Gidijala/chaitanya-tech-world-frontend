import { useEffect, useState } from 'react';
import { Bell, BellOff, BellRing, Loader2 } from 'lucide-react';
import { currentPushSubscription, disablePush, enablePush, pushSupported } from './push';
import './growth.css';

/** "Remind me daily" toggle for browser push notifications. */
export default function PushOptIn() {
  const [state, setState] = useState('checking'); // checking | off | on | busy | unsupported | blocked
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!pushSupported()) {
      Promise.resolve().then(() => alive && setState('unsupported'));
      return () => {
        alive = false;
      };
    }
    currentPushSubscription()
      .then((sub) => {
        if (!alive) return;
        if (Notification.permission === 'denied') setState('blocked');
        else setState(sub ? 'on' : 'off');
      })
      .catch(() => alive && setState('off'));
    return () => {
      alive = false;
    };
  }, []);

  if (state === 'unsupported' || state === 'checking') return null;

  const toggle = async () => {
    setError(null);
    const was = state;
    setState('busy');
    try {
      if (was === 'on') {
        await disablePush();
        setState('off');
      } else {
        await enablePush();
        setState('on');
      }
    } catch (e) {
      setError(e.message);
      setState(Notification.permission === 'denied' ? 'blocked' : was);
    }
  };

  return (
    <div className="gr-push">
      <button type="button" className={`gr-push__btn is-${state}`} onClick={toggle} disabled={state === 'busy' || state === 'blocked'} aria-pressed={state === 'on'}>
        {state === 'busy' ? <Loader2 size={15} className="gr-spin" /> : state === 'on' ? <BellRing size={15} /> : state === 'blocked' ? <BellOff size={15} /> : <Bell size={15} />}
        {state === 'on' ? 'Daily reminder on' : state === 'blocked' ? 'Notifications blocked' : 'Remind me daily'}
      </button>
      {error && <p className="gr-error">{error}</p>}
    </div>
  );
}

import { Component } from 'react';
import { isChunkLoadError, reloadForNewDeploy } from '@/utils/lazyWithRetry';

/**
 * Catches render / lazy-load errors for a route so the app never shows a blank
 * screen. Stale-deploy chunk errors trigger a one-time reload; anything else
 * shows a recoverable message. Reset by changing `resetKey` (e.g. the pathname).
 */
export default class RouteErrorBoundary extends Component {
  state = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) return { error: null, resetKey: props.resetKey };
    return null;
  }

  componentDidCatch(error) {
    if (isChunkLoadError(error)) reloadForNewDeploy();
    console.error('Route crashed:', error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const stale = isChunkLoadError(error);
    return (
      <div className="route-error" role="alert">
        <h2>{stale ? 'A new version is available' : 'This page hit a problem'}</h2>
        <p>{stale ? 'The site was just updated. Reload to continue.' : String(error.message || error)}</p>
        <div className="route-error__actions">
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
          {!stale && (
            <button type="button" className="is-ghost" onClick={() => this.setState({ error: null })}>
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }
}

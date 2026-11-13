import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const TYPE_MS = 55;
const OUTPUT_DELAY_MS = 350;
const NEXT_LINE_MS = 650;

/**
 * Terminal — types each command character by character, then prints its output.
 * Reduced-motion users see the full session immediately.
 *
 * @param {{ cmd: string, out: string }[]} lines
 */
export default function Terminal({ lines, title = 'zsh — chaitanya@capgemini' }) {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(reduce ? lines.length : 0); // index of the line being typed
  const [chars, setChars] = useState(0); // characters typed on the current command
  const [showOut, setShowOut] = useState(false);

  useEffect(() => {
    if (reduce || line >= lines.length) return undefined;
    const cmd = lines[line].cmd;
    let timer;
    if (chars < cmd.length) {
      timer = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
    } else if (!showOut) {
      timer = setTimeout(() => setShowOut(true), OUTPUT_DELAY_MS);
    } else {
      timer = setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
        setShowOut(false);
      }, NEXT_LINE_MS);
    }
    return () => clearTimeout(timer);
  }, [line, chars, showOut, lines, reduce]);

  return (
    <figure className="pf-terminal" aria-label="Profile summary">
      <figcaption className="pf-terminal__bar">
        <span className="pf-terminal__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{title}</span>
      </figcaption>
      <div className="pf-terminal__body">
        {lines.map((l, i) => {
          if (i > line) return null;
          const typing = i === line;
          return (
            <div key={l.cmd} className="pf-terminal__entry">
              <p>
                <span className="pf-terminal__prompt">❯</span>{' '}
                <span className="pf-terminal__cmd">{typing ? l.cmd.slice(0, chars) : l.cmd}</span>
                {typing && !showOut && <span className="pf-terminal__caret" aria-hidden="true" />}
              </p>
              {(!typing || showOut) && <p className="pf-terminal__out">{l.out}</p>}
            </div>
          );
        })}
        {line >= lines.length && (
          <p>
            <span className="pf-terminal__prompt">❯</span> <span className="pf-terminal__caret" aria-hidden="true" />
          </p>
        )}
      </div>
    </figure>
  );
}

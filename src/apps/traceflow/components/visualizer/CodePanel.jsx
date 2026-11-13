import { useState } from 'react';
import clsx from 'clsx';
import CodeEditor from '../CodeEditor.jsx';

/** CodePanel — Java implementation synced to the current step, or language-neutral pseudocode. */
export default function CodePanel({ algo, activeLine, theme }) {
  const [mode, setMode] = useState('java');

  return (
    <div className="tfv-code">
      <div className="tfv-segment" role="tablist" aria-label="Code view">
        {[
          ['java', 'Java · synced'],
          ['pseudo', 'Pseudocode'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={clsx('tfv-segment__btn', mode === id && 'is-active')}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'java' ? (
        <div className="tfv-code__editor">
          <CodeEditor
            code={algo.codeLines.join('\n')}
            activeLine={activeLine}
            readOnly
            theme={theme}
            height={algo.codeLines.length * 24 + 32}
          />
        </div>
      ) : (
        <ol className="tfv-pseudo">
          {(algo.pseudocode ?? []).map((line, i) => (
            <li key={i}>
              <span className="tfv-pseudo__ln">{i + 1}</span>
              <code style={{ paddingLeft: `${(line.match(/^ */)[0].length / 2) * 1.1}rem` }}>{line.trim()}</code>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

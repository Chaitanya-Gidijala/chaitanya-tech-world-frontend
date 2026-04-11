import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
          dark:bg-slate-800 dark:text-white dark:focus:ring-indigo-400/50 dark:focus:border-indigo-400
          transition-colors disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900/50
          ${error ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Check } from 'lucide-react';
import './CustomInputModal.css';

export default function CustomInputModal({ 
  isOpen, 
  onClose, 
  onApply, 
  initialArray, 
  initialTarget, 
  hasTarget,
  requiresSorted
}) {
  const [arrayInput, setArrayInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setArrayInput(initialArray.join(', '));
      if (hasTarget && initialTarget !== null) {
        setTargetInput(String(initialTarget));
      }
      setError('');
    }
  }, [isOpen, initialArray, initialTarget, hasTarget]);

  if (!isOpen) return null;

  const handleRandomize = () => {
    // Generate an array of size 7-12 with random numbers between 1 and 99
    const size = Math.floor(Math.random() * 6) + 7;
    let newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    
    if (requiresSorted) {
      newArr.sort((a, b) => a - b);
    }
    
    setArrayInput(newArr.join(', '));
    
    if (hasTarget) {
      // 70% chance to pick an existing element as target, 30% chance to pick random
      if (Math.random() > 0.3) {
        setTargetInput(String(newArr[Math.floor(Math.random() * newArr.length)]));
      } else {
        setTargetInput(String(Math.floor(Math.random() * 99) + 1));
      }
    }
    setError('');
  };

  const handleApply = () => {
    try {
      // Parse array
      const rawValues = arrayInput.split(',').map(s => s.trim()).filter(s => s !== '');
      if (rawValues.length === 0) {
        throw new Error('Array cannot be empty.');
      }
      if (rawValues.length > 20) {
        throw new Error('Maximum array size is 20 for optimal visualization.');
      }
      
      const parsedArray = rawValues.map(val => {
        const num = parseInt(val, 10);
        if (isNaN(num)) throw new Error(`"${val}" is not a valid number.`);
        return num;
      });

      if (requiresSorted) {
        // Verify if sorted, if not, automatically sort it
        const isSorted = parsedArray.every((val, i, arr) => !i || (val >= arr[i - 1]));
        if (!isSorted) {
          parsedArray.sort((a, b) => a - b);
        }
      }

      // Parse target
      let parsedTarget = null;
      if (hasTarget) {
        if (!targetInput.trim()) {
          throw new Error('Target value is required.');
        }
        parsedTarget = parseInt(targetInput, 10);
        if (isNaN(parsedTarget)) {
          throw new Error('Target must be a valid number.');
        }
      }

      onApply(parsedArray, parsedTarget);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tf-modal-overlay" onClick={onClose}>
      <div className="tf-modal" onClick={e => e.stopPropagation()}>
        <div className="tf-modal__header">
          <h2 className="tf-modal__title">Custom Input</h2>
          <button className="tf-btn tf-btn--icon tf-btn--ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="tf-modal__content">
          {error && <div className="tf-modal__error">{error}</div>}
          
          <div className="tf-form-group">
            <label className="tf-form-label">
              Array Elements (comma-separated)
            </label>
            <textarea 
              className="tf-form-input tf-form-textarea"
              value={arrayInput}
              onChange={(e) => setArrayInput(e.target.value)}
              placeholder="e.g. 10, 42, 15, 23"
              rows={3}
            />
            {requiresSorted && (
              <p className="tf-form-hint">
                Note: This algorithm requires a sorted array. It will be automatically sorted if it isn't.
              </p>
            )}
          </div>

          {hasTarget && (
            <div className="tf-form-group">
              <label className="tf-form-label">Target Value</label>
              <input 
                type="number" 
                className="tf-form-input"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="e.g. 42"
              />
            </div>
          )}
        </div>

        <div className="tf-modal__footer">
          <button className="tf-btn tf-btn--secondary" onClick={handleRandomize}>
            <RefreshCw size={16} /> Randomize
          </button>
          <div className="tf-modal__actions">
            <button className="tf-btn tf-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="tf-btn tf-btn--primary" onClick={handleApply}>
              <Check size={16} /> Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { EventType } from '../../algorithms/types.js';
import { motion } from 'framer-motion';
import './ArrayRenderer.css';

/**
 * Renders an array of numbers as a bar chart.
 * 
 * @param {object} props
 * @param {object[]} props.array - Current state of the array as objects {id, val}
 * @param {import('../../algorithms/types.js').TraceEvent} props.currentEvent - The current event from the trace
 * @param {number} props.maxValue - Maximum possible value in the array for scaling
 */
export default function ArrayRenderer({ array, currentEvent, maxValue = 100 }) {
  if (!array || array.length === 0) return null;

  // Determine the state of each element based on the current event
  const getElementState = (index) => {
    if (!currentEvent) return 'default';

    const { type, indices, sortedIndices, discarded } = currentEvent;

    // Discarded (e.g., binary search halves)
    if (discarded && discarded.includes(index)) return 'discarded';

    // Sorted items (green)
    if (sortedIndices && sortedIndices.includes(index)) {
      // Flash success if it was just marked sorted in this event
      if (type === EventType.MARK_SORTED && indices.includes(index)) {
        return 'sorted-new';
      }
      return 'sorted';
    }

    // Active indices for the current event
    if (indices && indices.includes(index)) {
      switch (type) {
        case EventType.COMPARE: return 'comparing';
        case EventType.SWAP: return 'swapping';
        case EventType.SELECT: return 'selected';
        case EventType.POINTER_MOVE: return 'pointer';
        case EventType.MARK_FOUND: return 'found';
        case EventType.SHIFT: return 'swapping'; // Use swapping style for moving data
        case EventType.INSERT: return 'selected';
        default: return 'active';
      }
    }

    return 'default';
  };

  // Determine pointer labels (e.g., i, j, min, low, mid, high)
  const getPointers = (index) => {
    if (!currentEvent || !currentEvent.variables) return [];
    const pointers = [];
    Object.entries(currentEvent.variables).forEach(([key, val]) => {
      // Only show standard index pointers, not array values or temp variables
      if (['i', 'j', 'minIdx', 'low', 'mid', 'high', 'left', 'right', 'k'].includes(key) && val === index) {
        pointers.push(key);
      }
    });
    return pointers;
  };

  const totalVal = array.reduce((acc, curr) => acc + Math.abs(curr.val), 0);
  const mean = totalVal / array.length;
  // If the max value is heavily skewed compared to the average, use logarithmic scaling
  // to prevent the smaller bars from becoming completely flat.
  const hasExtremeOutlier = maxValue > mean * 3 && maxValue > 100;
  const maxLog = Math.log1p(maxValue);

  return (
    <div className="tf-array-renderer">
      <div className="tf-array-bars">
        {array.map((item, idx) => {
          const state = getElementState(idx);
          const pointers = getPointers(idx);
          
          let heightPercent;
          if (hasExtremeOutlier) {
            const valLog = Math.log1p(Math.abs(item.val));
            heightPercent = Math.max((valLog / maxLog) * 100, 5);
          } else {
            heightPercent = Math.max((Math.abs(item.val) / Math.max(1, maxValue)) * 100, 5);
          }

          const barStyle = { 
            height: `${heightPercent}%`,
          };

          return (
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              key={item.id} 
              className={`tf-array-bar-container tf-array-bar--${state}`}
            >
              {/* Value label */}
              <div className="tf-array-bar__val">{item.val}</div>
              
              {/* Bar */}
              <div 
                className="tf-array-bar__fill" 
                style={barStyle}
              >
              </div>
              
              {/* Index label */}
              <div className="tf-array-bar__idx">{idx}</div>

              {/* Pointer arrows */}
              <div className="tf-array-bar__pointers">
                {pointers.map(p => (
                  <div key={p} className={`tf-pointer-label tf-pointer-label--${p}`}>{p}</div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reveal — fades/slides its children in the first time they scroll into view.
 *
 * @param {number} delay     seconds before the animation starts (use for staggering)
 * @param {number} y         initial vertical offset in px
 * @param {string} as        element to render (div, li, section…)
 */
export default function Reveal({ as = 'div', delay = 0, y = 24, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

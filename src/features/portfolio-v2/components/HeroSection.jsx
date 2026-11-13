import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Download, MapPin } from 'lucide-react';
import { CountUp } from '@/design-system';
import SocialIcon from '@/components/site/SocialIcon';
import { HERO, PROFILE, STATS } from '../data/portfolioContent';
import Terminal from './Terminal';
import { PfButton } from './ui';

const EASE = [0.22, 1, 0.36, 1];

/** Name revealed word by word — each word slides up from behind a mask. */
function AnimatedName({ text }) {
  const reduce = useReducedMotion();
  return (
    <h1 id="pf-hero-title" className="pf-hero__name">
      {text.split(' ').map((word, i) => (
        <span key={word} className="pf-hero__word">
          <motion.span
            className="pf-hero__word-inner"
            initial={reduce ? false : { y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/** Cycles through phrases with a vertical slide. */
function RoleRotator({ roles }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [roles.length, reduce]);

  return (
    <span className="pf-rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          className="pf-rotator__item pf-gradient"
          initial={{ y: '60%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-60%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const fade = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

export default function HeroSection() {
  return (
    <section id="top" className="pf-hero" aria-labelledby="pf-hero-title">
      <div className="pf-container pf-hero__grid">
        <div className="pf-hero__copy">
          <motion.p className="pf-chip" {...fade(0)}>
            <span className="pf-chip__pulse" aria-hidden="true" />
            {HERO.eyebrow}
          </motion.p>

          <AnimatedName text={PROFILE.name} />

          <motion.p className="pf-hero__role" {...fade(0.7)}>
            I build <RoleRotator roles={HERO.roles} />
          </motion.p>

          <motion.p className="pf-hero__lead" {...fade(0.8)}>
            {HERO.lead}
          </motion.p>

          <motion.div className="pf-hero__actions" {...fade(0.9)}>
            <PfButton href="#contact" iconEnd={<ArrowRight size={17} />}>
              Get in touch
            </PfButton>
            <PfButton
              href={PROFILE.resume.href}
              download={PROFILE.resume.filename}
              variant="outline"
              iconStart={<Download size={17} />}
            >
              Download résumé
            </PfButton>
          </motion.div>

          <motion.div className="pf-hero__meta" {...fade(1)}>
            <span className="pf-hero__location">
              <MapPin size={15} aria-hidden="true" /> {PROFILE.location}
            </span>
            {PROFILE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="pf-icon-btn"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={s.icon} size={17} />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="pf-hero__visual"
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
        >
          <div className="pf-hero__orbit" aria-hidden="true">
            <span />
            <span />
          </div>
          <Terminal lines={HERO.terminal} />
        </motion.div>
      </div>

      <div className="pf-container">
        <dl className="pf-stats">
          {STATS.map((s, i) => (
            <motion.div key={s.label} className="pf-stat" {...fade(1.1 + i * 0.08)}>
              <dt>{s.label}</dt>
              <dd>
                <CountUp value={s.value} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>

      <a href="#about" className="pf-scroll-cue" aria-label="Scroll to About">
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

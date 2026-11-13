import { Fragment } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars -- `motion.*` is used as JSX member expressions.
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, Copy, Play, Sparkles } from 'lucide-react';
import { AuroraBackground, Button, Container, StatGroup } from '@/design-system';
import { HERO, STATS } from '../data/homeContent';
import SortingBars from './SortingBars';

const EASE = [0.22, 1, 0.36, 1];

const rise = (delay) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, delay, ease: EASE },
});

/** Headline revealed word by word; the accent words use the brand gradient. */
function Headline() {
  const reduce = useReducedMotion();
  const words = [...HERO.title.map((w) => ({ w })), ...HERO.titleAccent.map((w) => ({ w, accent: true }))];
  return (
    <h1 id="home-hero-title" className="hp-hero__title">
      {words.map(({ w, accent }, i) => (
        <Fragment key={`${w}-${i}`}>
          {/* The space lives between the clipped word boxes so lines can wrap normally. */}
          {i > 0 && ' '}
          <span className="hp-hero__word">
            <motion.span
              className={accent ? 'ds-gradient-text' : undefined}
              initial={reduce ? false : { y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </h1>
  );
}

/** Mouse-parallax container: children use `depth` to move by different amounts. */
function useParallax() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 80, damping: 20 });
  const y = useSpring(my, { stiffness: 80, damping: 20 });
  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };
  return { x, y, onPointerMove, onPointerLeave };
}

function Layer({ x, y, depth, className, children, delay = 0 }) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div className={className} style={{ x: tx, y: ty }} {...rise(delay)}>
      {children}
    </motion.div>
  );
}

function HeroVisual() {
  const { x, y, onPointerMove, onPointerLeave } = useParallax();
  return (
    <div className="hp-visual" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="hp-visual__glow" aria-hidden="true" />

      <Layer x={x} y={y} depth={-14} className="hp-window ds-spotlight" delay={0.35}>
        <div className="hp-window__bar">
          <span className="hp-window__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="hp-window__title">traceflow / bubble-sort</span>
          <span className="hp-window__live">
            <span aria-hidden="true" /> Live
          </span>
        </div>
        <div className="hp-window__body">
          <SortingBars />
          <div className="hp-code" aria-hidden="true">
            <span>
              <b>for</b> (int j = 0; j &lt; n - i - 1; j++)
            </span>
            <span className="is-hl">
              &nbsp;&nbsp;<b>if</b> (arr[j] &gt; arr[j + 1]) swap(arr, j, j + 1);
            </span>
          </div>
        </div>
      </Layer>

      <Layer x={x} y={y} depth={28} className="hp-float hp-float--a" delay={0.8}>
        <span className="hp-float__icon hp-float__icon--green">
          <CheckCircle2 size={16} />
        </span>
        <span>
          <strong>Phase 3 complete</strong>
          <small>Spring Boot fundamentals</small>
        </span>
      </Layer>

      <Layer x={x} y={y} depth={40} className="hp-float hp-float--b" delay={1}>
        <span className="hp-float__ring" style={{ '--p': 72 }}>
          <span>72%</span>
        </span>
        <span>
          <strong>CCAO-F readiness</strong>
          <small>7 exam domains mapped</small>
        </span>
      </Layer>

      <Layer x={x} y={y} depth={20} className="hp-float hp-float--c" delay={1.2}>
        <span className="hp-float__thumb" aria-hidden="true" />
        <span>
          <strong>Prompt copied</strong>
          <small>
            <Copy size={11} aria-hidden="true" /> Cinematic portrait
          </small>
        </span>
      </Layer>
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="hp-hero" aria-labelledby="home-hero-title">
      <AuroraBackground />
      <Container className="hp-hero__inner">
        <div className="hp-hero__copy">
          <motion.div {...rise(0)}>
            <Link to={HERO.announcement.to} className="hp-announce">
              <span className="hp-announce__tag">
                <Sparkles size={12} aria-hidden="true" /> {HERO.announcement.label}
              </span>
              <span className="hp-announce__text">{HERO.announcement.text}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>

          <Headline />

          <motion.p className="hp-hero__desc" {...rise(0.7)}>
            {HERO.description}
          </motion.p>

          <motion.div className="hp-hero__actions" {...rise(0.8)}>
            <Button to={HERO.primary.to} size="lg" iconEnd={<ArrowRight size={16} />}>
              {HERO.primary.label}
            </Button>
            <Button to={HERO.secondary.to} size="lg" variant="secondary" iconStart={<Play size={15} />}>
              {HERO.secondary.label}
            </Button>
          </motion.div>

          <motion.ul className="hp-hero__trust" {...rise(0.9)}>
            {HERO.trust.map((t) => (
              <li key={t}>
                <Check size={14} aria-hidden="true" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroVisual />
      </Container>

      <Container>
        <StatGroup items={STATS} className="hp-hero__stats" />
      </Container>
    </section>
  );
}

/**
 * ScrollRevealText — Ported from Framer (framer.com/m/ScrollRevealText-vXBxyx.js)
 * Original by AliThemes.com. Adapted for plain React/TypeScript.
 *
 * Splits text into characters, words, or lines and stagger-animates each unit
 * with scroll-linked or on-load opacity, color, blur, scale, and 3D transforms.
 * Uses IntersectionObserver + requestAnimationFrame — no Framer runtime needed.
 */

import { useRef, useEffect, useMemo, useState, CSSProperties } from 'react';

// ─── Preset definitions ────────────────────────────────────────────────────

type PresetConfig = {
  splitMode: 'Characters' | 'Words' | 'Lines';
  revealDirection: 'Left to Right' | 'Right to Left';
  stagger: number;
  xOffset: number;
  yOffset: number;
  blur: number;
  rotateX: number;
  perspective: number;
  scale: number;
};

const PRESETS: Record<string, PresetConfig> = {
  Default:        { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.2,  xOffset: 7,  yOffset: 0,   blur: 0,  rotateX: 0,   perspective: 800, scale: 1   },
  'Fade In Up':   { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.15, xOffset: 0,  yOffset: 25,  blur: 0,  rotateX: 0,   perspective: 800, scale: 1   },
  'Blur Reveal':  { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.2,  xOffset: 0,  yOffset: 0,   blur: 8,  rotateX: 0,   perspective: 800, scale: 1   },
  Cinematic:      { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.12, xOffset: 10, yOffset: 20,  blur: 4,  rotateX: 0,   perspective: 800, scale: 1   },
  '3D Flip':      { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.15, xOffset: 0,  yOffset: 0,   blur: 2,  rotateX: 45,  perspective: 800, scale: 1   },
  'Wave RTL':     { splitMode: 'Characters', revealDirection: 'Right to Left', stagger: 0.1,  xOffset: 5,  yOffset: 15,  blur: 0,  rotateX: 0,   perspective: 800, scale: 1   },
  Typewriter:     { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.4,  xOffset: 0,  yOffset: 0,   blur: 0,  rotateX: 0,   perspective: 800, scale: 1   },
  'Glitch Rise':  { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.08, xOffset: 15, yOffset: 40,  blur: 10, rotateX: 30,  perspective: 600, scale: 1   },
  'Soft Words':   { splitMode: 'Words',      revealDirection: 'Left to Right', stagger: 0.3,  xOffset: 0,  yOffset: 12,  blur: 3,  rotateX: 0,   perspective: 800, scale: 1   },
  'Cascade Down': { splitMode: 'Characters', revealDirection: 'Right to Left', stagger: 0.12, xOffset: 0,  yOffset: -30, blur: 5,  rotateX: -20, perspective: 900, scale: 1   },
  'Masked Lines': { splitMode: 'Lines',      revealDirection: 'Left to Right', stagger: 0.15, xOffset: 0,  yOffset: 0,   blur: 0,  rotateX: 0,   perspective: 800, scale: 1   },
  'Scale Pop':    { splitMode: 'Characters', revealDirection: 'Left to Right', stagger: 0.1,  xOffset: 0,  yOffset: 15,  blur: 2,  rotateX: 0,   perspective: 800, scale: 0.5 },
};

// ─── Types ─────────────────────────────────────────────────────────────────

type SplitMode       = 'Characters' | 'Words' | 'Lines';
type RevealDirection = 'Left to Right' | 'Right to Left';
type Trigger         = 'Scroll' | 'On Load';
type HtmlTag         = 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'div'|'span';

export interface ScrollRevealTextProps {
  text: string;
  tag?: HtmlTag;
  preset?: keyof typeof PRESETS | 'Custom';
  className?: string;
  style?: CSSProperties;

  // Colors
  colorHidden?: string;
  colorRevealed?: string;

  // Trigger
  trigger?: Trigger;
  onLoadDuration?: number;

  // Custom-mode overrides
  splitMode?: SplitMode;
  revealDirection?: RevealDirection;
  stagger?: number;
  xOffset?: number;
  yOffset?: number;
  blur?: number;
  rotateX?: number;
  perspective?: number;
  scale?: number;

  // Scroll offsets (viewport %)
  offsetStart?: number;
  offsetEnd?: number;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function ScrollRevealText({
  text,
  tag: Tag = 'div',
  preset = 'Cinematic',
  className,
  style,
  colorHidden   = '#9ca3af',
  colorRevealed = '#000000',
  trigger       = 'Scroll',
  onLoadDuration = 1.5,
  offsetStart   = 80,
  offsetEnd     = 20,
  ...custom
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const spanRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const isVisible    = useRef(false);
  const rafId        = useRef(0);
  const scheduled    = useRef(false);

  const [lineGroups, setLineGroups] = useState<number[][] | null>(null);

  // Resolve preset vs custom props
  const cfg = preset !== 'Custom' ? PRESETS[preset] : null;
  const splitMode       = cfg?.splitMode       ?? (custom.splitMode       ?? 'Characters');
  const revealDirection = cfg?.revealDirection  ?? (custom.revealDirection ?? 'Left to Right');
  const stagger         = cfg?.stagger          ?? (custom.stagger         ?? 0.2);
  const xOffset         = cfg?.xOffset          ?? (custom.xOffset         ?? 7);
  const yOffset         = cfg?.yOffset          ?? (custom.yOffset         ?? 0);
  const blur            = cfg?.blur             ?? (custom.blur            ?? 0);
  const rotateX         = cfg?.rotateX          ?? (custom.rotateX         ?? 0);
  const perspective     = cfg?.perspective      ?? (custom.perspective     ?? 800);
  const scale           = cfg?.scale            ?? (custom.scale           ?? 1);
  const isLinesMode     = splitMode === 'Lines';

  // ── Build token list ───────────────────────────────────────────────────

  type SpanDef = { char: string; unit: number; isSpace: boolean };
  type WordGroup = { type: 'word' | 'space'; spans: Array<SpanDef & { idx: number }> };

  const { allSpans, unitCount, wordGroups } = useMemo<{
    allSpans: SpanDef[];
    unitCount: number;
    wordGroups: WordGroup[];
  }>(() => {
    const tokens = String(text).split(/(\s+)/);
    const spans: SpanDef[] = [];
    let unitIdx = 0;

    tokens.forEach(token => {
      const isSpace = /^\s+$/.test(token);
      const chars   = Array.from(token);
      if (isSpace) {
        chars.forEach(ch => spans.push({ char: ch, unit: -1, isSpace: true }));
      } else if (splitMode === 'Words' || splitMode === 'Lines') {
        const idx = unitIdx++;
        chars.forEach(ch => spans.push({ char: ch, unit: idx, isSpace: false }));
      } else {
        chars.forEach(ch => spans.push({ char: ch, unit: unitIdx++, isSpace: false }));
      }
    });

    const groups: WordGroup[] = [];
    let current: WordGroup | null = null;
    spans.forEach((span, i) => {
      if (span.isSpace) {
        if (current) { groups.push(current); current = null; }
        groups.push({ type: 'space', spans: [{ ...span, idx: i }] });
      } else {
        if (!current) current = { type: 'word', spans: [] };
        current.spans.push({ ...span, idx: i });
      }
    });
    if (current) groups.push(current);

    if (revealDirection === 'Right to Left' && !isLinesMode) {
      const max = unitIdx - 1;
      spans.forEach(s => { if (!s.isSpace) s.unit = max - s.unit; });
    }

    return { allSpans: spans, unitCount: unitIdx, wordGroups: groups };
  }, [text, splitMode, revealDirection, isLinesMode]);

  // ── Lines mode: detect line breaks after render ────────────────────────

  useEffect(() => {
    if (!isLinesMode) { if (lineGroups !== null) setLineGroups(null); return; }

    const detect = () => {
      const container = containerRef.current;
      if (!container) return;
      const wordEls = container.querySelectorAll<HTMLElement>('[data-wg]');
      if (wordEls.length === 0) return;

      const positions: { gi: number; top: number }[] = [];
      wordEls.forEach(el => {
        positions.push({ gi: parseInt(el.dataset.wg!), top: Math.round(el.getBoundingClientRect().top) });
      });

      const lineWordGis: number[][] = [];
      let currentLine: number[] = [];
      let lastTop = -Infinity;
      positions.forEach(({ gi, top }) => {
        if (currentLine.length > 0 && Math.abs(top - lastTop) > 3) {
          lineWordGis.push([...currentLine]);
          currentLine = [];
        }
        currentLine.push(gi);
        lastTop = top;
      });
      if (currentLine.length > 0) lineWordGis.push([...currentLine]);

      const lines = lineWordGis.map((wordGis, li) => {
        const start = wordGis[0];
        const end   = li < lineWordGis.length - 1 ? lineWordGis[li + 1][0] : wordGroups.length;
        return Array.from({ length: end - start }, (_, k) => start + k);
      });

      if (revealDirection === 'Right to Left') lines.reverse();
      setLineGroups(lines);
    };

    requestAnimationFrame(() => requestAnimationFrame(detect));
  }, [text, splitMode, revealDirection, isLinesMode, wordGroups.length]);

  // ── Animation engine ───────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (isLinesMode && !lineGroups) return;

    const totalUnits = isLinesMode ? lineGroups!.length : unitCount;
    if (totalUnits === 0) return;

    if (!isLinesMode) spanRefs.current = spanRefs.current.slice(0, allSpans.length);

    const dur = 0.7;
    const totalTime = dur + (totalUnits - 1) * stagger;

    const applyProgress = (scrollP: number) => {
      const time = scrollP * totalTime;

      if (isLinesMode) {
        lineRefs.current.forEach((el, lineIdx) => {
          if (!el) return;
          const p = totalUnits <= 1 ? scrollP : Math.max(0, Math.min(1, (time - lineIdx * stagger) / dur));
          const ty = ((1 - p) * 100).toFixed(1);
          let tf = `translateY(${ty}%)`;
          if (rotateX !== 0) tf = `perspective(${perspective}px) rotateX(${(rotateX * (1 - p)).toFixed(1)}deg) ${tf}`;
          if (scale < 1)     tf += ` scale(${(scale + (1 - scale) * p).toFixed(3)})`;
          el.style.transform = tf;
          el.style.opacity   = `${0.3 + p * 0.7}`;
          el.style.filter    = blur > 0 ? `blur(${(blur * (1 - p)).toFixed(1)}px)` : '';
          el.style.color     = `color-mix(in srgb, ${colorRevealed} ${Math.round(p * 100)}%, ${colorHidden})`;
        });
      } else {
        spanRefs.current.forEach((el, i) => {
          if (!el) return;
          const span = allSpans[i];
          if (!span || span.isSpace) return;
          const p = totalUnits <= 1 ? scrollP : Math.max(0, Math.min(1, (time - span.unit * stagger) / dur));
          el.style.opacity = `${0.3 + p * 0.7}`;
          const tx = (-xOffset + xOffset * p).toFixed(1);
          const ty = (yOffset * (1 - p)).toFixed(1);
          let tf = '';
          if (rotateX !== 0) tf = `perspective(${perspective}px) rotateX(${(rotateX * (1 - p)).toFixed(1)}deg) `;
          tf += `translateX(${tx}px) translateY(${ty}px)`;
          if (scale < 1) tf += ` scale(${(scale + (1 - scale) * p).toFixed(3)})`;
          el.style.transform = tf;
          el.style.filter    = blur > 0 ? `blur(${(blur * (1 - p)).toFixed(1)}px)` : '';
          el.style.color     = `color-mix(in srgb, ${colorRevealed} ${Math.round(p * 100)}%, ${colorHidden})`;
        });
      }
    };

    // On Load trigger
    if (trigger === 'On Load') {
      let started = false;
      applyProgress(0);
      const startAnimation = () => {
        if (started) return;
        started = true;
        const startTime = performance.now();
        const animate = (now: number) => {
          const elapsed = (now - startTime) / 1000;
          const rawP    = Math.min(1, elapsed / onLoadDuration);
          applyProgress(1 - Math.pow(1 - rawP, 3));
          if (rawP < 1) rafId.current = requestAnimationFrame(animate);
        };
        rafId.current = requestAnimationFrame(animate);
      };
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { obs.disconnect(); startAnimation(); }
      }, { threshold: 0.1 });
      obs.observe(container);
      return () => { obs.disconnect(); cancelAnimationFrame(rafId.current); };
    }

    // Scroll-based trigger
    const startFrac = offsetStart / 100;
    const endFrac   = offsetEnd   / 100;

    const update = () => {
      const vh   = window.innerHeight;
      const rect = container.getBoundingClientRect();
      const range = (startFrac - endFrac) * vh;
      let scrollP: number;

      if (isLinesMode) {
        scrollP = 1;
        if (range > 0) {
          scrollP = Math.max(0, Math.min(1, (startFrac * vh - rect.top) / range));
          if (scrollP === 0 && rect.top < vh && rect.bottom > 0) scrollP = 1;
        }
      } else {
        if (range <= 0) return;
        scrollP = Math.max(0, Math.min(1, (startFrac * vh - rect.top) / range));
      }
      applyProgress(scrollP);
    };

    const obs = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
      if (entry.isIntersecting) update();
    }, { rootMargin: '200px' });
    obs.observe(container);

    const onScroll = () => {
      if (!isVisible.current || scheduled.current) return;
      scheduled.current = true;
      rafId.current = requestAnimationFrame(() => { update(); scheduled.current = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [allSpans, unitCount, lineGroups, isLinesMode, stagger, xOffset, yOffset, blur, rotateX,
      perspective, scale, trigger, onLoadDuration, offsetStart, offsetEnd, colorHidden, colorRevealed]);

  // ── Render ─────────────────────────────────────────────────────────────

  const renderWordGroup = (group: WordGroup, gi: number) => {
    if (group.type === 'word') {
      return (
        <span
          key={`w-${gi}`}
          data-wg={gi}
          style={{ whiteSpace: 'nowrap', display: 'inline' }}
        >
          {group.spans.map(({ char, idx }) => (
            <span
              key={idx}
              ref={el => { spanRefs.current[idx] = el; }}
              style={{ display: 'inline-block', willChange: isLinesMode ? undefined : 'transform, opacity, color, filter' }}
            >
              {char}
            </span>
          ))}
        </span>
      );
    }
    return group.spans.map(({ char, idx }) => (
      <span key={idx} style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00a0' : char}
      </span>
    ));
  };

  // Lines mode with detected lines → overflow-hidden wrappers
  if (isLinesMode && lineGroups) {
    return (
      <Tag
        ref={containerRef as React.RefObject<HTMLHeadingElement>}
        className={className}
        style={style}
      >
        {lineGroups.map((groupIndices, lineIdx) => (
          <div key={lineIdx} style={{ overflow: 'hidden', display: 'block' }}>
            <div
              ref={el => { lineRefs.current[lineIdx] = el; }}
              style={{ display: 'block', willChange: 'transform, opacity, filter' }}
            >
              {groupIndices.map(gi => renderWordGroup(wordGroups[gi], gi))}
            </div>
          </div>
        ))}
      </Tag>
    );
  }

  // Characters / Words (or Lines measurement pass)
  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={style}
    >
      {wordGroups.map((group, gi) => renderWordGroup(group, gi))}
    </Tag>
  );
}

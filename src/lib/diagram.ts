/**
 * Inline diagrams for blog posts.
 *
 * Diagrams are authored as small specs and rendered to SVG here, rather than
 * hand-drawn per post. One renderer means twelve diagrams share a visual
 * language, restyling is one file, and a post's source stays readable.
 *
 * Colours come through style attributes referencing the site tokens, so the
 * diagrams follow the light/dark toggle. Presentation attributes would not:
 * var() resolves in CSS properties, not in bare SVG attributes.
 */

const BLUE = 'var(--color-accent-blue)';
const ORANGE = 'var(--color-accent-orange)';
const TEXT = 'var(--color-text-primary)';
const MUTED = 'var(--color-text-secondary)';
const LINE = 'var(--color-border)';
const PANEL = 'var(--color-bg-elevated)';

export type Diagram =
  /** Ordered steps with arrows between them. Optional phase labels above. */
  | { kind: 'flow'; title: string; caption?: string; steps: { label: string; sub?: string; accent?: boolean }[] }
  /** Layers read bottom-up as a foundation, or top-down as a funnel. */
  | { kind: 'stack'; title: string; caption?: string; layers: { label: string; sub?: string; accent?: boolean }[] }
  /** Side-by-side options scored on the same rows. */
  | {
      kind: 'columns';
      title: string;
      caption?: string;
      rows: string[];
      cols: { label: string; accent?: boolean; values: string[] }[];
    }
  /** Two axes, four zones, items placed by judgement. */
  | {
      kind: 'quadrant';
      title: string;
      caption?: string;
      xAxis: [string, string];
      yAxis: [string, string];
      items: { label: string; x: number; y: number; accent?: boolean }[];
    };

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Wrap a label to fit a box, since SVG text does not wrap on its own. */
function wrap(text: string, maxChars: number, maxLines = 3): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function textBlock(lines: string[], x: number, y: number, size: number, weight: number, fill: string, anchor = 'middle') {
  return lines
    .map(
      (l, i) =>
        `<text x="${x}" y="${y + i * (size + 3)}" text-anchor="${anchor}" style="fill:${fill};font-size:${size}px;font-weight:${weight};font-family:inherit">${esc(l)}</text>`
    )
    .join('');
}

function frame(inner: string, w: number, h: number, d: Diagram): string {
  const desc = d.caption ? `<desc>${esc(d.caption)}</desc>` : '';
  return `<figure class="post-diagram">
  <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(d.title)}" preserveAspectRatio="xMidYMid meet">
    <title>${esc(d.title)}</title>${desc}
    ${inner}
  </svg>
  ${d.caption ? `<figcaption>${esc(d.caption)}</figcaption>` : ''}
</figure>`;
}

function arrow(x: number, y: number): string {
  return `<path d="M${x} ${y} l14 0 m-5 -5 l5 5 l-5 5" style="stroke:${MUTED};stroke-width:1.6;fill:none;stroke-linecap:round;stroke-linejoin:round"/>`;
}

function renderFlow(d: Extract<Diagram, { kind: 'flow' }>): string {
  const n = d.steps.length;
  const gap = 26;
  const boxW = Math.floor((820 - gap * (n - 1)) / n);
  const boxH = 96;
  const parts = d.steps.map((s, i) => {
    const x = i * (boxW + gap);
    const stroke = s.accent ? ORANGE : LINE;
    const labelLines = wrap(s.label, Math.floor(boxW / 8), 2);
    const subLines = s.sub ? wrap(s.sub, Math.floor(boxW / 6.4), 2) : [];
    const cy = subLines.length ? 40 : 52;
    return `<g transform="translate(${x} 12)">
      <rect width="${boxW}" height="${boxH}" rx="10" style="fill:${PANEL};stroke:${stroke};stroke-width:${s.accent ? 2 : 1}"/>
      ${textBlock(labelLines, boxW / 2, cy, 15, 700, s.accent ? ORANGE : TEXT)}
      ${subLines.length ? textBlock(subLines, boxW / 2, cy + 24, 12, 400, MUTED) : ''}
    </g>${i < n - 1 ? arrow(x + boxW + 5, 12 + boxH / 2) : ''}`;
  });
  return frame(parts.join(''), 820, 120, d);
}

function renderStack(d: Extract<Diagram, { kind: 'stack' }>): string {
  const rowH = 56;
  const parts = d.layers.map((l, i) => {
    const y = i * (rowH + 10);
    const stroke = l.accent ? ORANGE : LINE;
    return `<g transform="translate(0 ${y})">
      <rect width="820" height="${rowH}" rx="10" style="fill:${PANEL};stroke:${stroke};stroke-width:${l.accent ? 2 : 1}"/>
      <rect width="6" height="${rowH}" rx="3" style="fill:${l.accent ? ORANGE : BLUE}"/>
      <text x="26" y="${l.sub ? 24 : 33}" style="fill:${l.accent ? ORANGE : TEXT};font-size:15px;font-weight:700;font-family:inherit">${esc(l.label)}</text>
      ${l.sub ? `<text x="26" y="43" style="fill:${MUTED};font-size:12.5px;font-family:inherit">${esc(l.sub)}</text>` : ''}
    </g>`;
  });
  return frame(parts.join(''), 820, d.layers.length * (rowH + 10) - 10, d);
}

function renderColumns(d: Extract<Diagram, { kind: 'columns' }>): string {
  const labelW = 190;
  const colW = Math.floor((820 - labelW - 16 * d.cols.length) / d.cols.length);
  const headH = 46;
  const rowH = 54;
  const height = headH + d.rows.length * rowH;

  const heads = d.cols.map((c, i) => {
    const x = labelW + i * (colW + 16);
    return `<g transform="translate(${x} 0)">
      <rect width="${colW}" height="${height}" rx="10" style="fill:${c.accent ? 'var(--color-bg-secondary)' : 'transparent'};stroke:${c.accent ? ORANGE : LINE};stroke-width:${c.accent ? 2 : 1}"/>
      ${textBlock(wrap(c.label, Math.floor(colW / 7.5), 2), colW / 2, 26, 14.5, 700, c.accent ? ORANGE : TEXT)}
    </g>`;
  });

  const rows = d.rows.map((r, ri) => {
    const y = headH + ri * rowH;
    const cells = d.cols.map((c, ci) => {
      const x = labelW + ci * (colW + 16);
      return textBlock(wrap(c.values[ri] ?? '', Math.floor(colW / 6.2), 2), x + colW / 2, y + 24, 12.5, 400, TEXT);
    });
    return `<line x1="0" y1="${y}" x2="820" y2="${y}" style="stroke:${LINE};stroke-width:1"/>
      ${textBlock(wrap(r, 26, 2), 0, y + 24, 13, 700, MUTED, 'start')}
      ${cells.join('')}`;
  });

  return frame(heads.join('') + rows.join(''), 820, height, d);
}

function renderQuadrant(d: Extract<Diagram, { kind: 'quadrant' }>): string {
  // Asymmetric padding: the y-axis labels are words, not ticks, so the left
  // gutter has to be wide enough to hold them. A symmetric pad clipped them.
  const size = 380;
  const padL = 150;
  const padT = 30;
  const padR = 40;
  const padB = 46;
  const px = (v: number) => padL + v * size;
  const py = (v: number) => padT + (1 - v) * size;

  const dots = d.items.map((it) => {
    const c = it.accent ? ORANGE : BLUE;
    // Points near the right edge get their label on the inside, otherwise it
    // runs off the viewBox and the reader loses the word that matters.
    const flip = it.x > 0.58;
    const tx = flip ? px(it.x) - 11 : px(it.x) + 11;
    return `<g><circle cx="${px(it.x)}" cy="${py(it.y)}" r="6" style="fill:${c}"/>
      <text x="${tx}" y="${py(it.y) + 4}" text-anchor="${flip ? 'end' : 'start'}" style="fill:${TEXT};font-size:12.5px;font-weight:${it.accent ? 700 : 400};font-family:inherit">${esc(it.label)}</text></g>`;
  });

  return frame(
    `<rect x="${padL}" y="${padT}" width="${size}" height="${size}" rx="8" style="fill:${PANEL};stroke:${LINE};stroke-width:1"/>
     <line x1="${padL}" y1="${padT + size / 2}" x2="${padL + size}" y2="${padT + size / 2}" style="stroke:${LINE};stroke-width:1;stroke-dasharray:4 4"/>
     <line x1="${padL + size / 2}" y1="${padT}" x2="${padL + size / 2}" y2="${padT + size}" style="stroke:${LINE};stroke-width:1;stroke-dasharray:4 4"/>
     <text x="${padL}" y="${padT + size + 28}" style="fill:${MUTED};font-size:12.5px;font-family:inherit">${esc(d.xAxis[0])}</text>
     <text x="${padL + size}" y="${padT + size + 28}" text-anchor="end" style="fill:${MUTED};font-size:12.5px;font-family:inherit">${esc(d.xAxis[1])}</text>
     <text x="${padL - 14}" y="${padT + size - 4}" text-anchor="end" style="fill:${MUTED};font-size:12.5px;font-family:inherit">${esc(d.yAxis[0])}</text>
     <text x="${padL - 14}" y="${padT + 14}" text-anchor="end" style="fill:${MUTED};font-size:12.5px;font-family:inherit">${esc(d.yAxis[1])}</text>
     ${dots.join('')}`,
    padL + size + padR,
    padT + size + padB,
    d
  );
}

export function renderDiagram(d: Diagram): string {
  switch (d.kind) {
    case 'flow':
      return renderFlow(d);
    case 'stack':
      return renderStack(d);
    case 'columns':
      return renderColumns(d);
    case 'quadrant':
      return renderQuadrant(d);
  }
}

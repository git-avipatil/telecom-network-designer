import { COMPONENT_MAP, ICONS, LINK_TYPE_MAP } from '../data/catalog.js';
import { fmtBw, money } from './bom.js';

export const NODE_W = 120;
export const NODE_H = 96;
const TILE = 52;
const FONT = 'Inter, Segoe UI, Helvetica, Arial, sans-serif';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const safeName = (s) => (s || 'network-diagram').trim().replace(/[^\w.-]+/g, '_');

const box = (n) => ({
  x: n.position.x, y: n.position.y,
  w: n.measured?.width || n.width || NODE_W,
  h: n.measured?.height || n.height || NODE_H,
});

// Connection dots sit on the icon tile, so links attach to the tile edges.
function anchor(n, handle) {
  const b = box(n);
  const cx = b.x + b.w / 2, cy = b.y + TILE / 2;
  if (handle === 't') return [cx, b.y];
  if (handle === 'b') return [cx, b.y + TILE];
  if (handle === 'l') return [cx - TILE / 2, cy];
  if (handle === 'r') return [cx + TILE / 2, cy];
  return [cx, cy];
}

function wrap(text, max = 20) {
  const lines = [];
  let cur = '';
  String(text || '').split(/\s+/).forEach((w) => {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  });
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function edgeLabel(d) {
  const lt = LINK_TYPE_MAP[d.linkType];
  return [lt?.name || d.linkType, fmtBw(d), d.sla === '' || d.sla == null ? '' : `SLA ${d.sla}%`].filter(Boolean).join(' · ');
}

/** Builds a standalone vector SVG of the diagram (no screenshots involved). */
export function buildSvg(nodes, edges, meta = {}) {
  const PAD = 40, HEADER = 56;
  const usedTypes = [...new Set(edges.map((e) => e.data?.linkType))].map((t) => LINK_TYPE_MAP[t]).filter(Boolean);
  const LEGEND = usedTypes.length ? 34 : 0;

  const boxes = nodes.map(box);
  const minX = boxes.length ? Math.min(...boxes.map((b) => b.x)) : 0;
  const minY = boxes.length ? Math.min(...boxes.map((b) => b.y)) : 0;
  const maxX = boxes.length ? Math.max(...boxes.map((b) => b.x + b.w)) : 400;
  const maxY = boxes.length ? Math.max(...boxes.map((b) => b.y + b.h)) : 200;
  const legendW = usedTypes.reduce((s, t) => s + 50 + t.name.length * 6.4, 0);
  const width = Math.max(maxX - minX + PAD * 2, legendW + PAD * 2, 520);
  const height = maxY - minY + PAD * 2 + HEADER + LEGEND;
  const ox = PAD - minX + (width - (maxX - minX + PAD * 2)) / 2;
  const oy = PAD + HEADER - minY;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="${FONT}">`;
  out += `<rect width="100%" height="100%" fill="#ffffff"/>`;
  out += `<text x="${PAD}" y="30" font-size="17" font-weight="700" fill="#0f172a">${esc(meta.project || 'Network Diagram')}</text>`;
  const sub = [meta.customer && `Customer: ${meta.customer}`, meta.quoteRef && `Ref: ${meta.quoteRef}`].filter(Boolean).join('   |   ');
  if (sub) out += `<text x="${PAD}" y="48" font-size="11" fill="#64748b">${esc(sub)}</text>`;

  out += `<g transform="translate(${ox},${oy})">`;
  const labels = [];
  edges.forEach((e) => {
    const s = byId[e.source], t = byId[e.target];
    if (!s || !t) return;
    const lt = LINK_TYPE_MAP[e.data?.linkType] || { color: '#64748b' };
    const [x1, y1] = anchor(s, e.sourceHandle);
    const [x2, y2] = anchor(t, e.targetHandle);
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lt.color}" stroke-width="2.5" stroke-linecap="round"${lt.dash ? ` stroke-dasharray="${lt.dash}"` : ''}/>`;
    labels.push({ x: (x1 + x2) / 2, y: (y1 + y2) / 2, text: edgeLabel(e.data || {}), color: lt.color });
  });
  labels.forEach((l) => {
    const w = l.text.length * 5.6 + 12;
    out += `<rect x="${l.x - w / 2}" y="${l.y - 9}" width="${w}" height="18" rx="4" fill="#ffffff" stroke="${l.color}" stroke-opacity="0.35"/>`;
    out += `<text x="${l.x}" y="${l.y + 3.5}" font-size="10" font-weight="600" text-anchor="middle" fill="#1e293b">${esc(l.text)}</text>`;
  });
  nodes.forEach((n) => {
    const c = COMPONENT_MAP[n.data.typeId] || { color: '#475569', icon: 'router' };
    const b = box(n);
    const tx = b.x + b.w / 2 - TILE / 2, ty = b.y;
    out += `<rect x="${tx}" y="${ty}" width="${TILE}" height="${TILE}" rx="12" fill="#ffffff"/>`;
    out += `<rect x="${tx}" y="${ty}" width="${TILE}" height="${TILE}" rx="12" fill="${c.color}" fill-opacity="0.1" stroke="${c.color}" stroke-width="1.5"/>`;
    out += `<g transform="translate(${tx + 9},${ty + 9}) scale(${34 / 48})" fill="none" stroke="${c.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[c.icon] || ''}</g>`;
    if (Number(n.data.qty) > 1) {
      out += `<rect x="${tx + TILE - 14}" y="${ty - 7}" width="28" height="15" rx="7.5" fill="${c.color}"/>`;
      out += `<text x="${tx + TILE}" y="${ty + 4}" font-size="9.5" font-weight="700" text-anchor="middle" fill="#fff">×${esc(n.data.qty)}</text>`;
    }
    let y = ty + TILE + 15;
    wrap(n.data.label).forEach((line) => {
      out += `<text x="${b.x + b.w / 2}" y="${y}" font-size="11.5" font-weight="600" text-anchor="middle" fill="#0f172a" stroke="#ffffff" stroke-width="3" paint-order="stroke">${esc(line)}</text>`;
      y += 14;
    });
    if (n.data.location)
      out += `<text x="${b.x + b.w / 2}" y="${y - 1}" font-size="10" text-anchor="middle" fill="#64748b" stroke="#ffffff" stroke-width="3" paint-order="stroke">${esc(n.data.location)}</text>`;
  });
  out += `</g>`;

  if (usedTypes.length) {
    let lx = PAD;
    const ly = height - 18;
    usedTypes.forEach((t) => {
      out += `<line x1="${lx}" y1="${ly}" x2="${lx + 28}" y2="${ly}" stroke="${t.color}" stroke-width="2.5"${t.dash ? ` stroke-dasharray="${t.dash}"` : ''}/>`;
      out += `<text x="${lx + 34}" y="${ly + 3.5}" font-size="10" fill="#475569">${esc(t.name)}</text>`;
      lx += 50 + t.name.length * 6.4;
    });
  }
  out += `</svg>`;
  return { svg: out, width, height };
}

export function download(content, filename, mime) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function svgToCanvas({ svg, width, height }, scale = 2) {
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas;
}

export function exportSvg(nodes, edges, meta) {
  download(buildSvg(nodes, edges, meta).svg, `${safeName(meta.project)}.svg`, 'image/svg+xml');
}

export async function exportPng(nodes, edges, meta) {
  const canvas = await svgToCanvas(buildSvg(nodes, edges, meta), 2);
  canvas.toBlob((blob) => download(blob, `${safeName(meta.project)}.png`), 'image/png');
}

// ---- Tabular definitions shared by PDF and Excel ---------------------------
const LINK_COLS = [
  ['#', 'no', 5], ['Link type', 'linkType', 22], ['A-end device', 'aNode', 22], ['A-end location', 'aLocation', 16],
  ['Z-end device', 'zNode', 22], ['Z-end location', 'zLocation', 16], ['Bandwidth', 'bandwidth', 12], ['SLA %', 'sla', 8],
  ['Term (months)', 'term', 12], ['Class of service', 'cos', 16], ['CPQ offer code', 'offerCode', 18],
  ['CPQ offer name', 'offerName', 34], ['MRC', 'mrc', 14], ['NRC', 'nrc', 14], ['Description', 'description', 70], ['Notes', 'notes', 24],
];
const EQUIP_COLS = [
  ['#', 'no', 5], ['Name', 'name', 26], ['Component type', 'type', 26], ['Category', 'category', 22], ['Location', 'location', 16],
  ['Vendor', 'vendor', 14], ['Model', 'model', 18], ['Qty', 'qty', 7], ['Details', 'details', 44], ['CPQ offer code', 'offerCode', 18],
  ['CPQ offer name', 'offerName', 34], ['Unit MRC', 'mrc', 14], ['Unit NRC', 'nrc', 14], ['Notes', 'notes', 24],
];
const QUOTE_COLS = [
  ['Line', 'lineNo', 6], ['Item type', 'itemType', 12], ['Offer code', 'offerCode', 18], ['Offer name', 'offerName', 34],
  ['Description', 'description', 70], ['A-end / Location', 'aEnd', 18], ['Z-end', 'zEnd', 16], ['Bandwidth', 'bandwidth', 12],
  ['SLA %', 'sla', 8], ['Term (months)', 'term', 12], ['Qty', 'qty', 7], ['Unit MRC', 'unitMrc', 14], ['Unit NRC', 'unitNrc', 14],
  ['Total MRC', 'totalMrc', 14], ['Total NRC', 'totalNrc', 14],
];

export async function exportExcel(bom, rules, meta) {
  const mod = await import('exceljs');
  const ExcelJS = mod.default || mod;
  const wb = new ExcelJS.Workbook();
  wb.created = new Date();

  const addSheet = (name, cols, rows) => {
    const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
    ws.columns = cols.map(([header, key, width]) => ({ header, key, width }));
    rows.forEach((r) => ws.addRow(r));
    const head = ws.getRow(1);
    head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: cols.length } };
    cols.forEach(([header], i) => {
      if (/MRC|NRC/.test(header)) ws.getColumn(i + 1).numFmt = '#,##0';
    });
    return ws;
  };

  const sum = wb.addWorksheet('Summary');
  sum.columns = [{ width: 28 }, { width: 44 }];
  [
    ['Project', meta.project], ['Customer', meta.customer], ['Quote / opportunity ref', meta.quoteRef],
    ['Currency', meta.currency], ['Generated', new Date().toLocaleString()], [],
    ['Links', bom.links.length], ['Equipment / device lines', bom.equipment.length],
    ['Quote lines', bom.quoteLines.length], ['Items without a CPQ offer', bom.unmapped], [],
    ['Total monthly recurring (MRC)', bom.totals.mrc], ['Total one-time (NRC)', bom.totals.nrc],
  ].forEach((r) => sum.addRow(r));
  sum.getColumn(1).font = { bold: true };
  sum.getCell('B12').numFmt = '#,##0';
  sum.getCell('B13').numFmt = '#,##0';

  addSheet('Links', LINK_COLS, bom.links);
  addSheet('Equipment', EQUIP_COLS, bom.equipment);
  const q = addSheet('Quote Lines', QUOTE_COLS, bom.quoteLines);
  if (bom.quoteLines.length) {
    const last = bom.quoteLines.length + 1;
    const total = q.addRow({ description: 'TOTAL' });
    total.getCell(14).value = { formula: `SUM(N2:N${last})`, result: bom.totals.mrc };
    total.getCell(15).value = { formula: `SUM(O2:O${last})`, result: bom.totals.nrc };
    total.font = { bold: true };
  }
  addSheet(
    'Offer Mapping',
    [['Scope', 'scope', 12], ['Link / component type', 'key', 24], ['Min Mbps', 'minMbps', 10], ['Max Mbps', 'maxMbps', 10],
     ['Offer code', 'offerCode', 18], ['Offer name', 'offerName', 38], ['MRC', 'mrc', 14], ['NRC', 'nrc', 14]],
    rules
  );

  const buf = await wb.xlsx.writeBuffer();
  download(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${safeName(meta.project)}_BOM.xlsx`);
}

export async function exportPdf(nodes, edges, bom, meta) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 30;

  const pic = buildSvg(nodes, edges, meta);
  const canvas = await svgToCanvas(pic, 2);
  const ratio = Math.min((W - M * 2) / pic.width, (H - M * 2) / pic.height);
  doc.addImage(canvas.toDataURL('image/png'), 'PNG', (W - pic.width * ratio) / 2, M, pic.width * ratio, pic.height * ratio, undefined, 'FAST');

  const cur = (v) => money(v, meta.currency).replace(/[^\x20-\x7E]/g, '').trim() || '0';
  const table = (title, head, body, foot) => {
    doc.addPage();
    doc.setFontSize(13);
    doc.text(title, M, M + 6);
    autoTable(doc, {
      startY: M + 16, margin: { left: M, right: M }, head: [head], body, foot: foot ? [foot] : undefined,
      styles: { fontSize: 7.5, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [30, 41, 59] }, footStyles: { fillColor: [226, 232, 240], textColor: 20 },
    });
  };
  table('Links', ['#', 'Type', 'A-end', 'Z-end', 'Bandwidth', 'SLA %', 'Term', 'CPQ offer', `MRC (${meta.currency})`, `NRC (${meta.currency})`],
    bom.links.map((l) => [l.no, l.linkType, [l.aNode, l.aLocation].filter(Boolean).join(', '), [l.zNode, l.zLocation].filter(Boolean).join(', '),
      l.bandwidth, l.sla, l.term, l.offerCode ? `${l.offerCode} - ${l.offerName}` : l.quotable ? 'UNMAPPED' : '-', l.offerCode ? cur(l.mrc) : '', l.offerCode ? cur(l.nrc) : '']));
  table('Equipment, devices & subscriptions', ['#', 'Name', 'Type', 'Location', 'Vendor / model', 'Qty', 'Details', 'CPQ offer', 'Unit MRC', 'Unit NRC'],
    bom.equipment.map((q) => [q.no, q.name, q.type, q.location, [q.vendor, q.model].filter(Boolean).join(' '), q.qty, q.details,
      q.offerCode ? `${q.offerCode} - ${q.offerName}` : 'UNMAPPED', q.offerCode ? cur(q.mrc) : '', q.offerCode ? cur(q.nrc) : '']));
  table(`Quote lines (${meta.currency})`, ['Line', 'Offer code', 'Offer name', 'Description', 'Qty', 'Unit MRC', 'Unit NRC', 'Total MRC', 'Total NRC'],
    bom.quoteLines.map((q) => [q.lineNo, q.offerCode, q.offerName, q.description, q.qty, cur(q.unitMrc), cur(q.unitNrc), cur(q.totalMrc), cur(q.totalNrc)]),
    ['', '', '', 'TOTAL', '', '', '', cur(bom.totals.mrc), cur(bom.totals.nrc)]);

  doc.save(`${safeName(meta.project)}.pdf`);
}

/** JSON payload shaped for pushing into a CPQ system. */
export function exportCpqJson(bom, meta) {
  const payload = {
    project: meta.project, customer: meta.customer, quoteRef: meta.quoteRef, currency: meta.currency,
    generatedAt: new Date().toISOString(),
    totals: bom.totals,
    quoteLines: bom.quoteLines,
    links: bom.links,
    equipment: bom.equipment,
  };
  download(JSON.stringify(payload, null, 2), `${safeName(meta.project)}_cpq.json`, 'application/json');
}

export function saveDiagram(state) {
  download(JSON.stringify(state, null, 2), `${safeName(state.meta.project)}.netdiagram.json`, 'application/json');
}

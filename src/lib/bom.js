import { COMPONENT_MAP, CATEGORY_MAP, LINK_TYPE_MAP } from '../data/catalog.js';

export const toMbps = (value, unit) => {
  const n = Number(value) || 0;
  if (unit === 'Gbps') return n * 1000;
  if (unit === 'Kbps') return n / 1000;
  return n;
};

export const fmtBw = (d) => (d.bandwidth === '' || d.bandwidth == null ? '' : `${d.bandwidth} ${d.bwUnit}`);
const blank = (v) => v === '' || v == null;
const num = (v) => Number(v) || 0;

const inRange = (rule, mbps) =>
  (blank(rule.minMbps) || mbps >= Number(rule.minMbps)) && (blank(rule.maxMbps) || mbps <= Number(rule.maxMbps));

/** Manual override wins; otherwise the first rule (top to bottom) that matches. */
export function resolveOffer(rules, scope, key, data, mbps = 0) {
  if (data.offerOverride) {
    const forced = rules.find((r) => r.id === data.offerOverride);
    if (forced) return forced;
  }
  return rules.find((r) => r.scope === scope && (r.key === key || r.key === '*') && (scope !== 'link' || inRange(r, mbps))) || null;
}

export function linkSentence(typeName, aEnd, zEnd, data) {
  let s = `${typeName} connectivity between ${aEnd} and ${zEnd}`;
  const parts = [];
  if (fmtBw(data)) parts.push(`${fmtBw(data)} bandwidth`);
  if (!blank(data.sla)) parts.push(`${data.sla}% SLA`);
  if (parts.length) s += ` with ${parts.join(' and ')}`;
  return s;
}

const extraDetails = (comp, data) =>
  (comp.fields || [])
    .filter((f) => !blank(data[f.key]))
    .map((f) => `${f.label}: ${data[f.key]}`)
    .join('; ');

/** Turns the diagram into link, equipment and quote-line lists. */
export function buildBom(nodes, edges, rules) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const links = edges.map((e, i) => {
    const d = e.data || {};
    const lt = LINK_TYPE_MAP[d.linkType] || { name: d.linkType || 'Link' };
    const a = byId[e.source]?.data || {};
    const z = byId[e.target]?.data || {};
    const quotable = lt.bom !== false;
    const offer = quotable ? resolveOffer(rules, 'link', d.linkType, d, toMbps(d.bandwidth, d.bwUnit)) : null;
    const aEnd = a.location || a.label || '?';
    const zEnd = z.location || z.label || '?';
    return {
      id: e.id, no: i + 1, quotable,
      linkType: lt.name, linkTypeId: d.linkType,
      aNode: a.label || '', aLocation: a.location || '',
      zNode: z.label || '', zLocation: z.location || '',
      bandwidth: fmtBw(d), bandwidthMbps: toMbps(d.bandwidth, d.bwUnit),
      sla: blank(d.sla) ? '' : Number(d.sla), term: blank(d.term) ? '' : Number(d.term),
      cos: d.cos || '', notes: d.notes || '',
      description: linkSentence(lt.name, aEnd, zEnd, d),
      offerCode: offer?.offerCode || '', offerName: offer?.offerName || '',
      mrc: num(offer?.mrc), nrc: num(offer?.nrc),
    };
  });

  const equipment = nodes
    .filter((n) => COMPONENT_MAP[n.data.typeId] && COMPONENT_MAP[n.data.typeId].bom !== false)
    .map((n, i) => {
      const d = n.data;
      const comp = COMPONENT_MAP[d.typeId];
      const qty = Math.max(1, num(d.qty) || 1);
      const offer = resolveOffer(rules, 'component', d.typeId, d);
      return {
        id: n.id, no: i + 1, quotable: true,
        name: d.label, type: comp.name, typeId: d.typeId, category: CATEGORY_MAP[comp.category]?.name || '',
        location: d.location || '', vendor: d.vendor || '', model: d.model || '', qty,
        details: extraDetails(comp, d), notes: d.notes || '', term: blank(d.term) ? '' : Number(d.term),
        offerCode: offer?.offerCode || '', offerName: offer?.offerName || '',
        mrc: num(offer?.mrc), nrc: num(offer?.nrc),
      };
    });

  const quoteLines = [];
  links.filter((l) => l.offerCode).forEach((l) =>
    quoteLines.push({
      itemType: 'Link', sourceId: l.id, offerCode: l.offerCode, offerName: l.offerName, description: l.description,
      aEnd: l.aLocation || l.aNode, zEnd: l.zLocation || l.zNode, bandwidth: l.bandwidth, sla: l.sla, term: l.term,
      qty: 1, unitMrc: l.mrc, unitNrc: l.nrc, totalMrc: l.mrc, totalNrc: l.nrc,
    })
  );
  equipment.filter((q) => q.offerCode).forEach((q) =>
    quoteLines.push({
      itemType: 'Equipment', sourceId: q.id, offerCode: q.offerCode, offerName: q.offerName,
      description: [q.name, [q.vendor, q.model].filter(Boolean).join(' '), q.details].filter(Boolean).join(' - '),
      aEnd: q.location, zEnd: '', bandwidth: '', sla: '', term: q.term,
      qty: q.qty, unitMrc: q.mrc, unitNrc: q.nrc, totalMrc: q.mrc * q.qty, totalNrc: q.nrc * q.qty,
    })
  );
  quoteLines.forEach((q, i) => (q.lineNo = i + 1));

  const unmapped =
    links.filter((l) => l.quotable && !l.offerCode).length + equipment.filter((q) => !q.offerCode).length;

  return {
    links, equipment, quoteLines, unmapped,
    totals: {
      mrc: quoteLines.reduce((s, q) => s + q.totalMrc, 0),
      nrc: quoteLines.reduce((s, q) => s + q.totalNrc, 0),
    },
  };
}

export const money = (value, currency) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value || 0);
  } catch {
    return `${currency} ${Math.round(value || 0).toLocaleString()}`;
  }
};

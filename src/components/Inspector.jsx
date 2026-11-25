import { BW_UNITS, COMPONENT_MAP, COS_OPTIONS, LINK_TYPES, LINK_TYPE_MAP } from '../data/catalog.js';
import { linkSentence, money, resolveOffer, toMbps } from '../lib/bom.js';

const Field = ({ label, children }) => (
  <label className="field">
    <span>{label}</span>
    {children}
  </label>
);

function OfferBox({ rules, scope, typeKey, data, mbps, currency, onChange, quotable = true }) {
  if (!quotable) return <div className="offer-box muted">Not quoted — this type is diagram-only.</div>;
  const offer = resolveOffer(rules, scope, typeKey, data, mbps);
  const choices = rules.filter((r) => r.scope === scope);
  return (
    <>
      <Field label="CPQ product offer">
        <select value={data.offerOverride || ''} onChange={(e) => onChange({ offerOverride: e.target.value })}>
          <option value="">Auto (from mapping rules)</option>
          {choices.map((r) => (
            <option key={r.id} value={r.id}>{r.offerCode} — {r.offerName}</option>
          ))}
        </select>
      </Field>
      {offer ? (
        <div className="offer-box">
          <b>{offer.offerCode}</b> {offer.offerName}
          <div className="muted">MRC {money(offer.mrc, currency)} · NRC {money(offer.nrc, currency)}</div>
        </div>
      ) : (
        <div className="offer-box warn">No CPQ offer mapped. Add a rule in “CPQ Offer Mapping”.</div>
      )}
    </>
  );
}

export default function Inspector({ node, edge, nodes, rules, currency, updateNode, updateEdge, onDelete }) {
  if (!node && !edge) {
    return (
      <aside className="inspector">
        <div className="panel-title">Properties</div>
        <div className="empty">
          Select a component or a link to edit it.
          <ul>
            <li>Drag components from the left onto the canvas.</li>
            <li>Drag from one connection dot to another to create a link.</li>
            <li>Press Delete / Backspace to remove the selection.</li>
          </ul>
        </div>
      </aside>
    );
  }

  if (node) {
    const d = node.data;
    const comp = COMPONENT_MAP[d.typeId] || { name: d.typeId };
    const set = (patch) => updateNode(node.id, patch);
    return (
      <aside className="inspector">
        <div className="panel-title">{comp.name}</div>
        <Field label="Name"><input value={d.label} onChange={(e) => set({ label: e.target.value })} /></Field>
        <Field label="Location / city"><input value={d.location || ''} placeholder="e.g. Mumbai" onChange={(e) => set({ location: e.target.value })} /></Field>
        {comp.bom !== false && (
          <>
            <div className="row">
              <Field label="Vendor"><input value={d.vendor || ''} onChange={(e) => set({ vendor: e.target.value })} /></Field>
              <Field label="Model"><input value={d.model || ''} onChange={(e) => set({ model: e.target.value })} /></Field>
            </div>
            <Field label="Quantity"><input type="number" min="1" value={d.qty ?? 1} onChange={(e) => set({ qty: e.target.value })} /></Field>
          </>
        )}
        {(comp.fields || []).map((f) => (
          <Field key={f.key} label={f.label}>
            {f.options ? (
              <select value={d[f.key] || ''} onChange={(e) => set({ [f.key]: e.target.value })}>
                <option value="">—</option>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type || 'text'} value={d[f.key] ?? ''} onChange={(e) => set({ [f.key]: e.target.value })} />
            )}
          </Field>
        ))}
        <Field label="Notes"><textarea rows="2" value={d.notes || ''} onChange={(e) => set({ notes: e.target.value })} /></Field>
        <OfferBox rules={rules} scope="component" typeKey={d.typeId} data={d} currency={currency} onChange={set} quotable={comp.bom !== false} />
        <button className="btn danger" onClick={onDelete}>Delete component</button>
      </aside>
    );
  }

  const d = edge.data || {};
  const lt = LINK_TYPE_MAP[d.linkType] || { name: 'Link' };
  const set = (patch) => updateEdge(edge.id, patch);
  const a = nodes.find((n) => n.id === edge.source)?.data || {};
  const z = nodes.find((n) => n.id === edge.target)?.data || {};
  return (
    <aside className="inspector">
      <div className="panel-title">Link</div>
      <div className="ends">
        <b>{a.label}</b>{a.location ? ` (${a.location})` : ''} ⟷ <b>{z.label}</b>{z.location ? ` (${z.location})` : ''}
      </div>
      <Field label="Link type">
        <select
          value={d.linkType}
          onChange={(e) => set({ linkType: e.target.value, offerOverride: '' })}
        >
          {LINK_TYPES.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </Field>
      <div className="row">
        <Field label="Bandwidth"><input type="number" min="0" value={d.bandwidth ?? ''} onChange={(e) => set({ bandwidth: e.target.value })} /></Field>
        <Field label="Unit">
          <select value={d.bwUnit || 'Mbps'} onChange={(e) => set({ bwUnit: e.target.value })}>
            {BW_UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </Field>
      </div>
      <div className="row">
        <Field label="SLA %"><input type="number" min="0" max="100" step="0.01" value={d.sla ?? ''} onChange={(e) => set({ sla: e.target.value })} /></Field>
        <Field label="Term (months)"><input type="number" min="0" value={d.term ?? ''} onChange={(e) => set({ term: e.target.value })} /></Field>
      </div>
      <Field label="Class of service">
        <select value={d.cos || ''} onChange={(e) => set({ cos: e.target.value })}>
          {COS_OPTIONS.map((c) => <option key={c} value={c}>{c || '—'}</option>)}
        </select>
      </Field>
      <Field label="Notes"><textarea rows="2" value={d.notes || ''} onChange={(e) => set({ notes: e.target.value })} /></Field>
      <div className="sentence">{linkSentence(lt.name, a.location || a.label || '?', z.location || z.label || '?', d)}</div>
      <OfferBox rules={rules} scope="link" typeKey={d.linkType} data={d} mbps={toMbps(d.bandwidth, d.bwUnit)} currency={currency} onChange={set} quotable={lt.bom !== false} />
      <button className="btn danger" onClick={onDelete}>Delete link</button>
    </aside>
  );
}

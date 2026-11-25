import { useState } from 'react';
import { money } from '../lib/bom.js';

const Offer = ({ row }) =>
  row.offerCode ? (
    <span title={row.offerName}><b>{row.offerCode}</b> <span className="muted">{row.offerName}</span></span>
  ) : row.quotable ? (
    <span className="tag warn">Unmapped</span>
  ) : (
    <span className="muted">Not quoted</span>
  );

export default function BomPanel({ bom, currency, onSelect, selectedId }) {
  const [tab, setTab] = useState('links');
  const [open, setOpen] = useState(true);
  const m = (v) => money(v, currency);
  const rowProps = (id) => ({ className: id === selectedId ? 'on' : '', onClick: () => onSelect(id) });

  return (
    <section className={`bom${open ? '' : ' closed'}`}>
      <div className="bom-bar">
        {[
          ['links', `Links (${bom.links.length})`],
          ['equipment', `Equipment & devices (${bom.equipment.length})`],
          ['quote', `Quote lines (${bom.quoteLines.length})`],
        ].map(([id, label]) => (
          <button key={id} className={`tab${tab === id && open ? ' on' : ''}`} onClick={() => { setTab(id); setOpen(true); }}>
            {label}
          </button>
        ))}
        <span className="spacer" />
        {bom.unmapped > 0 && <span className="tag warn">{bom.unmapped} without CPQ offer</span>}
        <span className="totals">MRC <b>{m(bom.totals.mrc)}</b> · NRC <b>{m(bom.totals.nrc)}</b></span>
        <button className="tab" onClick={() => setOpen((o) => !o)}>{open ? '▾ Hide' : '▴ Show'}</button>
      </div>

      {open && (
        <div className="bom-body">
          {tab === 'links' && (
            <table>
              <thead>
                <tr><th>#</th><th>Type</th><th>A-end</th><th>Z-end</th><th>Bandwidth</th><th>SLA</th><th>Term</th><th>CPQ offer</th><th className="r">MRC</th><th className="r">NRC</th><th>Description</th></tr>
              </thead>
              <tbody>
                {bom.links.map((l) => (
                  <tr key={l.id} {...rowProps(l.id)}>
                    <td>{l.no}</td><td>{l.linkType}</td>
                    <td>{l.aNode}{l.aLocation && <span className="muted"> · {l.aLocation}</span>}</td>
                    <td>{l.zNode}{l.zLocation && <span className="muted"> · {l.zLocation}</span>}</td>
                    <td>{l.bandwidth}</td><td>{l.sla !== '' ? `${l.sla}%` : ''}</td><td>{l.term ? `${l.term} mo` : ''}</td>
                    <td><Offer row={l} /></td>
                    <td className="r">{l.offerCode ? m(l.mrc) : ''}</td><td className="r">{l.offerCode ? m(l.nrc) : ''}</td>
                    <td className="muted">{l.description}</td>
                  </tr>
                ))}
                {!bom.links.length && <tr><td colSpan="11" className="muted">No links yet — drag between two connection dots.</td></tr>}
              </tbody>
            </table>
          )}

          {tab === 'equipment' && (
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Type</th><th>Category</th><th>Location</th><th>Vendor / model</th><th className="r">Qty</th><th>Details</th><th>CPQ offer</th><th className="r">Unit MRC</th><th className="r">Unit NRC</th></tr>
              </thead>
              <tbody>
                {bom.equipment.map((q) => (
                  <tr key={q.id} {...rowProps(q.id)}>
                    <td>{q.no}</td><td>{q.name}</td><td>{q.type}</td><td>{q.category}</td><td>{q.location}</td>
                    <td>{[q.vendor, q.model].filter(Boolean).join(' ')}</td><td className="r">{q.qty}</td><td className="muted">{q.details}</td>
                    <td><Offer row={q} /></td>
                    <td className="r">{q.offerCode ? m(q.mrc) : ''}</td><td className="r">{q.offerCode ? m(q.nrc) : ''}</td>
                  </tr>
                ))}
                {!bom.equipment.length && <tr><td colSpan="11" className="muted">No equipment yet.</td></tr>}
              </tbody>
            </table>
          )}

          {tab === 'quote' && (
            <table>
              <thead>
                <tr><th>Line</th><th>Item</th><th>Offer code</th><th>Offer name</th><th>Description</th><th className="r">Qty</th><th className="r">Unit MRC</th><th className="r">Unit NRC</th><th className="r">Total MRC</th><th className="r">Total NRC</th></tr>
              </thead>
              <tbody>
                {bom.quoteLines.map((q) => (
                  <tr key={q.lineNo} {...rowProps(q.sourceId)}>
                    <td>{q.lineNo}</td><td>{q.itemType}</td><td><b>{q.offerCode}</b></td><td>{q.offerName}</td><td className="muted">{q.description}</td>
                    <td className="r">{q.qty}</td><td className="r">{m(q.unitMrc)}</td><td className="r">{m(q.unitNrc)}</td>
                    <td className="r">{m(q.totalMrc)}</td><td className="r">{m(q.totalNrc)}</td>
                  </tr>
                ))}
                {!bom.quoteLines.length && <tr><td colSpan="10" className="muted">Nothing quotable yet.</td></tr>}
              </tbody>
              {bom.quoteLines.length > 0 && (
                <tfoot>
                  <tr><td colSpan="8" className="r"><b>Total</b></td><td className="r"><b>{m(bom.totals.mrc)}</b></td><td className="r"><b>{m(bom.totals.nrc)}</b></td></tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      )}
    </section>
  );
}

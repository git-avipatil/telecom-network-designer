import { useEffect, useRef, useState } from 'react';
import { COMPONENTS, LINK_TYPES } from '../data/catalog.js';
import { DEFAULT_OFFERS } from '../data/defaultOffers.js';
import { download } from '../lib/exporters.js';

const newId = () => `r${Date.now().toString(36)}${Math.round(Math.random() * 1e4)}`;

export default function OfferMappingModal({ rules, setRules, currency, onClose }) {
  const [scope, setScope] = useState('link');
  const fileRef = useRef(null);
  const bodyRef = useRef(null);
  const [added, setAdded] = useState(0);
  // After adding a rule, scroll to it (new rules go to the bottom of the list).
  useEffect(() => {
    if (added && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [added]);
  const options = scope === 'link' ? LINK_TYPES : COMPONENTS.filter((c) => c.bom !== false);
  const visible = rules.filter((r) => r.scope === scope);

  const patch = (id, p) => setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));
  const remove = (id) => setRules((rs) => rs.filter((r) => r.id !== id));
  const add = () => {
    setRules((rs) => [...rs, { id: newId(), scope, key: options[0].id, minMbps: '', maxMbps: '', offerCode: '', offerName: '', mrc: 0, nrc: 0 }]);
    setAdded((n) => n + 1);
  };
  const move = (id, dir) =>
    setRules((rs) => {
      const same = rs.filter((r) => r.scope === scope);
      const i = same.findIndex((r) => r.id === id);
      const j = i + dir;
      if (j < 0 || j >= same.length) return rs;
      const a = rs.indexOf(same[i]), b = rs.indexOf(same[j]);
      const copy = [...rs];
      [copy[a], copy[b]] = [copy[b], copy[a]];
      return copy;
    });

  const importFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const list = Array.isArray(data) ? data : data.rules;
      if (!Array.isArray(list)) throw new Error('Expected an array of rules');
      setRules(list.map((r) => ({ minMbps: '', maxMbps: '', mrc: 0, nrc: 0, ...r, id: r.id || newId() })));
    } catch (err) {
      window.alert(`Could not import mapping: ${err.message}`);
    }
  };

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h2>CPQ Product Offer Mapping</h2>
            <p className="muted">
              Rules are checked top to bottom; the first match wins. Prices are in {currency}. Changes apply immediately and are saved in this browser.
            </p>
          </div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>

        <div className="modal-tools">
          <button className={`tab${scope === 'link' ? ' on' : ''}`} onClick={() => setScope('link')}>Link offers</button>
          <button className={`tab${scope === 'component' ? ' on' : ''}`} onClick={() => setScope('component')}>Equipment & device offers</button>
          <span className="spacer" />
          <button className="btn" onClick={add}>+ Add rule</button>
          <button className="btn" onClick={() => fileRef.current.click()}>Import JSON</button>
          <button className="btn" onClick={() => download(JSON.stringify(rules, null, 2), 'cpq-offer-mapping.json', 'application/json')}>Export JSON</button>
          <button className="btn" onClick={() => window.confirm('Replace all rules with the sample defaults?') && setRules(DEFAULT_OFFERS)}>Reset</button>
          <input ref={fileRef} type="file" accept=".json" hidden onChange={importFile} />
        </div>

        <div className="modal-body" ref={bodyRef}>
          <table className="rules">
            <thead>
              <tr>
                <th>{scope === 'link' ? 'Link type' : 'Component type'}</th>
                {scope === 'link' && <><th>Min Mbps</th><th>Max Mbps</th></>}
                <th>Offer code</th><th>Offer name</th><th>MRC</th><th>NRC</th><th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id}>
                  <td>
                    <select value={r.key} onChange={(e) => patch(r.id, { key: e.target.value })}>
                      <option value="*">Any (catch-all)</option>
                      {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </td>
                  {scope === 'link' && (
                    <>
                      <td><input className="num" type="number" placeholder="any" value={r.minMbps} onChange={(e) => patch(r.id, { minMbps: e.target.value })} /></td>
                      <td><input className="num" type="number" placeholder="any" value={r.maxMbps} onChange={(e) => patch(r.id, { maxMbps: e.target.value })} /></td>
                    </>
                  )}
                  <td><input value={r.offerCode} onChange={(e) => patch(r.id, { offerCode: e.target.value })} /></td>
                  <td><input className="wide" value={r.offerName} onChange={(e) => patch(r.id, { offerName: e.target.value })} /></td>
                  <td><input className="num" type="number" value={r.mrc} onChange={(e) => patch(r.id, { mrc: e.target.value })} /></td>
                  <td><input className="num" type="number" value={r.nrc} onChange={(e) => patch(r.id, { nrc: e.target.value })} /></td>
                  <td className="nowrap">
                    <button className="icon-btn" title="Move up" onClick={() => move(r.id, -1)}>↑</button>
                    <button className="icon-btn" title="Move down" onClick={() => move(r.id, 1)}>↓</button>
                    <button className="icon-btn" title="Delete rule" onClick={() => remove(r.id)}>✕</button>
                  </td>
                </tr>
              ))}
              {!visible.length && <tr><td colSpan="8" className="muted">No rules. Click “Add rule”.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

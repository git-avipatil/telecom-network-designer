import { useState } from 'react';
import { CATEGORIES, COMPONENTS } from '../data/catalog.js';
import Icon from './Icon.jsx';

export default function Palette({ onAdd }) {
  const [query, setQuery] = useState('');
  const [closed, setClosed] = useState({});
  const q = query.trim().toLowerCase();

  return (
    <aside className="palette">
      <div className="panel-title">Components</div>
      <input className="search" placeholder="Search components…" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="hint">Drag onto the canvas, or click to add.</div>
      <div className="palette-list">
        {CATEGORIES.map((cat) => {
          const items = COMPONENTS.filter((c) => c.category === cat.id && (!q || c.name.toLowerCase().includes(q)));
          if (!items.length) return null;
          const open = q || !closed[cat.id];
          return (
            <div key={cat.id}>
              <button className="cat" onClick={() => setClosed((s) => ({ ...s, [cat.id]: !s[cat.id] }))}>
                <span>{open ? '▾' : '▸'}</span> {cat.name}
              </button>
              {open && (
                <div className="cat-items">
                  {items.map((c) => (
                    <div
                      key={c.id} className="pal-item" draggable title={c.name}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/netdesigner', c.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={() => onAdd(c.id)}
                    >
                      <span className="pal-icon" style={{ color: c.color, background: `${c.color}1a` }}>
                        <Icon name={c.icon} size={20} />
                      </span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

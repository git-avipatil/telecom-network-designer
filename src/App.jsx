import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, ConnectionMode, addEdge,
  useEdgesState, useNodesState, useReactFlow,
} from '@xyflow/react';
import { COMPONENT_MAP, CURRENCIES, LINK_TYPES, LINK_TYPE_MAP } from './data/catalog.js';
import { DEFAULT_OFFERS } from './data/defaultOffers.js';
import { TEMPLATES } from './data/templates.js';
import { buildBom } from './lib/bom.js';
import { edgeLabel, exportCpqJson, exportExcel, exportPdf, exportPng, exportSvg, saveDiagram } from './lib/exporters.js';
import DeviceNode from './components/DeviceNode.jsx';
import Palette from './components/Palette.jsx';
import Inspector from './components/Inspector.jsx';
import BomPanel from './components/BomPanel.jsx';
import OfferMappingModal from './components/OfferMappingModal.jsx';

const nodeTypes = { device: DeviceNode };
const STORE = 'telecom-network-designer.v1';
const RULES = 'telecom-network-designer.rules.v1';
const DEFAULT_META = { project: 'Enterprise WAN Design', customer: '', quoteRef: '', currency: 'INR' };
const uid = (p) => `${p}-${Date.now().toString(36)}-${Math.round(Math.random() * 1e5).toString(36)}`;

const load = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const saved = useMemo(() => load(STORE, null), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(saved?.nodes || TEMPLATES.mpls.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(saved?.edges || TEMPLATES.mpls.edges);
  const [meta, setMeta] = useState({ ...DEFAULT_META, ...(saved?.meta || {}) });
  const [rules, setRules] = useState(() => load(RULES, DEFAULT_OFFERS));
  const [newLinkType, setNewLinkType] = useState('mpls');
  const [showMapping, setShowMapping] = useState(false);
  const [busy, setBusy] = useState('');
  const { screenToFlowPosition, fitView } = useReactFlow();
  const wrapRef = useRef(null);
  const fileRef = useRef(null);
  const exportRef = useRef(null);

  // Autosave
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORE, JSON.stringify({ meta, nodes: nodes.map(({ selected, dragging, ...n }) => n), edges: edges.map(({ selected, ...e }) => e) }));
      } catch { /* storage unavailable */ }
    }, 400);
    return () => clearTimeout(t);
  }, [nodes, edges, meta]);
  useEffect(() => {
    try { localStorage.setItem(RULES, JSON.stringify(rules)); } catch { /* storage unavailable */ }
  }, [rules]);

  const bom = useMemo(() => buildBom(nodes, edges, rules), [nodes, edges, rules]);
  const selectedNode = nodes.find((n) => n.selected);
  const selectedEdge = selectedNode ? null : edges.find((e) => e.selected);

  // Edges are stored as plain data; colours and labels are derived for display.
  const viewEdges = useMemo(
    () =>
      edges.map((e) => {
        const lt = LINK_TYPE_MAP[e.data?.linkType] || { color: '#64748b' };
        return {
          ...e, type: 'straight', label: edgeLabel(e.data || {}), interactionWidth: 24,
          style: { stroke: lt.color, strokeWidth: e.selected ? 4.5 : 2.5, strokeDasharray: lt.dash },
          labelStyle: { fontSize: 10, fontWeight: 600, fill: '#1e293b' },
          labelBgStyle: { fill: '#fff', stroke: lt.color, strokeOpacity: 0.35 },
          labelBgPadding: [6, 3], labelBgBorderRadius: 4,
        };
      }),
    [edges]
  );

  const makeNode = useCallback((typeId, position) => {
    const comp = COMPONENT_MAP[typeId];
    return {
      id: uid(typeId), type: 'device', position, selected: true,
      data: { typeId, label: comp.name, location: '', vendor: '', model: '', qty: 1, notes: '' },
    };
  }, []);

  const addNodeAt = useCallback(
    (typeId, position) => {
      if (!COMPONENT_MAP[typeId]) return;
      setEdges((es) => es.map((e) => ({ ...e, selected: false })));
      setNodes((ns) => [...ns.map((n) => ({ ...n, selected: false })), makeNode(typeId, position)]);
    },
    [makeNode, setNodes, setEdges]
  );

  const onDrop = useCallback(
    (ev) => {
      ev.preventDefault();
      const typeId = ev.dataTransfer.getData('application/netdesigner');
      const p = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
      addNodeAt(typeId, { x: p.x - 60, y: p.y - 30 });
    },
    [screenToFlowPosition, addNodeAt]
  );

  const addAtCenter = useCallback(
    (typeId) => {
      const r = wrapRef.current.getBoundingClientRect();
      const p = screenToFlowPosition({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      addNodeAt(typeId, { x: p.x - 60 + Math.random() * 80 - 40, y: p.y - 40 + Math.random() * 80 - 40 });
    },
    [screenToFlowPosition, addNodeAt]
  );

  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) return;
      const lt = LINK_TYPE_MAP[newLinkType];
      setEdges((es) =>
        addEdge({ ...params, id: uid('link'), selected: true, data: { ...lt.defaults, linkType: lt.id, term: 36, cos: '', notes: '' } },
          es.map((e) => ({ ...e, selected: false })))
      );
      setNodes((ns) => ns.map((n) => ({ ...n, selected: false })));
    },
    [newLinkType, setEdges, setNodes]
  );

  const updateNode = (id, patch) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
  const updateEdge = (id, patch) =>
    setEdges((es) =>
      es.map((e) => {
        if (e.id !== id) return e;
        // Switching link type pulls in that type's default bandwidth / SLA.
        const defaults = patch.linkType && patch.linkType !== e.data.linkType ? LINK_TYPE_MAP[patch.linkType].defaults : {};
        return { ...e, data: { ...e.data, ...defaults, ...patch } };
      })
    );

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((ns) => ns.filter((n) => n.id !== selectedNode.id));
      setEdges((es) => es.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    } else if (selectedEdge) setEdges((es) => es.filter((e) => e.id !== selectedEdge.id));
  };

  const selectById = (id) => {
    setNodes((ns) => ns.map((n) => ({ ...n, selected: n.id === id })));
    setEdges((es) => es.map((e) => ({ ...e, selected: e.id === id })));
  };

  const replaceDiagram = (next) => {
    setNodes(next.nodes || []);
    setEdges(next.edges || []);
    if (next.meta) setMeta({ ...DEFAULT_META, ...next.meta });
    if (Array.isArray(next.rules)) setRules(next.rules);
    setTimeout(() => fitView({ padding: 0.15, duration: 300 }), 80);
  };

  const loadTemplate = (key) => {
    if (!key) return;
    if (nodes.length && !window.confirm('Replace the current diagram with this template?')) return;
    replaceDiagram(structuredClone({ nodes: TEMPLATES[key].nodes, edges: TEMPLATES[key].edges }));
  };

  const openFile = async (ev) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.nodes)) throw new Error('This is not a saved network diagram.');
      replaceDiagram(data);
    } catch (err) {
      window.alert(`Could not open file: ${err.message}`);
    }
  };

  const run = async (label, fn) => {
    if (exportRef.current) exportRef.current.open = false;
    setBusy(label);
    try {
      await fn();
    } catch (err) {
      console.error(err);
      window.alert(`${label} failed: ${err.message}`);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Telecom Network Designer</div>
        <input className="meta wide" title="Project name" placeholder="Project name" value={meta.project} onChange={(e) => setMeta({ ...meta, project: e.target.value })} />
        <input className="meta" title="Customer" placeholder="Customer" value={meta.customer} onChange={(e) => setMeta({ ...meta, customer: e.target.value })} />
        <input className="meta" title="Quote / opportunity reference" placeholder="Quote ref" value={meta.quoteRef} onChange={(e) => setMeta({ ...meta, quoteRef: e.target.value })} />
        <select className="meta narrow" title="Currency" value={meta.currency} onChange={(e) => setMeta({ ...meta, currency: e.target.value })}>
          {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="spacer" />
        <select className="meta" value="" onChange={(e) => loadTemplate(e.target.value)} title="Start from a template">
          <option value="">Templates…</option>
          {Object.entries(TEMPLATES).map(([k, t]) => <option key={k} value={k}>{t.name}</option>)}
        </select>
        <button className="btn dark" onClick={() => setShowMapping(true)}>CPQ Offer Mapping</button>
        <button className="btn dark" onClick={() => fileRef.current.click()}>Open</button>
        <button className="btn dark" onClick={() => saveDiagram({ meta, nodes, edges, rules })}>Save</button>
        <details className="menu" ref={exportRef}>
          <summary className="btn primary">{busy || 'Export ▾'}</summary>
          <div className="menu-list">
            <button onClick={() => run('PDF export', () => exportPdf(nodes, edges, bom, meta))}>PDF — diagram + lists</button>
            <button onClick={() => run('SVG export', () => exportSvg(nodes, edges, meta))}>SVG — vector diagram</button>
            <button onClick={() => run('PNG export', () => exportPng(nodes, edges, meta))}>PNG — image</button>
            <button onClick={() => run('Excel export', () => exportExcel(bom, rules, meta))}>Excel — links, equipment, quote lines</button>
            <button onClick={() => run('CPQ JSON export', () => exportCpqJson(bom, meta))}>JSON — CPQ payload</button>
          </div>
        </details>
        <input ref={fileRef} type="file" accept=".json" hidden onChange={openFile} />
      </header>

      <div className="main">
        <Palette onAdd={addAtCenter} />

        <div className="center">
          <div className="canvas" ref={wrapRef} onDrop={onDrop} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}>
            <ReactFlow
              nodes={nodes} edges={viewEdges} nodeTypes={nodeTypes}
              onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
              connectionMode={ConnectionMode.Loose} connectionLineStyle={{ stroke: LINK_TYPE_MAP[newLinkType].color, strokeWidth: 2.5 }}
              deleteKeyCode={['Backspace', 'Delete']} snapToGrid snapGrid={[10, 10]} fitView fitViewOptions={{ padding: 0.15 }}
              minZoom={0.2} maxZoom={2.5} proOptions={{ hideAttribution: false }}
            >
              <Background gap={20} color="#cbd5e1" />
              <Controls />
              <MiniMap pannable zoomable nodeColor={(n) => COMPONENT_MAP[n.data.typeId]?.color || '#64748b'} />
            </ReactFlow>
            <div className="linkbar">
              <span>New links are drawn as</span>
              <select value={newLinkType} onChange={(e) => setNewLinkType(e.target.value)}>
                {LINK_TYPES.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <span className="swatch" style={{ background: LINK_TYPE_MAP[newLinkType].color }} />
            </div>
          </div>
          <BomPanel bom={bom} currency={meta.currency} onSelect={selectById} selectedId={selectedNode?.id || selectedEdge?.id} />
        </div>

        <Inspector
          node={selectedNode} edge={selectedEdge} nodes={nodes} rules={rules} currency={meta.currency}
          updateNode={updateNode} updateEdge={updateEdge} onDelete={deleteSelected}
        />
      </div>

      {showMapping && <OfferMappingModal rules={rules} setRules={setRules} currency={meta.currency} onClose={() => setShowMapping(false)} />}
    </div>
  );
}

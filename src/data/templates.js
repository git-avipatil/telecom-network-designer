import { COMPONENT_MAP, LINK_TYPE_MAP } from './catalog.js';

const node = (id, typeId, x, y, label, location, extra = {}) => ({
  id, type: 'device', position: { x, y },
  data: { typeId, label: label || COMPONENT_MAP[typeId].name, location: location || '', vendor: '', model: '', qty: 1, notes: '', ...extra },
});

const link = (source, sourceHandle, target, targetHandle, linkType, bandwidth, bwUnit, sla, extra = {}) => ({
  id: `l-${source}-${target}-${linkType}`, source, sourceHandle, target, targetHandle,
  data: { ...LINK_TYPE_MAP[linkType].defaults, linkType, bandwidth, bwUnit, sla, term: 36, cos: '', notes: '', ...extra },
});

export const TEMPLATES = {
  mpls: {
    name: 'MPLS network (sample)',
    nodes: [
      node('pe-del', 'pe-router', 360, 0, 'PE Delhi', 'Delhi'),
      node('pe-mum', 'pe-router', 120, 220, 'PE Mumbai', 'Mumbai'),
      node('pe-pun', 'pe-router', 600, 220, 'PE Pune', 'Pune'),
      node('pe-blr', 'pe-router', 360, 440, 'PE Bengaluru', 'Bengaluru'),
      node('ce-mum', 'ce-router', -140, 220, 'CE Mumbai HQ', 'Mumbai', { vendor: 'Cisco', model: 'ISR 4451' }),
      node('ce-pun', 'ce-router', 860, 220, 'CE Pune Branch', 'Pune', { vendor: 'Cisco', model: 'ISR 4331' }),
      node('ce-del', 'ce-router', 620, 0, 'CE Delhi Branch', 'Delhi'),
      node('ce-blr', 'ce-router', 620, 440, 'CE Bengaluru DC', 'Bengaluru'),
      node('fw-mum', 'firewall', -140, 400, 'HQ Firewall', 'Mumbai'),
      node('sw-mum', 'l3-switch', -380, 220, 'HQ Core Switch', 'Mumbai', { qty: 2 }),
    ],
    edges: [
      link('pe-mum', 'r', 'pe-pun', 'l', 'mpls', 100, 'Gbps', 90, { cos: 'Critical Data' }),
      link('pe-del', 'l', 'pe-mum', 't', 'mpls', 10, 'Gbps', 99.9),
      link('pe-blr', 'l', 'pe-mum', 'b', 'mpls', 10, 'Gbps', 99.9),
      link('pe-blr', 'r', 'pe-pun', 'b', 'mpls', 10, 'Gbps', 99.9),
      link('ce-mum', 'r', 'pe-mum', 'l', 'mpls', 1, 'Gbps', 99.5),
      link('pe-pun', 'r', 'ce-pun', 'l', 'mpls', 500, 'Mbps', 99.5),
      link('pe-del', 'r', 'ce-del', 'l', 'mpls', 200, 'Mbps', 99.5),
      link('pe-blr', 'r', 'ce-blr', 'l', 'mpls', 1, 'Gbps', 99.9),
      link('sw-mum', 'r', 'ce-mum', 'l', 'lan', 10, 'Gbps', ''),
      link('ce-mum', 'b', 'fw-mum', 't', 'lan', 10, 'Gbps', ''),
    ],
  },

  sdwan: {
    name: 'SD-WAN network (sample)',
    nodes: [
      node('mpls', 'mpls-cloud', 340, 0, 'MPLS Network', ''),
      node('inet', 'internet', 340, 400, 'Internet', ''),
      node('hub', 'sdwan-hub', 0, 200, 'SD-WAN Hub', 'Mumbai', { vendor: 'Fortinet', model: 'FG-600F' }),
      node('edge-pun', 'sdwan-edge', 680, 100, 'SD-WAN Edge Pune', 'Pune'),
      node('edge-chn', 'sdwan-edge', 680, 300, 'SD-WAN Edge Chennai', 'Chennai'),
      node('ctrl', 'sdwan-controller', 200, 580, 'SD-WAN Controller', 'Cloud'),
      node('orch', 'sdwan-orchestrator', 480, 580, 'SD-WAN Orchestrator', 'Cloud'),
      node('fw-hub', 'firewall', -220, 200, 'DC Firewall', 'Mumbai'),
      node('cell', 'gnodeb', 920, 300, '5G Cell Site', 'Chennai'),
      node('hs', 'handset', 1140, 220, 'Field Sales Handsets', 'Chennai', { qty: 25, vendor: 'Samsung', model: 'Galaxy S-series', storage: '256 GB', payment: 'Instalments (EMI)' }),
      node('sub', 'subscription', 1140, 380, 'Mobile Subscriptions', 'Chennai', { qty: 25, plan: 'Business Unlimited 5G', dataAllowance: '100 GB / month', voice: 'Unlimited', term: 24, simType: 'eSIM' }),
      node('lan-pun', 'l2-switch', 920, 100, 'Branch LAN Switch', 'Pune'),
    ],
    edges: [
      link('hub', 't', 'mpls', 'l', 'mpls', 1, 'Gbps', 99.9),
      link('hub', 'b', 'inet', 'l', 'dia', 1, 'Gbps', 99.5),
      link('edge-pun', 't', 'mpls', 'r', 'mpls', 200, 'Mbps', 99.9),
      link('edge-pun', 'b', 'inet', 't', 'broadband', 300, 'Mbps', 99),
      link('edge-chn', 't', 'mpls', 'b', 'mpls', 100, 'Mbps', 99.9),
      link('edge-chn', 'b', 'inet', 'r', 'dia', 100, 'Mbps', 99.5),
      link('hub', 'r', 'edge-pun', 'l', 'sdwan-overlay', 200, 'Mbps', 99.9),
      link('hub', 'r', 'edge-chn', 'l', 'sdwan-overlay', 100, 'Mbps', 99.9),
      link('edge-chn', 'r', 'cell', 'l', 'lte', 50, 'Mbps', 98, { notes: 'Wireless backup' }),
      link('cell', 'r', 'hs', 'l', 'radio', '', 'Mbps', ''),
      link('ctrl', 't', 'inet', 'b', 'control', '', 'Mbps', ''),
      link('orch', 't', 'inet', 'b', 'control', '', 'Mbps', ''),
      link('fw-hub', 'r', 'hub', 'l', 'lan', 10, 'Gbps', ''),
      link('edge-pun', 'r', 'lan-pun', 'l', 'lan', 1, 'Gbps', ''),
    ],
  },

  blank: { name: 'Blank canvas', nodes: [], edges: [] },
};

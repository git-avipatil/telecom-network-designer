// ---------------------------------------------------------------------------
// Component + link catalog. Edit this file to add / rename telecom components.
//   bom: false  -> logical item (cloud, site) that is NOT listed as equipment
//   fields      -> extra attributes shown in the properties panel
// ---------------------------------------------------------------------------

// Icon glyphs: inner SVG markup on a 48x48 grid, drawn with stroke only.
export const ICONS = {
  router:
    '<circle cx="24" cy="24" r="17"/><path d="M24 12v9M24 27v9M12 24h9M27 24h9M21 15l3-3 3 3M21 33l3 3 3-3M15 21l-3 3 3 3M33 21l3 3-3 3"/>',
  switch:
    '<rect x="6" y="13" width="36" height="22" rx="3"/><path d="M13 20h20M29 17l4 3-4 3M35 28H15M19 25l-4 3 4 3"/>',
  firewall:
    '<rect x="7" y="10" width="34" height="28" rx="2"/><path d="M7 19h34M7 29h34M18 10v9M30 10v9M24 19v10M14 29v9M34 29v9"/>',
  cloud: '<path d="M14 37a9 9 0 0 1-1-17.9A12 12 0 0 1 36 17a10 10 0 0 1-1 20z"/>',
  globe: '<circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c-9 9-9 25 0 34M24 7c9 9 9 25 0 34"/>',
  tower:
    '<path d="M24 20v22M17 42l7-22 7 22M19.5 34h9"/><circle cx="24" cy="16" r="2.5"/><path d="M16 9a11 11 0 0 0 0 14M32 9a11 11 0 0 1 0 14M11 5a17 17 0 0 0 0 22M37 5a17 17 0 0 1 0 22"/>',
  phone: '<rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 37h6"/>',
  tablet: '<rect x="9" y="6" width="30" height="36" rx="4"/><path d="M21 36h6"/>',
  sim: '<path d="M12 6h16l8 8v28H12z"/><rect x="18" y="22" width="12" height="12" rx="2"/><path d="M18 28h12M24 22v12"/>',
  server:
    '<rect x="9" y="7" width="30" height="10" rx="2"/><rect x="9" y="19" width="30" height="10" rx="2"/><rect x="9" y="31" width="30" height="10" rx="2"/><path d="M14 12h.01M14 24h.01M14 36h.01"/>',
  storage:
    '<ellipse cx="24" cy="11" rx="15" ry="5"/><path d="M9 11v26c0 2.8 6.7 5 15 5s15-2.2 15-5V11M9 24c0 2.8 6.7 5 15 5s15-2.2 15-5"/>',
  building: '<path d="M9 42V10l16-4v36M25 18h14v24M5 42h38M14 16h6M14 23h6M14 30h6M30 25h4M30 32h4"/>',
  home: '<path d="M6 23L24 7l18 16M11 19v22h26V19M20 41V29h8v12"/>',
  controller:
    '<circle cx="24" cy="24" r="6"/><circle cx="24" cy="7" r="3"/><circle cx="24" cy="41" r="3"/><circle cx="8" cy="15" r="3"/><circle cx="40" cy="15" r="3"/><circle cx="8" cy="33" r="3"/><circle cx="40" cy="33" r="3"/><path d="M24 10v8M24 30v8M10.6 16.5l8 4.5M29.4 27l8 4.5M10.6 31.5l8-4.5M29.4 21l8-4.5"/>',
  optical: '<rect x="6" y="12" width="36" height="24" rx="3"/><path d="M12 24c4-8 8 8 12 0s8 8 12 0"/>',
  dish: '<path d="M10 14a18 18 0 0 0 24 24z"/><path d="M22 26l10-10"/><circle cx="34" cy="14" r="3"/><path d="M18 38l-4 6h14"/>',
  wifi: '<path d="M6 18a26 26 0 0 1 36 0M12 25a17 17 0 0 1 24 0M18 32a8.5 8.5 0 0 1 12 0"/><circle cx="24" cy="38" r="2"/>',
  modem:
    '<rect x="6" y="24" width="36" height="14" rx="3"/><path d="M12 31h.01M18 31h.01M24 31h.01M34 24V10M30 13a6 6 0 0 1 8 0"/>',
  deskphone:
    '<rect x="8" y="16" width="32" height="24" rx="3"/><path d="M8 16c0-10 10-10 10 0M22 23h12M22 29h.01M28 29h.01M34 29h.01M22 34h.01M28 34h.01M34 34h.01M13 22v14"/>',
  lb: '<circle cx="10" cy="24" r="4"/><rect x="32" y="6" width="10" height="8" rx="2"/><rect x="32" y="20" width="10" height="8" rx="2"/><rect x="32" y="34" width="10" height="8" rx="2"/><path d="M14 24h18M14 23l18-12M14 25l18 12"/>',
  chip: '<rect x="13" y="13" width="22" height="22" rx="3"/><rect x="19" y="19" width="10" height="10"/><path d="M18 13V7M24 13V7M30 13V7M18 41v-6M24 41v-6M30 41v-6M13 18H7M13 24H7M13 30H7M41 18h-6M41 24h-6M41 30h-6"/>',
  shield: '<path d="M24 5l15 6v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V11z"/><path d="M17 24l5 5 9-10"/>',
};

export const CATEGORIES = [
  { id: 'site', name: 'Sites & Locations' },
  { id: 'mpls', name: 'MPLS Core' },
  { id: 'sdwan', name: 'SD-WAN' },
  { id: 'cpe', name: 'Edge, CPE & LAN' },
  { id: 'transport', name: 'Transport & Access' },
  { id: 'mobile', name: 'Mobile & Subscriptions' },
  { id: 'voice', name: 'Voice & UC' },
  { id: 'dc', name: 'Data Center & Cloud' },
  { id: 'security', name: 'Security' },
];

const BLUE = '#2563eb', TEAL = '#0d9488', SLATE = '#475569', ORANGE = '#d97706',
  PURPLE = '#7c3aed', PINK = '#db2777', GREEN = '#16a34a', RED = '#dc2626', CYAN = '#0284c7';

const SITE_FIELDS = [{ key: 'address', label: 'Site address' }];

export const COMPONENTS = [
  // Sites
  { id: 'site-hq', name: 'Head Office', category: 'site', icon: 'building', color: SLATE, bom: false, fields: SITE_FIELDS },
  { id: 'site-branch', name: 'Branch Office', category: 'site', icon: 'building', color: SLATE, bom: false, fields: SITE_FIELDS },
  { id: 'site-dc', name: 'Data Center Site', category: 'site', icon: 'server', color: SLATE, bom: false, fields: SITE_FIELDS },
  { id: 'site-pop', name: 'Provider PoP', category: 'site', icon: 'building', color: SLATE, bom: false, fields: SITE_FIELDS },
  { id: 'site-home', name: 'Remote / Home User', category: 'site', icon: 'home', color: SLATE, bom: false, fields: SITE_FIELDS },

  // MPLS
  { id: 'mpls-cloud', name: 'MPLS Cloud', category: 'mpls', icon: 'cloud', color: BLUE, bom: false },
  { id: 'p-router', name: 'P Router (Core)', category: 'mpls', icon: 'router', color: BLUE },
  { id: 'pe-router', name: 'PE Router', category: 'mpls', icon: 'router', color: BLUE },
  { id: 'ce-router', name: 'CE Router', category: 'mpls', icon: 'router', color: CYAN },
  { id: 'route-reflector', name: 'Route Reflector', category: 'mpls', icon: 'controller', color: BLUE },
  { id: 'asbr', name: 'ASBR / Inter-AS Router', category: 'mpls', icon: 'router', color: BLUE },

  // SD-WAN
  { id: 'sdwan-edge', name: 'SD-WAN Edge', category: 'sdwan', icon: 'router', color: TEAL },
  { id: 'sdwan-hub', name: 'SD-WAN Hub / Gateway', category: 'sdwan', icon: 'router', color: TEAL },
  { id: 'sdwan-controller', name: 'SD-WAN Controller', category: 'sdwan', icon: 'controller', color: TEAL },
  { id: 'sdwan-orchestrator', name: 'SD-WAN Orchestrator', category: 'sdwan', icon: 'controller', color: TEAL },
  { id: 'internet', name: 'Internet', category: 'sdwan', icon: 'globe', color: SLATE, bom: false },
  { id: 'sase', name: 'SASE / Cloud Security PoP', category: 'sdwan', icon: 'shield', color: TEAL },

  // Edge / CPE / LAN
  { id: 'edge-router', name: 'Edge Router', category: 'cpe', icon: 'router', color: CYAN },
  { id: 'cpe', name: 'Managed CPE', category: 'cpe', icon: 'modem', color: CYAN },
  { id: 'l3-switch', name: 'L3 Switch', category: 'cpe', icon: 'switch', color: CYAN },
  { id: 'l2-switch', name: 'L2 / LAN Switch', category: 'cpe', icon: 'switch', color: CYAN },
  { id: 'wifi-ap', name: 'Wi-Fi Access Point', category: 'cpe', icon: 'wifi', color: CYAN },
  { id: 'wlc', name: 'Wireless LAN Controller', category: 'cpe', icon: 'controller', color: CYAN },
  { id: 'ont', name: 'ONT / Broadband Modem', category: 'cpe', icon: 'modem', color: CYAN },
  { id: 'lte-router', name: '4G / 5G Router', category: 'cpe', icon: 'modem', color: CYAN },
  { id: 'nte', name: 'Network Termination (NTE)', category: 'cpe', icon: 'switch', color: CYAN },

  // Transport & access
  { id: 'agg-router', name: 'Aggregation Router', category: 'transport', icon: 'router', color: ORANGE },
  { id: 'bng', name: 'BNG / BRAS', category: 'transport', icon: 'router', color: ORANGE },
  { id: 'dwdm', name: 'DWDM Node', category: 'transport', icon: 'optical', color: ORANGE },
  { id: 'roadm', name: 'ROADM', category: 'transport', icon: 'optical', color: ORANGE },
  { id: 'sdh-adm', name: 'SDH / SONET ADM', category: 'transport', icon: 'optical', color: ORANGE },
  { id: 'olt', name: 'GPON OLT', category: 'transport', icon: 'optical', color: ORANGE },
  { id: 'microwave', name: 'Microwave Radio', category: 'transport', icon: 'dish', color: ORANGE },
  { id: 'vsat', name: 'VSAT / Satellite Terminal', category: 'transport', icon: 'dish', color: ORANGE },

  // Mobile
  { id: 'gnodeb', name: '5G gNodeB / Cell Site', category: 'mobile', icon: 'tower', color: PURPLE },
  { id: 'enodeb', name: '4G eNodeB', category: 'mobile', icon: 'tower', color: PURPLE },
  { id: '5g-core', name: '5G Core', category: 'mobile', icon: 'controller', color: PURPLE },
  { id: 'epc', name: 'EPC (4G Core)', category: 'mobile', icon: 'controller', color: PURPLE },
  { id: 'ims', name: 'IMS Core', category: 'mobile', icon: 'server', color: PURPLE },
  {
    id: 'handset', name: 'Mobile Handset', category: 'mobile', icon: 'phone', color: PINK,
    fields: [
      { key: 'storage', label: 'Storage / variant' },
      { key: 'payment', label: 'Payment', options: ['Upfront', 'Instalments (EMI)', 'Lease'] },
    ],
  },
  { id: 'tablet', name: 'Tablet / Laptop', category: 'mobile', icon: 'tablet', color: PINK },
  {
    id: 'subscription', name: 'Mobile Subscription (SIM)', category: 'mobile', icon: 'sim', color: PINK,
    fields: [
      { key: 'plan', label: 'Plan name' },
      { key: 'dataAllowance', label: 'Data allowance' },
      { key: 'voice', label: 'Voice / SMS' },
      { key: 'term', label: 'Contract term (months)', type: 'number' },
      { key: 'simType', label: 'SIM type', options: ['Physical SIM', 'eSIM', 'IoT SIM'] },
    ],
  },
  { id: 'iot-device', name: 'IoT Device / Sensor', category: 'mobile', icon: 'chip', color: PINK },
  { id: 'mifi', name: 'MiFi / Data Dongle', category: 'mobile', icon: 'wifi', color: PINK },

  // Voice
  { id: 'ip-pbx', name: 'IP PBX', category: 'voice', icon: 'server', color: GREEN },
  { id: 'sbc', name: 'Session Border Controller', category: 'voice', icon: 'shield', color: GREEN },
  { id: 'media-gw', name: 'Media Gateway', category: 'voice', icon: 'switch', color: GREEN },
  { id: 'ip-phone', name: 'IP Phone', category: 'voice', icon: 'deskphone', color: GREEN },

  // DC & cloud
  { id: 'public-cloud', name: 'Public Cloud', category: 'dc', icon: 'cloud', color: SLATE, bom: false },
  { id: 'server', name: 'Server', category: 'dc', icon: 'server', color: SLATE },
  { id: 'storage', name: 'Storage', category: 'dc', icon: 'storage', color: SLATE },
  { id: 'load-balancer', name: 'Load Balancer', category: 'dc', icon: 'lb', color: SLATE },

  // Security
  { id: 'firewall', name: 'Firewall', category: 'security', icon: 'firewall', color: RED },
  { id: 'ids', name: 'IDS / IPS', category: 'security', icon: 'shield', color: RED },
  { id: 'ddos', name: 'DDoS Protection', category: 'security', icon: 'shield', color: RED },
];

export const COMPONENT_MAP = Object.fromEntries(COMPONENTS.map((c) => [c.id, c]));
export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Link types. bom:false = shown on the diagram but never quoted (e.g. LAN cabling).
export const LINK_TYPES = [
  { id: 'mpls', name: 'MPLS', color: '#2563eb', defaults: { bandwidth: 100, bwUnit: 'Mbps', sla: 99.5 } },
  { id: 'vpls', name: 'VPLS / L2VPN', color: '#4f46e5', defaults: { bandwidth: 100, bwUnit: 'Mbps', sla: 99.5 } },
  { id: 'dia', name: 'Dedicated Internet', color: '#16a34a', defaults: { bandwidth: 100, bwUnit: 'Mbps', sla: 99.5 } },
  { id: 'broadband', name: 'Broadband', color: '#65a30d', dash: '6 4', defaults: { bandwidth: 200, bwUnit: 'Mbps', sla: 99 } },
  { id: 'lte', name: '4G / 5G Wireless', color: '#7c3aed', dash: '2 5', defaults: { bandwidth: 50, bwUnit: 'Mbps', sla: 98 } },
  { id: 'sdwan-overlay', name: 'SD-WAN Overlay', color: '#0d9488', dash: '10 5', defaults: { bandwidth: 100, bwUnit: 'Mbps', sla: 99.9 } },
  { id: 'p2p', name: 'Leased Line / P2P Ethernet', color: '#d97706', defaults: { bandwidth: 1, bwUnit: 'Gbps', sla: 99.9 } },
  { id: 'wavelength', name: 'Wavelength / Dark Fiber', color: '#ea580c', defaults: { bandwidth: 10, bwUnit: 'Gbps', sla: 99.95 } },
  { id: 'microwave', name: 'Microwave', color: '#b45309', dash: '2 5', defaults: { bandwidth: 500, bwUnit: 'Mbps', sla: 99.5 } },
  { id: 'satellite', name: 'Satellite / VSAT', color: '#9333ea', dash: '2 5', defaults: { bandwidth: 20, bwUnit: 'Mbps', sla: 99 } },
  { id: 'cloud-connect', name: 'Cloud Connect', color: '#0284c7', defaults: { bandwidth: 1, bwUnit: 'Gbps', sla: 99.9 } },
  { id: 'sip', name: 'SIP Trunk', color: '#059669', dash: '6 4', defaults: { bandwidth: 10, bwUnit: 'Mbps', sla: 99.9 } },
  { id: 'lan', name: 'LAN / Ethernet', color: '#64748b', bom: false, defaults: { bandwidth: 1, bwUnit: 'Gbps', sla: '' } },
  { id: 'radio', name: 'Mobile Radio Access', color: '#db2777', dash: '2 5', bom: false, defaults: { bandwidth: '', bwUnit: 'Mbps', sla: '' } },
  { id: 'control', name: 'Control / Management', color: '#94a3b8', dash: '3 4', bom: false, defaults: { bandwidth: '', bwUnit: 'Mbps', sla: '' } },
];

export const LINK_TYPE_MAP = Object.fromEntries(LINK_TYPES.map((l) => [l.id, l]));
export const BW_UNITS = ['Kbps', 'Mbps', 'Gbps'];
export const COS_OPTIONS = ['', 'Best Effort', 'Business', 'Critical Data', 'Real-Time / Voice'];
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'];

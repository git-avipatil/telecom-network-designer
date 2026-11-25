// ---------------------------------------------------------------------------
// Default CPQ product-offer mapping. SAMPLE codes and prices only - replace with
// your CPQ catalog (in the app: "CPQ Offer Mapping", or import a JSON file).
//
// Rule matching: rules are evaluated top to bottom, first match wins.
//   scope 'link'      -> key = link type id, optional bandwidth range in Mbps
//   scope 'component' -> key = component type id
// ---------------------------------------------------------------------------
let n = 0;
const L = (key, minMbps, maxMbps, offerCode, offerName, mrc, nrc) => ({
  id: `r${++n}`, scope: 'link', key, minMbps, maxMbps, offerCode, offerName, mrc, nrc,
});
const C = (key, offerCode, offerName, mrc, nrc) => ({
  id: `r${++n}`, scope: 'component', key, minMbps: '', maxMbps: '', offerCode, offerName, mrc, nrc,
});

export const DEFAULT_OFFERS = [
  L('mpls', '', 100, 'MPLS-VPN-100M', 'MPLS VPN Port up to 100 Mbps', 45000, 25000),
  L('mpls', 100.001, 1000, 'MPLS-VPN-1G', 'MPLS VPN Port up to 1 Gbps', 180000, 50000),
  L('mpls', 1000.001, 10000, 'MPLS-VPN-10G', 'MPLS VPN Port up to 10 Gbps', 650000, 150000),
  L('mpls', 10000.001, '', 'MPLS-VPN-100G', 'MPLS VPN Port up to 100 Gbps', 2800000, 500000),
  L('vpls', '', '', 'VPLS-STD', 'VPLS / L2VPN Service', 90000, 40000),
  L('dia', '', 100, 'DIA-100M', 'Dedicated Internet up to 100 Mbps', 35000, 20000),
  L('dia', 100.001, '', 'DIA-1G', 'Dedicated Internet up to 1 Gbps+', 150000, 40000),
  L('broadband', '', '', 'BB-BIZ', 'Business Broadband', 3500, 2000),
  L('lte', '', '', 'WL-5G-BKP', '4G/5G Wireless Access (Backup)', 2500, 1500),
  L('sdwan-overlay', '', '', 'SDW-OVL-LIC', 'SD-WAN Overlay Tunnel Licence', 6000, 0),
  L('p2p', '', 1000, 'ELINE-1G', 'Ethernet Private Line up to 1 Gbps', 120000, 60000),
  L('p2p', 1000.001, '', 'ELINE-10G', 'Ethernet Private Line up to 10 Gbps+', 480000, 150000),
  L('wavelength', '', 10000, 'WAVE-10G', 'Wavelength Service 10G', 400000, 200000),
  L('wavelength', 10000.001, '', 'WAVE-100G', 'Wavelength Service 100G', 1500000, 500000),
  L('microwave', '', '', 'MW-LINK', 'Microwave Link', 60000, 100000),
  L('satellite', '', '', 'VSAT-LINK', 'VSAT Connectivity', 40000, 75000),
  L('cloud-connect', '', '', 'CLOUD-CON', 'Cloud Connect Port', 80000, 30000),
  L('sip', '', '', 'SIP-TRUNK', 'SIP Trunk (per trunk group)', 15000, 10000),

  C('ce-router', 'CE-RTR-MGD', 'Managed CE Router', 8000, 60000),
  C('pe-router', 'PE-RTR', 'Provider Edge Router', 0, 2500000),
  C('p-router', 'P-RTR', 'Core P Router', 0, 6000000),
  C('edge-router', 'EDGE-RTR', 'Edge Router', 10000, 150000),
  C('cpe', 'CPE-MGD-STD', 'Managed CPE - Standard', 4000, 30000),
  C('sdwan-edge', 'SDW-EDGE-M', 'SD-WAN Edge Appliance (Medium)', 12000, 90000),
  C('sdwan-hub', 'SDW-HUB-L', 'SD-WAN Hub / Gateway (Large)', 30000, 350000),
  C('sdwan-controller', 'SDW-CTRL', 'SD-WAN Controller Subscription', 20000, 0),
  C('sdwan-orchestrator', 'SDW-ORCH', 'SD-WAN Orchestrator Subscription', 15000, 0),
  C('sase', 'SASE-SEAT', 'SASE Security Service', 25000, 0),
  C('firewall', 'FW-MGD', 'Managed Firewall', 15000, 120000),
  C('l3-switch', 'SW-L3', 'L3 Switch', 3000, 180000),
  C('l2-switch', 'SW-L2', 'LAN Switch', 1500, 60000),
  C('wifi-ap', 'WIFI-AP', 'Managed Wi-Fi Access Point', 800, 18000),
  C('lte-router', 'RTR-5G', '4G/5G Router', 1500, 22000),
  C('ont', 'ONT-STD', 'ONT / Broadband Modem', 0, 3500),
  C('handset', 'HS-5G-STD', '5G Smartphone', 0, 45000),
  C('tablet', 'TAB-STD', 'Tablet / Laptop', 0, 55000),
  C('subscription', 'MOB-BIZ-PLAN', 'Business Mobile Plan', 599, 100),
  C('iot-device', 'IOT-DEV', 'IoT Device', 50, 2500),
  C('mifi', 'MIFI-5G', '5G MiFi Device', 0, 6000),
  C('ip-pbx', 'IPPBX', 'IP PBX', 10000, 250000),
  C('sbc', 'SBC', 'Session Border Controller', 12000, 300000),
  C('ip-phone', 'IPPHONE', 'IP Phone', 150, 6000),
  C('load-balancer', 'LB', 'Load Balancer', 9000, 220000),
  C('ddos', 'DDOS-PROT', 'DDoS Protection Service', 30000, 0),
];

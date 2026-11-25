import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { COMPONENT_MAP } from '../data/catalog.js';
import Icon from './Icon.jsx';

const HANDLES = [['t', Position.Top], ['r', Position.Right], ['b', Position.Bottom], ['l', Position.Left]];

function DeviceNode({ data, selected }) {
  const c = COMPONENT_MAP[data.typeId] || { color: '#475569', icon: 'router' };
  return (
    <div className={`dev${selected ? ' sel' : ''}`}>
      <div className="dev-tile" style={{ color: c.color, borderColor: c.color }}>
        {HANDLES.map(([id, pos]) => (
          <Handle key={id} id={id} type="source" position={pos} />
        ))}
        <Icon name={c.icon} size={34} />
        {Number(data.qty) > 1 && <span className="dev-qty" style={{ background: c.color }}>×{data.qty}</span>}
      </div>
      <div className="dev-label">{data.label}</div>
      {data.location && <div className="dev-loc">{data.location}</div>}
    </div>
  );
}

export default memo(DeviceNode);

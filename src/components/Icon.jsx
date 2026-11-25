import { ICONS } from '../data/catalog.js';

export default function Icon({ name, size = 24 }) {
  return (
    <svg
      viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || ICONS.router }}
    />
  );
}

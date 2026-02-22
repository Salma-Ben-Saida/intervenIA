export function InterveniaLogo({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Grid/City blocks - representing urban structure */}
      <g opacity="0.6">
        <rect x="6" y="6" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="6" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="20" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="20" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Central AI node - circle with pulse effect concept */}
      <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.8" />
      <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />

      {/* Connecting lines - representing intelligence/connectivity */}
      <line x1="12" y1="12" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="30" y1="12" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="12" y1="30" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="30" y1="30" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* Tech/efficiency indicator - small dots at network nodes */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="30" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="30" r="1.5" fill="currentColor" />
      <circle cx="30" cy="30" r="1.5" fill="currentColor" />

      {/* Arrow/direction - representing active interventions */}
      <path
        d="M 36 24 L 42 24 M 39 21 L 42 24 L 39 27"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

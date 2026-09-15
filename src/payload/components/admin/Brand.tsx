/** Admin login + nav graphics: the antler mark drawn as SVG so it stays crisp in both admin themes. */
const Mark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M9 5C7 18 12 30 22 43M13 24C17 20 19 14 18 8M39 5C41 18 36 30 26 43M35 24C31 20 29 14 30 8"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Icon = () => (
  <span style={{ color: 'var(--theme-text)', display: 'inline-flex' }}>
    <Mark />
  </span>
)

export const Logo = () => (
  <span
    style={{
      alignItems: 'center',
      color: 'var(--theme-text)',
      display: 'inline-flex',
      fontSize: 22,
      fontWeight: 700,
      gap: 12,
      letterSpacing: '0.04em',
    }}
  >
    <Mark size={40} />
    HEADING NORTH
  </span>
)

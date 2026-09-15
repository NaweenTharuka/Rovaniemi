import type { ReactNode } from 'react'

/** Re-mounts on every navigation; the CSS settle needs no JavaScript and respects reduced motion. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>
}

export const PreviewSiteLink = () => (
  <a
    href={`${process.env.NEXT_PUBLIC_SERVER_URL || ''}/`}
    target="_blank"
    rel="noreferrer"
    style={{
      display: 'block',
      marginTop: 'calc(var(--base) * 0.5)',
      padding: '8px 0',
      color: 'var(--theme-text)',
      textDecoration: 'none',
      fontWeight: 600,
    }}
  >
    Preview website ↗
  </a>
)

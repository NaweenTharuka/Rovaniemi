/** Server-rendered notice shown while an editor previews unpublished content. */
export function DraftBanner() {
  return (
    <div className="tone-ink fixed bottom-4 left-1/2 z-[75] flex -translate-x-1/2 items-center gap-4 rounded-full border border-rule bg-surface px-5 py-2.5 text-fg shadow-lg">
      <span className="label text-signal">Preview</span>
      <span className="text-sm text-fg-muted">Showing unpublished changes</span>
      {/* A full navigation is required so the route handler can clear the draft-mode cookie. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/next/exit-preview" className="label underline underline-offset-4">
        Exit
      </a>
    </div>
  )
}

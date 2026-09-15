import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'author'

export const ROLES: { label: string; value: Role }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Author', value: 'author' },
]

/** Accepts request users and admin-UI client users alike. */
type MaybeUser = PayloadRequest['user'] | { collection?: string; role?: unknown } | null | undefined

export const roleOf = (user: MaybeUser): Role | null => {
  if (!user || (user as { collection?: string }).collection !== 'users') return null
  return ((user as { role?: Role }).role as Role) ?? null
}

export const isAdminUser = (user: MaybeUser) => roleOf(user) === 'admin'
export const isEditorOrAbove = (user: MaybeUser) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor'
}
export const isStaff = (user: MaybeUser) => roleOf(user) !== null

/* ------------------------------------------------------------------ collection access */

export const anyone: Access = () => true
export const nobody: Access = () => false

export const admins: Access = ({ req }) => isAdminUser(req.user)
export const editors: Access = ({ req }) => isEditorOrAbove(req.user)
export const staff: Access = ({ req }) => isStaff(req.user)

/** Public visitors only ever see published documents; signed-in staff see drafts too. */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaff(req.user)) return true
  return { _status: { equals: 'published' } }
}

/**
 * Admin/editor: full update rights.
 * Author: may update only documents they created, and may never publish.
 */
export const editorsOrOwnDraft: Access = ({ req, data }) => {
  const role = roleOf(req.user)
  if (role === 'admin' || role === 'editor') return true
  if (role === 'author') {
    if (data?._status === 'published') return false
    return { createdBy: { equals: req.user?.id } }
  }
  return false
}

/** Authors can create, but a create that publishes immediately is reserved for editors. */
export const staffCreateNoAuthorPublish: Access = ({ req, data }) => {
  const role = roleOf(req.user)
  if (role === 'admin' || role === 'editor') return true
  if (role === 'author') return data?._status !== 'published'
  return false
}

export const adminsOrSelf: Access = ({ req }) => {
  if (isAdminUser(req.user)) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}

/* ------------------------------------------------------------------ field access */

export const adminFieldAccess: FieldAccess = ({ req }) => isAdminUser(req.user)
export const editorFieldAccess: FieldAccess = ({ req }) => isEditorOrAbove(req.user)

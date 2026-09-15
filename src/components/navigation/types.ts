export type NavLink = {
  href: string
  label: string
  external: boolean
  newTab: boolean
  description?: string | null
  children?: NavLink[]
}

export type HeaderData = {
  brandName: string
  logoVariant: 'auto' | 'light' | 'dark' | 'text'
  logoLight?: string | null
  logoDark?: string | null
  items: NavLink[]
  cta?: NavLink | null
  contact: {
    email?: string | null
    whatsapp?: string | null
    whatsappHref?: string | null
    location?: string | null
  }
}

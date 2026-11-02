// Kontroll av att en Stripe Checkout Session är betald och gäller det som
// levereras. Ren funktion utan Stripe-anrop, så att den kan testas separat.
// API-routen /api/verify-session hämtar sessionen och anropar checkSession().

import { isTemplatePackage, type PackageType } from './packages'

export const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/
const SLUG_RE = /^[a-z0-9-]{1,100}$/

/** Det som avgör om sessionen godtas: vad kunden vill ha levererat. */
export type VerifyRequest =
  | { kind: 'template'; slug: string } // enskilt köp av en mall
  | { kind: 'package'; packageType: string } // paketköp, krediter delas ut
  | { kind: 'credit' } // inlösen av paketkredit: sessionen måste vara ett betalt paket

/** De delar av Stripe-sessionen som kontrollen behöver. */
export interface SessionLike {
  payment_status: string
  metadata: Record<string, string> | null
}

export type VerifyResult = { ok: true; packageType: PackageType } | { ok: false }

const MULTI: PackageType[] = ['family', 'estate']

export function parseRequest(params: URLSearchParams): VerifyRequest | null {
  const slug = params.get('slug')
  const pkg = params.get('package')
  const credit = params.get('credit')
  if (slug && !pkg && !credit) return SLUG_RE.test(slug) ? { kind: 'template', slug } : null
  if (pkg && !slug && !credit) return { kind: 'package', packageType: pkg }
  if (credit === '1' && !slug && !pkg) return { kind: 'credit' }
  return null
}

export function checkSession(session: SessionLike, req: VerifyRequest): VerifyResult {
  if (session.payment_status !== 'paid') return { ok: false }
  const meta = session.metadata || {}
  // Sessioner från före paketen (juni 2026) saknar packageType och var alltid
  // enskilda köp.
  const type = (meta.packageType || 'single') as PackageType

  switch (req.kind) {
    case 'template':
      return isTemplatePackage(type) && meta.templateSlug === req.slug
        ? { ok: true, packageType: type }
        : { ok: false }
    case 'package':
      return MULTI.includes(type) && type === req.packageType
        ? { ok: true, packageType: type }
        : { ok: false }
    case 'credit':
      return MULTI.includes(type) ? { ok: true, packageType: type } : { ok: false }
  }
}

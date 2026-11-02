import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SESSION_ID_RE, parseRequest, checkSession } from '@/lib/verify-session'

// Svaret beror på Stripe-data i realtid och får aldrig cachas.
export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store' }

function fail(status: number) {
  return NextResponse.json({ ok: false }, { status, headers: NO_STORE })
}

/**
 * GET /api/verify-session?session_id=cs_…&slug=…        enskilt köp av en mall
 * GET /api/verify-session?session_id=cs_…&package=family paketköp
 * GET /api/verify-session?session_id=cs_…&credit=1       inlösen av paketkredit
 *
 * Svarar bara { ok: true, packageType } eller { ok: false }. Inga uppgifter
 * om kunden eller betalningen skickas tillbaka.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const sessionId = params.get('session_id') || ''
  const request = parseRequest(params)
  if (!SESSION_ID_RE.test(sessionId) || !request) return fail(400)

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    console.error('verify-session: STRIPE_SECRET_KEY saknas')
    return fail(500)
  }
  const stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' })

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    // Okänd eller ogiltig session (t.ex. påhittat id). Felmeddelandet loggas
    // utan sessionens innehåll.
    const code = err instanceof Stripe.errors.StripeError ? err.code || err.type : 'unknown'
    if (code !== 'resource_missing') console.error('verify-session: Stripe-fel', code)
    return fail(404)
  }

  const result = checkSession({ payment_status: session.payment_status, metadata: session.metadata }, request)
  return result.ok
    ? NextResponse.json(result, { headers: NO_STORE })
    : fail(402)
}

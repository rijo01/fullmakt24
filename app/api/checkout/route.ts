import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPackage } from '@/lib/packages'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateSlug, templateName, formData, packageType = 'single' } = body

    const pkg = getPackage(packageType)
    const isSingle = pkg.type === 'single'

    // Ett enskilt köp är knutet till en specifik mall; paketköp är det inte.
    if (isSingle && (!templateSlug || !templateName)) {
      return NextResponse.json({ error: 'Template info required' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fullmakt24.se'

    // Produktnamn och beskrivning per pakettyp.
    const productName = isSingle ? `Fullmakt: ${templateName}` : pkg.name
    const productDescription = isSingle
      ? 'Professionell PDF utan vattenstämpel – klar att signera'
      : pkg.description

    // Single -> tillbaka till betald-sidan för just den mallen.
    // Paket -> betald-sidan med pakettyp, krediter delas ut där.
    const successUrl = isSingle
      ? `${siteUrl}/betald?session_id={CHECKOUT_SESSION_ID}&slug=${templateSlug}`
      : `${siteUrl}/betald?session_id={CHECKOUT_SESSION_ID}&package=${pkg.type}`

    const cancelUrl = isSingle
      ? `${siteUrl}/skapa/${templateSlug}`
      : `${siteUrl}/priser`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: pkg.amount, // öre
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'sv',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        packageType: pkg.type,
        credits: String(pkg.credits),
        templateSlug: templateSlug || '',
        templateName: templateName || '',
        formData: formData ? JSON.stringify(formData).slice(0, 500) : '', // Stripe metadata limit
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

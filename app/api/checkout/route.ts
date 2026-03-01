import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateSlug, templateName, formData } = body

    if (!templateSlug || !templateName) {
      return NextResponse.json({ error: 'Template info required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Fullmakt: ${templateName}`,
              description: 'Professionell PDF utan vattenstämpel – klar att signera',
            },
            unit_amount: 4900, // 49 kr in öre
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'sv',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fullmakt24.se'}/betald?session_id={CHECKOUT_SESSION_ID}&slug=${templateSlug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fullmakt24.se'}/skapa/${templateSlug}`,
      metadata: {
        templateSlug,
        templateName,
        formData: JSON.stringify(formData).slice(0, 500), // Stripe metadata limit
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

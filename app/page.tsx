import type { Metadata } from 'next'
import { canonicalWithOg } from '@/lib/og'
import HomePage from './HomePage'

export const metadata: Metadata = {
  ...canonicalWithOg('/'),
}

export default function Page() {
  return <HomePage />
}

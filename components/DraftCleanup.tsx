'use client'

import { useEffect } from 'react'
import { purgeOldDrafts } from '@/lib/drafts'

/** Tar bort utgångna utkast när sajten öppnas, oavsett sida (lib/drafts.ts). */
export function DraftCleanup() {
  useEffect(() => {
    purgeOldDrafts()
  }, [])
  return null
}

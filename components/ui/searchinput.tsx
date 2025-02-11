import React from 'react'
import { Input } from '@/components/ui/input'

/**
 * SearchInput provides a styled search field to improve discovery in the dashboard.
 */
export function SearchInput() {
  return (
    <Input
      type="text"
      placeholder="Search for a prompt..."
      className="w-full max-w-sm border rounded-md py-2 px-3"
      aria-label="Search dashboard"
    />
  )
}
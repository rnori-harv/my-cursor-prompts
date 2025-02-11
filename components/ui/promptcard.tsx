import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface PromptCardProps {
  title: string
  prompt: string
}

/**
 * PromptCard displays a consistent, styled container for prompt elements.
 * Height increased to show more content while maintaining grid layout.
 */
export function PromptCard({ title, prompt }: PromptCardProps) {
  return (
    <Card className="h-[300px] flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <p className="text-sm text-gray-600 line-clamp-8">
          {prompt}
        </p>
      </CardContent>
    </Card>
  )
}
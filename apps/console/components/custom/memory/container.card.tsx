import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Database } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function ContainerCard() {
  return (
    <Card className="p-0">
      <CardHeader className="flex flex-row items-start gap-4 p-6 pb-2">
        <div className="w-12 h-12 rounded-md flex items-center justify-center bg-muted">
          <Database className="text-muted-foreground" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-semibold">
              AI Research
            </CardTitle>
            <Badge>
              24 resources
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-6">
        <p className="text-sm text-muted-foreground">
          Collection of AI and machine learning research papers, documentation, and resources
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0 px-6 pb-6">
        <span className="text-xs text-muted-foreground">
          Created 1/15/2024
        </span>
        <Link
          href="#"
          className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
        >
          Open
          <svg
            className="w-4 h-4 ml-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  )
}

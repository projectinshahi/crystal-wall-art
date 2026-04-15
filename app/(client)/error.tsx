"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="max-w-md text-center">

        <h1 className="mb-4 text-4xl font-bold text-dark-gray">
          Something went wrong
        </h1>

        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred while loading this page.
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={() => reset()}
            className="rounded-md bg-primary px-6 py-2 text-white hover:opacity-90 transition"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-md border border-gray-border px-6 py-2 hover:bg-light-gray transition"
          >
            Go Home
          </Link>

        </div>
      </div>
    </div>
  )
}
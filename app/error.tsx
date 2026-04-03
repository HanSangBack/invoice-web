"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error)
    }
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">문제가 발생했습니다</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {process.env.NODE_ENV !== "production"
            ? error.message
            : "예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            오류 코드: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="size-4" />
          다시 시도
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  )
}

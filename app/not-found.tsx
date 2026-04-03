import Link from "next/link"
import { FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-muted p-6">
          <FileSearch className="size-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-black tracking-tighter text-foreground">
            404
          </h1>
          <h2 className="text-xl font-semibold">페이지를 찾을 수 없습니다</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>
      </div>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}

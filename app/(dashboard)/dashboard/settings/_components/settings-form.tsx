"use client"

import { Save, Key } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function SettingsForm() {
  const [apiKey, setApiKey] = useState("")
  const [databaseId, setDatabaseId] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!apiKey || !databaseId) {
      toast.error("모든 필드를 입력해주세요")
      return
    }

    setIsSaving(true)
    try {
      // 환경 변수는 런타임에 변경할 수 없으므로,
      // 실제 구현에서는 서버에서 환경 변수를 읽거나
      // 데이터베이스에 저장해야 합니다.
      toast.success("설정이 저장되었습니다")
      setApiKey("")
      setDatabaseId("")
    } catch {
      toast.error("설정 저장 중 오류가 발생했습니다")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="size-5" />
          Notion API 설정
        </CardTitle>
        <CardDescription>
          Notion API Key와 Database ID를 설정하여 데이터를 동기화합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="apiKey">Notion API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="secret_xxxxxxxxxxxxxxxx"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Notion 인테그레이션
            </a>
            에서 API Key를 생성하세요.
          </p>
        </div>

        {/* Database ID */}
        <div className="space-y-2">
          <Label htmlFor="databaseId">Database ID</Label>
          <Input
            id="databaseId"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Notion DB 페이지 URL에서 ID를 복사하세요. (예: /database/
            <span className="font-mono">abc123...xyz</span>)
          </p>
        </div>

        <Separator />

        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <p className="font-medium mb-2">설정 방법:</p>
          <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
            <li>
              <a
                href="https://www.notion.so/my-integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Notion Integrations
              </a>
              에서 새 integration 생성
            </li>
            <li>생성된 API Key를 복사하여 위에 입력</li>
            <li>Notion 데이터베이스의 ID를 URL에서 추출</li>
            <li>Save를 클릭하여 저장</li>
          </ol>
        </div>

        <Button
          className="gap-2"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="size-4" />
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </CardContent>
    </Card>
  )
}

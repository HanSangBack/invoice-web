import type { Metadata } from "next"
import { Lock, Palette } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SettingsForm } from "./_components/settings-form"

export const metadata: Metadata = {
  title: "설정",
}

const SETTINGS_SECTIONS = [
  {
    icon: "Sliders",
    title: "일반 설정",
    description: "애플리케이션의 기본 설정을 관리합니다.",
  },
  {
    icon: "Bell",
    title: "알림 설정",
    description: "메일, 푸시 알림 등의 설정을 제어합니다.",
  },
  {
    icon: Lock,
    title: "보안 설정",
    description: "비밀번호, 두 단계 인증 등의 보안 옵션",
  },
  {
    icon: Palette,
    title: "테마 설정",
    description: "다크/라이트 모드 등 UI 테마를 선택합니다.",
  },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
        <p className="mt-2 text-muted-foreground">
          애플리케이션 설정을 관리하고 선호도를 조정하세요.
        </p>
      </div>

      {/* 설정 옵션 요약 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {SETTINGS_SECTIONS.map((section) => {
          const IconComponent = typeof section.icon === "string" ? null : section.icon
          return (
            <Card key={section.title} className="border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="w-fit rounded-lg bg-primary/10 p-2.5 mb-2">
                  {IconComponent && <IconComponent className="size-5 text-primary" />}
                </div>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription className="text-xs">
                  {section.description}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Separator />

      {/* 폼 컴포넌트 (클라이언트) */}
      <SettingsForm />

      {/* 위험 영역 */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <Lock className="size-5" />
            위험 영역
          </CardTitle>
          <CardDescription>
            주의 깊게 사용하세요. 이 작업은 되돌릴 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">계정 삭제</p>
              <p className="text-sm text-muted-foreground">
                모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>
            <Button variant="destructive">삭제</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

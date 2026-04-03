// Notion 환경 변수 검증
export function getNotionConfig() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!apiKey) {
    throw new Error(
      "NOTION_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    )
  }

  if (!databaseId) {
    throw new Error(
      "NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    )
  }

  return { apiKey, databaseId }
}

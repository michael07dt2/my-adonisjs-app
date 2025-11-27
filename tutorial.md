# Seo-Backoffice

# 환경 설정

### colima 설치 및, 터미널에 colima start 하기.

# VSCode Tip

files to exclude search
build, node_modules, package.json, package-lock.json
build, node_modules, package.json, package-lock.json, storage

Cmd + J = 터미널 열기
Cmd + \ = 화면 분할

Cmd + P = 파일 검색
Cmd + O = 파일 열기

Cmd + Shift + N = 새 창 열기

---

# 노드 명령어

### 패키지 다운로드

npm i

### 키 생성

node ace generate:key

### 개발 환경 실행

npm run dev

### 마이그레이션, 모델, 컨트롤러 파일 생성

node ace make:migration NAME
node ace make:model NAME
node ace make:controller NAME

### 마이그레이션 실행

node ace migration:run

### 빌드 및 실행

npm run build
npm run start

### 디버깅용 노드 커맨드

node ace list -- 여러가지 디버깅용 명령어 확인 가능
node ace test -- 정의된 테스트 실행

### 크롬 단축키

Option + Command + I = 개발자 도구

### api 로 임시 데이터 전송

for mac

curl -X POST \
 -H "Content-Type: application/json" \
 -d '{"name": "테스터", "title": "Curl 테스트 제목", "content": "Bash에서 전송한 내용입니다."}' \
 http://localhost:3333/api/posts

for windows

$Body = @{
name = "테스터"
title = "Curl 테스트 제목"
content = "PowerShell에서 전송한 내용입니다."
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3333/api/posts `      -Method POST`
-Headers @{"Content-Type" = "application/json"} `
-Body $Body

# 사용자 편의를 위한 주요 기능 정리

- 페이지
  - 카드형, 목록형 표시
    - 목록형 일 때는, 표시할 개수도 표시
- 파일 게시
- 게시물 열기
- 등등
- 게시물 정보 = {
  제목, 작성자, 작성일 // 조회수, 좋아요
  }
- 댓글
  댓글 박스 크기 조절
  댓글 submit

# DB 추가 로직

migration
model
controller
routes
start/routes.ts

# 롤1백
node ace migration:rollback

tree -I 'node_modules|postgres'
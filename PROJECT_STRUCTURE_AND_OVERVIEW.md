# AI Creator Studio - Complete Project Structure

## FOLDER STRUCTURE

```
ai_story_creator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/summary/route.ts
│   │   │   ├── api-keys/[id]/route.ts
│   │   │   ├── api-keys/route.ts
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── auth/init-demo/route.ts
│   │   │   ├── auth/register/route.ts
│   │   │   ├── characters/init/route.ts
│   │   │   ├── characters/route.ts
│   │   │   ├── content/route.ts
│   │   │   ├── director/plan/route.ts
│   │   │   ├── generate/batch/route.ts
│   │   │   ├── generate/image/route.ts
│   │   │   ├── generate/video/route.ts
│   │   │   ├── generate/voiceover/route.ts
│   │   │   ├── projects/[id]/route.ts
│   │   │   ├── projects/route.ts
│   │   │   ├── queue/route.ts
│   │   │   ├── queue/status/[jobId]/route.ts
│   │   │   ├── scheduler/route.ts
│   │   │   ├── social/tiktok/analytics/[videoId]/route.ts
│   │   │   ├── social/tiktok/route.ts
│   │   │   ├── socket/route.ts
│   │   │   ├── tiktok/auth/start/route.ts
│   │   │   ├── tiktok/upload/route.ts
│   │   │   ├── trends/route.ts
│   │   │   └── route.ts
│   │   ├── calendar/page.tsx
│   │   ├── calendar/ScheduleModal.tsx
│   │   ├── characters/page.tsx
│   │   ├── content-queue/JobDetailModal.tsx
│   │   ├── content-queue/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── performance/page.tsx
│   │   ├── projects/[id]/AddSceneModal.tsx
│   │   ├── projects/[id]/DirectorPanel.tsx
│   │   ├── projects/[id]/page.tsx
│   │   ├── projects/[id]/SceneCard.tsx
│   │   ├── projects/CreateProjectModal.tsx
│   │   ├── projects/page.tsx
│   │   ├── settings/api-keys/page.tsx
│   │   ├── settings/social/page.tsx
│   │   ├── trends/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (50+ ShadCN UI components)
│   │   └── providers.tsx
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── use-simple-socket.ts
│   │   ├── use-socket.ts
│   │   └── use-toast.ts
│   └── lib/
│       ├── ai-director/director.ts
│       ├── elevenlabs/client.ts
│       ├── scheduler/automated-scheduler.ts
│       ├── tiktok/client.ts
│       ├── z-ai/client.ts
│       ├── auth.ts
│       ├── db.ts
│       └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
│   ├── logo.svg
│   └── robots.txt
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── middleware.ts
├── components.json
├── eslint.config.mjs
├── postcss.config.mjs
└── .env
```

## KEY TECHNOLOGIES

- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5
- **Database**: Prisma + SQLite
- **Auth**: NextAuth v5
- **UI**: ShadCN UI + Tailwind CSS 4
- **AI Models**: Z.ai SDK (CogView-4, Vidu-Q1, GLM-4.6)
- **Social**: TikTok API Integration
- **Real-time**: Socket.io
- **Voice**: ElevenLabs API

## COMPLETE FILE DUMP

See `FULL_CODEBASE.txt` for complete source code of all 108 TypeScript/TSX files.


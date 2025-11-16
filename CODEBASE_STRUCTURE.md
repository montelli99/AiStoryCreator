# Codebase Structure & Status

## Directory Tree

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts          ✓ Working
│   │   │   └── init-demo/route.ts              ✓ Working
│   │   ├── analytics/
│   │   │   └── summary/route.ts                ✓ Working
│   │   ├── api-keys/
│   │   │   ├── route.ts                        ✓ Working
│   │   │   └── [id]/route.ts                   ✓ Working
│   │   ├── characters/
│   │   │   ├── route.ts                        ✓ Working
│   │   │   └── init/route.ts                   ✓ Working
│   │   ├── director/
│   │   │   └── plan/route.ts                   ⚠️ Error in jobQueue.update
│   │   ├── generate/
│   │   │   ├── image/route.ts                  ✓ Working
│   │   │   └── video/route.ts                  ✓ Working
│   │   ├── projects/route.ts                   ✓ Working
│   │   ├── queue/route.ts                      ✓ Working
│   │   ├── scheduler/route.ts                  ✓ Working
│   │   ├── socket/route.ts                     ✓ Simplified
│   │   ├── social/                             ❌ MISSING
│   │   ├── tiktok/
│   │   │   ├── auth/start/route.ts             🔴 CRITICAL: Typo + query issue
│   │   │   └── upload/route.ts                 ✓ Working
│   │   ├── trends/route.ts                     ✓ Working
│   │   └── route.ts                            ✓ Working
│   ├── dashboard/page.tsx                      ✓ Working
│   ├── login/page.tsx                          ✓ Working
│   ├── characters/page.tsx                     ✓ Working
│   ├── settings/social/page.tsx                ✓ Working
│   ├── layout.tsx                              ⚠️ Scheduler disabled
│   ├── page.tsx                                ✓ Redirects to dashboard
│   └── globals.css                             ✓ Working
├── components/
│   ├── ui/                                     ✓ All ShadCN components
│   └── providers.tsx                           ✓ Working
├── hooks/
│   ├── use-socket.ts                           ✓ Working
│   ├── use-simple-socket.ts                    ✓ Working
│   ├── use-toast.ts                            ✓ Working
│   └── use-mobile.ts                           ✓ Working
└── lib/
    ├── auth.ts                                 ✓ Working
    ├── db.ts                                   ✓ Working
    ├── utils.ts                                ✓ Working
    ├── ai-director/
    │   └── director.ts                         ✓ Working
    ├── elevenlabs/                             ⚠️ Empty directory
    ├── scheduler/
    │   └── automated-scheduler.ts              ⚠️ Disabled in layout
    ├── tiktok/
    │   └── client.ts                           🔴 CRITICAL: Template string issue
    └── z-ai/
        └── client.ts                           ✓ Working

prisma/
└── schema.prisma                               ✓ Synced with DB

Config Files:
├── next.config.ts                              ✓ Standalone output
├── tsconfig.json                               ✓ Strict mode
├── tailwind.config.ts                          ✓ Configured
├── components.json                             ✓ ShadCN config
├── eslint.config.mjs                           ✓ All rules disabled
├── middleware.ts                               ✓ API key validation
├── package.json                                ✓ All deps installed
└── .env                                        ✓ Created with placeholders
```

## Status Summary

| Category | Count | Status |
|----------|-------|--------|
| ✓ Working Files | 35+ | Good |
| ⚠️ Warnings | 3 | Needs attention |
| 🔴 Critical | 3 | Must fix |
| ❌ Missing | 1 | Create |

## Key Statistics

- **Total API Routes:** 20+
- **Total Components:** 50+
- **Total Hooks:** 4
- **Database Models:** 10
- **Build Status:** ✓ Passes
- **Dev Server:** ✓ Running on :3000
- **Database:** ✓ SQLite synced


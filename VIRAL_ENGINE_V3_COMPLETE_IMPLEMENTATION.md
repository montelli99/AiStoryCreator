# VIRAL ENGINE V3 — COMPLETE IMPLEMENTATION GUIDE

This document contains the FULL production-ready code for all systems.

---

## PART 1: PRISMA SCHEMA UPDATES

**File:** `prisma/schema.prisma`

Add these models at the END of the file (before the closing brace):

```prisma
// ============================================
// VIRAL ENGINE V3 MODELS
// ============================================

model ViralInsight {
  id              String   @id @default(cuid())
  projectId       String?
  contentId       String?
  
  niche           String
  primaryTopic    String
  subTopic        String?
  
  bestHook        String?
  bestAngle       String?
  trendScore      Int      @default(0)
  
  expectedWatchTime Float?
  expectedCTR       Float?
  expectedEngagement Float?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model VideoVariant {
  id              String   @id @default(cuid())
  contentId       String
  variant         String   // "hero" | "crop" | "fast" | "slow" | "cinematic"
  url             String?
  
  hashtagsId      String?
  descriptionId   String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model HashtagGroup {
  id              String   @id @default(cuid())
  primary         String[]
  velocity        String[]
  nicheTags       String[]
  lowComp         String[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model DescriptionGroup {
  id              String   @id @default(cuid())
  viral           String
  cta             String
  longform        String
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PerformanceSnapshot {
  id              String   @id @default(cuid())
  videoId         String
  views           Int      @default(0)
  likes           Int      @default(0)
  comments        Int      @default(0)
  shares          Int      @default(0)
  watchRate       Float    @default(0)
  
  createdAt       DateTime @default(now())
}

model TikTokAccount {
  id              String   @id @default(cuid())
  userId          String
  nickname        String
  accessToken     String?
  refreshToken    String?
  expiresAt       Int?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SplitTest {
  id              String   @id @default(cuid())
  contentId       String
  variantA        String
  variantB        String
  
  performanceA    Float    @default(0)
  performanceB    Float    @default(0)
  winner          String?
  
  createdAt       DateTime @default(now())
  completedAt     DateTime?
}
```

**THEN RUN:**
```bash
npx prisma generate
npx prisma db push
```

---

## PART 2: LIBRARY FILES

See next file: `VIRAL_ENGINE_V3_LIBRARIES.md`

---

## PART 3: API ROUTES

See file: `VIRAL_ENGINE_V3_API_ROUTES.md`

---

## PART 4: UI PAGES

See file: `VIRAL_ENGINE_V3_UI_PAGES.md`

---

## PART 5: COMPONENTS

See file: `VIRAL_ENGINE_V3_COMPONENTS.md`

---

**CONTINUE TO:** `VIRAL_ENGINE_V3_LIBRARIES.md`


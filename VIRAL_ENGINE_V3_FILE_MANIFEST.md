# VIRAL ENGINE V3 — EXACT FILE MANIFEST

**Complete list of all files to create with exact paths and line counts**

---

## LIBRARY FILES (5 files)

### 1. src/lib/viral-brain/engine.ts
- **Lines:** ~80
- **Purpose:** GLM-4.6 script analysis
- **Source:** VIRAL_ENGINE_V3_LIBRARIES.md

### 2. src/lib/viral-brain/hashtags.ts
- **Lines:** ~30
- **Purpose:** Hashtag generation
- **Source:** VIRAL_ENGINE_V3_LIBRARIES.md

### 3. src/lib/viral-brain/descriptions.ts
- **Lines:** ~15
- **Purpose:** Description variants
- **Source:** VIRAL_ENGINE_V3_LIBRARIES.md

### 4. src/lib/viral-brain/variants.ts
- **Lines:** ~20
- **Purpose:** Video variant generation
- **Source:** VIRAL_ENGINE_V3_LIBRARIES.md

### 5. src/lib/viral-brain/split-test.ts
- **Lines:** ~40
- **Purpose:** Split test management
- **Source:** VIRAL_ENGINE_V3_LIBRARIES.md

---

## API ROUTES (6 files)

### 6. src/app/api/viral/analyze/route.ts
- **Lines:** ~35
- **Purpose:** Script analysis endpoint
- **Source:** VIRAL_ENGINE_V3_API_ROUTES.md

### 7. src/app/api/viral/hashtags/route.ts
- **Lines:** ~25
- **Purpose:** Hashtag generation endpoint
- **Source:** VIRAL_ENGINE_V3_API_ROUTES.md

### 8. src/app/api/viral/descriptions/route.ts
- **Lines:** ~25
- **Purpose:** Description generation endpoint
- **Source:** VIRAL_ENGINE_V3_API_ROUTES.md

### 9. src/app/api/viral/variants/route.ts
- **Lines:** ~25
- **Purpose:** Variant generation endpoint
- **Source:** VIRAL_ENGINE_V3_API_ROUTES.md

### 10. src/app/api/viral/split-test/route.ts
- **Lines:** ~45
- **Purpose:** Split test management endpoint
- **Source:** VIRAL_ENGINE_V3_API_ROUTES.md

### 11. src/app/api/viral/performance/route.ts
- **Lines:** ~25
- **Purpose:** Performance tracking endpoint
- **Source:** VIRAL_ENGINE_V3_API_ROUTES.md

---

## UI PAGES (3 files)

### 12. src/app/viral-dashboard/page.tsx
- **Lines:** ~90
- **Purpose:** Main viral dashboard
- **Source:** VIRAL_ENGINE_V3_UI_PAGES.md

### 13. src/app/accounts/page.tsx
- **Lines:** ~50
- **Purpose:** Multi-account manager
- **Source:** VIRAL_ENGINE_V3_UI_PAGES.md

### 14. src/app/split-tests/page.tsx
- **Lines:** ~60
- **Purpose:** Split test results viewer
- **Source:** VIRAL_ENGINE_V3_UI_PAGES.md

---

## COMPONENTS (3 files)

### 15. src/components/viral/ScriptAnalyzer.tsx
- **Lines:** ~120
- **Purpose:** Script analysis UI component
- **Source:** VIRAL_ENGINE_V3_COMPONENTS.md

### 16. src/components/viral/HashtagGenerator.tsx
- **Lines:** ~100
- **Purpose:** Hashtag generation UI component
- **Source:** VIRAL_ENGINE_V3_COMPONENTS.md

### 17. src/components/viral/VariantSelector.tsx
- **Lines:** ~60
- **Purpose:** Variant selection UI component
- **Source:** VIRAL_ENGINE_V3_COMPONENTS.md

---

## SCHEMA UPDATE (1 file)

### 18. prisma/schema.prisma (APPEND)
- **Lines:** ~120
- **Purpose:** Add 7 new Prisma models
- **Source:** VIRAL_ENGINE_V3_COMPLETE_IMPLEMENTATION.md
- **Action:** APPEND to end of file (before closing brace)

---

## SUMMARY

| Category | Count | Total Lines |
|----------|-------|-------------|
| Libraries | 5 | 185 |
| API Routes | 6 | 180 |
| UI Pages | 3 | 200 |
| Components | 3 | 280 |
| Schema | 1 | 120 |
| **TOTAL** | **18** | **965** |

---

## FOLDER STRUCTURE TO CREATE

```
src/lib/viral-brain/
  ├── engine.ts
  ├── hashtags.ts
  ├── descriptions.ts
  ├── variants.ts
  └── split-test.ts

src/app/api/viral/
  ├── analyze/
  │   └── route.ts
  ├── hashtags/
  │   └── route.ts
  ├── descriptions/
  │   └── route.ts
  ├── variants/
  │   └── route.ts
  ├── split-test/
  │   └── route.ts
  └── performance/
      └── route.ts

src/app/viral-dashboard/
  └── page.tsx

src/app/accounts/
  └── page.tsx

src/app/split-tests/
  └── page.tsx

src/components/viral/
  ├── ScriptAnalyzer.tsx
  ├── HashtagGenerator.tsx
  └── VariantSelector.tsx
```

---

## CREATION ORDER

1. Create folders (mkdir commands)
2. Create library files (5 files)
3. Create API routes (6 files)
4. Create UI pages (3 files)
5. Create components (3 files)
6. Update Prisma schema (1 file)
7. Run: npx prisma generate
8. Run: npx prisma db push
9. Update layout.tsx navigation
10. Restart dev server

---

## VERIFICATION

After creation, verify:

```bash
# Check all files exist
ls -la src/lib/viral-brain/
ls -la src/app/api/viral/
ls -la src/app/viral-dashboard/
ls -la src/app/accounts/
ls -la src/app/split-tests/
ls -la src/components/viral/

# Check Prisma
npx prisma generate

# Check build
npm run build

# Check dev server
npm run dev
```

---

**All files ready for creation. Begin implementation.**


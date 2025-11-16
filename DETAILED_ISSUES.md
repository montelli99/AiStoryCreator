# Detailed Issues & Code Examples

## CRITICAL ISSUE #1: TikTok Variable Name Typo

**File:** `src/app/api/tiktok/auth/start/route.ts`

### Problem (Line 53 & 64):
```typescript
// WRONG - typo in variable name
const tokenUrl = `https://open-api.tiktok.com/v2/oauth/token/?...&client_key=${TIKOK_CLIENT_ID}...`
//                                                                    ^^^^^^^^ TYPO!

// Line 64 also has same typo
client_secret: TIKOK_CLIENT_SECRET,  // WRONG
```

### Solution:
```typescript
// CORRECT
const tokenUrl = `https://open-api.tiktok.com/v2/oauth/token/?...&client_key=${TIKTOK_CLIENT_ID}...`
client_secret: TIKTOK_CLIENT_SECRET,
```

---

## CRITICAL ISSUE #2: Template String Not Interpolated

**File:** `src/lib/tiktok/client.ts:44`

### Problem:
```typescript
// WRONG - single quotes don't interpolate
body: 'grant_type=refresh_token&refresh_token=${this.refreshToken}'
//     ^ Single quotes - variable NOT interpolated!
```

### Solution:
```typescript
// CORRECT - backticks interpolate variables
body: `grant_type=refresh_token&refresh_token=${this.refreshToken}`
//     ^ Backticks - variable IS interpolated!
```

---

## CRITICAL ISSUE #3: NextRequest.query Doesn't Exist

**File:** `src/app/api/tiktok/auth/start/route.ts:19, 43`

### Problem:
```typescript
// WRONG - NextRequest doesn't have .query property
export async function GET(req: NextRequest) {
  const { code, state } = req.query  // ❌ req.query is undefined!
}
```

### Solution:
```typescript
// CORRECT - use nextUrl.searchParams
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
}
```

---

## HIGH PRIORITY ISSUE #4: Director Plan Route Error

**File:** `src/app/api/director/plan/route.ts:235`

### Problem:
```typescript
// WRONG - using type and status as WHERE clause
await db.jobQueue.update({
  where: {
    type: 'director_plan',      // ❌ Not a unique identifier!
    status: 'processing'
  },
  data: { status: 'failed' }
})
```

### Solution:
```typescript
// CORRECT - use id as unique identifier
await db.jobQueue.update({
  where: { id: job.id },
  data: { status: 'failed' }
})
```

---

## HIGH PRIORITY ISSUE #5: Missing API Endpoint

**File:** Referenced in `src/app/dashboard/page.tsx:75`

### Problem:
```typescript
// Dashboard calls this endpoint but it doesn't exist
await fetch("/api/social/tiktok", { method: "POST" })
```

### Solution:
Create `src/app/api/social/tiktok/route.ts` with proper implementation.

---

## MEDIUM PRIORITY ISSUE #6: Scheduler Disabled

**File:** `src/app/layout.tsx:15-16`

### Problem:
```typescript
useEffect(() => {
  // TODO: Fix scheduler initialization
  // startScheduler();  // ❌ Commented out!
}, [])
```

### Solution:
```typescript
useEffect(() => {
  startScheduler();  // ✓ Re-enable with error handling
}, [])
```

---

## LOW PRIORITY ISSUE #7: Unused Imports

**File:** `src/app/layout.tsx:5`
```typescript
import { authOptions } from '@/lib/auth';  // ❌ Never used
```

**File:** `src/app/dashboard/page.tsx:7`
```typescript
import { useSocket } from "@/hooks/use-socket"  // ❌ Imported but incomplete usage
```


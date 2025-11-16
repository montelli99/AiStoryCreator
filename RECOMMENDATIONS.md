# Recommendations & Action Plan

## 🚨 IMMEDIATE ACTIONS (Do First)

### 1. Fix TikTok Auth Route (5 min)
```bash
# File: src/app/api/tiktok/auth/start/route.ts
# Change line 53: TIKOK_CLIENT_ID → TIKTOK_CLIENT_ID
# Change line 64: TIKOK_CLIENT_SECRET → TIKTOK_CLIENT_SECRET
# Change lines 19, 43: req.query → req.nextUrl.searchParams.get()
```

### 2. Fix TikTok Client Template String (2 min)
```bash
# File: src/lib/tiktok/client.ts:44
# Change single quotes to backticks for template interpolation
```

### 3. Fix Director Plan Route (3 min)
```bash
# File: src/app/api/director/plan/route.ts:235
# Change where clause to use id instead of type/status
```

---

## 📋 SHORT-TERM FIXES (This Week)

### 4. Create Missing Social API Endpoint
Create `src/app/api/social/tiktok/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    // Sync TikTok accounts and posts
    // Implementation here
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

### 5. Re-enable Scheduler
```typescript
// src/app/layout.tsx
useEffect(() => {
  try {
    startScheduler()
  } catch (error) {
    console.error('Scheduler failed:', error)
  }
}, [])
```

### 6. Remove Unused Imports
- Remove `authOptions` from `src/app/layout.tsx`
- Clean up unused socket imports in dashboard

---

## 🔧 MEDIUM-TERM IMPROVEMENTS (Next 2 Weeks)

### 7. Implement ElevenLabs Integration
- Create `src/lib/elevenlabs/client.ts`
- Add voiceover generation for content

### 8. Add Error Boundaries
- Wrap components with error boundaries
- Add proper error logging

### 9. Implement Socket.io Properly
- Currently simplified, needs full implementation
- Add real-time job updates

### 10. Add Input Validation
- Validate all API request bodies
- Add Zod schemas for type safety

---

## 📊 TESTING CHECKLIST

- [ ] Test TikTok OAuth flow
- [ ] Test token refresh mechanism
- [ ] Test director plan generation
- [ ] Test scheduler execution
- [ ] Test API key validation
- [ ] Test character initialization
- [ ] Test content generation endpoints
- [ ] Test analytics aggregation

---

## 🎯 PRIORITY MATRIX

| Priority | Task | Time | Impact |
|----------|------|------|--------|
| 🔴 P0 | Fix TikTok typo | 5m | Critical |
| 🔴 P0 | Fix template string | 2m | Critical |
| 🔴 P0 | Fix director route | 3m | Critical |
| 🟠 P1 | Create social endpoint | 15m | High |
| 🟠 P1 | Re-enable scheduler | 10m | High |
| 🟡 P2 | Remove unused imports | 5m | Low |
| 🟡 P2 | Implement ElevenLabs | 2h | Medium |
| 🟢 P3 | Add error boundaries | 1h | Medium |

---

## ✅ VERIFICATION STEPS

After fixes:
1. Run `npm run build` - should still pass
2. Start dev server: `npx next dev`
3. Test login at http://localhost:3000/login
4. Test API endpoints with curl/Postman
5. Check browser console for errors
6. Verify database operations work

---

## 📞 SUPPORT

For questions about specific issues, refer to:
- `PROJECT_HEALTH_REPORT.md` - Overview
- `DETAILED_ISSUES.md` - Code examples
- `CODEBASE_STRUCTURE.md` - File organization


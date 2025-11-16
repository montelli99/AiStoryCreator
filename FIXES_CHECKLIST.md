# Fixes Checklist - AI Creator Studio

**Total Fixes:** 7  
**Estimated Time:** 40 minutes  
**Difficulty:** Easy

---

## 🔴 CRITICAL FIXES (10 minutes)

### [ ] Fix #1: TikTok Client ID Typo
- **File:** `src/app/api/tiktok/auth/start/route.ts`
- **Lines:** 53, 64
- **Change:** `TIKOK_CLIENT_ID` → `TIKTOK_CLIENT_ID`
- **Change:** `TIKOK_CLIENT_SECRET` → `TIKTOK_CLIENT_SECRET`
- **Time:** 2 min
- **Severity:** 🔴 CRITICAL

### [ ] Fix #2: Template String Not Interpolating
- **File:** `src/lib/tiktok/client.ts`
- **Line:** 44
- **Change:** Single quotes `'...'` → Backticks `` `...` ``
- **Before:** `body: 'grant_type=refresh_token&refresh_token=${this.refreshToken}'`
- **After:** `body: \`grant_type=refresh_token&refresh_token=${this.refreshToken}\``
- **Time:** 2 min
- **Severity:** 🔴 CRITICAL

### [ ] Fix #3: NextRequest.query Doesn't Exist
- **File:** `src/app/api/tiktok/auth/start/route.ts`
- **Lines:** 19, 43
- **Change:** `req.query` → `req.nextUrl.searchParams.get()`
- **Before:** `const { code, state } = req.query`
- **After:** 
  ```typescript
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  ```
- **Time:** 3 min
- **Severity:** 🔴 CRITICAL

---

## 🟠 HIGH PRIORITY FIXES (20 minutes)

### [ ] Fix #4: Director Route WHERE Clause
- **File:** `src/app/api/director/plan/route.ts`
- **Line:** 235
- **Change:** Use `id` instead of `type` and `status`
- **Before:**
  ```typescript
  where: { type: 'director_plan', status: 'processing' }
  ```
- **After:**
  ```typescript
  where: { id: job.id }
  ```
- **Time:** 3 min
- **Severity:** 🟠 HIGH

### [ ] Fix #5: Create Missing Social API Endpoint
- **File:** Create `src/app/api/social/tiktok/route.ts`
- **Content:** Basic POST handler for TikTok sync
- **Time:** 15 min
- **Severity:** 🟠 HIGH

---

## 🟡 MEDIUM PRIORITY FIXES (10 minutes)

### [ ] Fix #6: Re-enable Scheduler
- **File:** `src/app/layout.tsx`
- **Lines:** 15-16
- **Change:** Uncomment `startScheduler()`
- **Before:**
  ```typescript
  useEffect(() => {
    // TODO: Fix scheduler initialization
    // startScheduler();
  }, [])
  ```
- **After:**
  ```typescript
  useEffect(() => {
    try {
      startScheduler()
    } catch (error) {
      console.error('Scheduler failed:', error)
    }
  }, [])
  ```
- **Time:** 5 min
- **Severity:** 🟡 MEDIUM

---

## 🟢 LOW PRIORITY FIXES (5 minutes)

### [ ] Fix #7: Remove Unused Imports
- **File:** `src/app/layout.tsx`
- **Line:** 5
- **Remove:** `import { authOptions } from '@/lib/auth';`
- **Time:** 2 min
- **Severity:** 🟢 LOW

- **File:** `src/app/dashboard/page.tsx`
- **Line:** 7
- **Review:** `useSocket` import usage
- **Time:** 3 min
- **Severity:** 🟢 LOW

---

## ✅ VERIFICATION STEPS

After applying all fixes:

- [ ] Run `npm run build` - should pass
- [ ] Start dev server: `npx next dev`
- [ ] Check console for errors
- [ ] Test login page: http://localhost:3000/login
- [ ] Test TikTok auth flow
- [ ] Test director plan generation
- [ ] Test scheduler execution
- [ ] Verify database operations

---

## 📋 SUMMARY

| Priority | Count | Time | Status |
|----------|-------|------|--------|
| 🔴 Critical | 3 | 10m | [ ] |
| 🟠 High | 2 | 20m | [ ] |
| 🟡 Medium | 1 | 10m | [ ] |
| 🟢 Low | 1 | 5m | [ ] |
| **TOTAL** | **7** | **45m** | [ ] |

---

## 🎯 Next Steps

1. ✅ Print this checklist
2. 🔧 Apply fixes in order
3. ✅ Check off each fix
4. 🧪 Run verification steps
5. 🚀 Deploy with confidence

**Estimated Total Time:** 45 minutes


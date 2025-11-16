# VIRAL ENGINE V3 — API ROUTES

Create folder: `src/app/api/viral/`

---

## ROUTE 1: Analyze Script

**File:** `src/app/api/viral/analyze/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ViralBrain } from '@/lib/viral-brain/engine';

export async function POST(req: NextRequest) {
  try {
    const { script, niche } = await req.json();

    if (!script || !niche) {
      return NextResponse.json(
        { error: 'Script and niche required' },
        { status: 400 }
      );
    }

    const analysis = await ViralBrain.analyzeScript({ script, niche });

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze script' },
      { status: 500 }
    );
  }
}
```

---

## ROUTE 2: Generate Hashtags

**File:** `src/app/api/viral/hashtags/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { HashtagEngine } from '@/lib/viral-brain/hashtags';

export async function POST(req: NextRequest) {
  try {
    const { niche, topic } = await req.json();

    const hashtags = await HashtagEngine.generate(niche, topic);

    return NextResponse.json({
      success: true,
      hashtags
    });
  } catch (error) {
    console.error('Hashtag error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hashtags' },
      { status: 500 }
    );
  }
}
```

---

## ROUTE 3: Generate Descriptions

**File:** `src/app/api/viral/descriptions/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DescriptionEngine } from '@/lib/viral-brain/descriptions';

export async function POST(req: NextRequest) {
  try {
    const { script, cta } = await req.json();

    const descriptions = DescriptionEngine.generate(script, cta);

    return NextResponse.json({
      success: true,
      descriptions
    });
  } catch (error) {
    console.error('Description error:', error);
    return NextResponse.json(
      { error: 'Failed to generate descriptions' },
      { status: 500 }
    );
  }
}
```

---

## ROUTE 4: Generate Variants

**File:** `src/app/api/viral/variants/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { VariantEngine } from '@/lib/viral-brain/variants';

export async function POST(req: NextRequest) {
  try {
    const { contentId } = await req.json();

    const variants = await VariantEngine.generateVariants(contentId);

    return NextResponse.json({
      success: true,
      variants
    });
  } catch (error) {
    console.error('Variant error:', error);
    return NextResponse.json(
      { error: 'Failed to generate variants' },
      { status: 500 }
    );
  }
}
```

---

## ROUTE 5: Create Split Test

**File:** `src/app/api/viral/split-test/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SplitTestEngine } from '@/lib/viral-brain/split-test';

export async function POST(req: NextRequest) {
  try {
    const { contentId, variantA, variantB } = await req.json();

    const test = await SplitTestEngine.createTest(contentId, variantA, variantB);

    return NextResponse.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Split test error:', error);
    return NextResponse.json(
      { error: 'Failed to create split test' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tests = await db.splitTest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ tests });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}
```

---

## ROUTE 6: Record Performance

**File:** `src/app/api/viral/performance/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SplitTestEngine } from '@/lib/viral-brain/split-test';

export async function POST(req: NextRequest) {
  try {
    const { testId, variant, score } = await req.json();

    const result = await SplitTestEngine.recordPerformance(
      testId,
      variant,
      score
    );

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record performance' },
      { status: 500 }
    );
  }
}
```

---

**CONTINUE TO:** `VIRAL_ENGINE_V3_UI_PAGES.md`


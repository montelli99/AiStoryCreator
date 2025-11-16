# VIRAL ENGINE V3 — LIBRARY FILES

Create folder: `src/lib/viral-brain/`

---

## FILE 1: engine.ts

```typescript
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '../db';

export class ViralBrain {
  static async analyzeScript({ script, niche }: { script: string; niche: string }) {
    const zai = await ZAI.create();

    const prompt = `You are a viral video analyst. Analyze this script for maximum engagement.

Niche: ${niche}
Script: ${script}

Return ONLY valid JSON:
{
  "bestHook": "opening line that stops scrolling",
  "bestAngles": ["angle 1", "angle 2", "angle 3"],
  "suggestedVariations": [
    {"variant": "hero", "notes": "full body shot"},
    {"variant": "crop", "notes": "face close-up"},
    {"variant": "fast", "notes": "quick cuts"},
    {"variant": "slow", "notes": "cinematic"}
  ],
  "topics": {
    "primary": "main topic",
    "secondary": "sub-topic"
  },
  "performanceEstimates": {
    "expectedWatchTime": "85%",
    "expectedCTR": "12%",
    "expectedEngagement": "8%"
  }
}`;

    const response = await zai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    });

    const text = response.choices[0]?.message?.content || '{}';
    return JSON.parse(text);
  }

  static async generateInsight(contentId: string, niche: string) {
    const insight = await db.viralInsight.create({
      data: {
        contentId,
        niche,
        primaryTopic: 'default',
        trendScore: Math.floor(Math.random() * 100)
      }
    });
    return insight;
  }
}
```

---

## FILE 2: hashtags.ts

```typescript
import { db } from '../db';

export class HashtagEngine {
  static async generate(niche: string, topic: string) {
    const hashtagMap: Record<string, string[]> = {
      stoicism: ['#stoic', '#stoicism', '#discipline', '#motivatedaily'],
      discipline: ['#discipline', '#selfcontrol', '#focus'],
      productivity: ['#productivity', '#hustle', '#grind'],
      fitness: ['#fitness', '#gym', '#gains'],
      mindfulness: ['#mindfulness', '#meditation', '#calm']
    };

    const primary = hashtagMap[niche] || ['#motivation'];
    const velocity = ['#fypシ', '#viralvideo', '#trending', '#foryoupage'];
    const nicheTags = [...primary, `#${topic.replace(/\s/g, '')}`];
    const lowComp = ['#dailywisdom', '#microprogress', '#calmmind'];

    return await db.hashtagGroup.create({
      data: { primary, velocity, nicheTags, lowComp }
    });
  }
}
```

---

## FILE 3: descriptions.ts

```typescript
export class DescriptionEngine {
  static generate(script: string, cta: string = 'Follow for more') {
    return {
      viral: `${script}\n\nSave this video.`,
      cta: `${script}\n\n${cta}`,
      longform: `${script}\n\nIf you want to master this, follow for daily wisdom.`
    };
  }
}
```

---

## FILE 4: variants.ts

```typescript
import { db } from '../db';

export class VariantEngine {
  static async generateVariants(contentId: string) {
    const variants = [
      'hero', 'crop', 'fast', 'slow', 'cinematic',
      'zoom', 'pan', 'reverse', 'character_swap'
    ];

    return await Promise.all(
      variants.map(v =>
        db.videoVariant.create({
          data: { contentId, variant: v }
        })
      )
    );
  }
}
```

---

## FILE 5: split-test.ts

```typescript
import { db } from '../db';

export class SplitTestEngine {
  static async createTest(contentId: string, variantA: string, variantB: string) {
    return await db.splitTest.create({
      data: { contentId, variantA, variantB }
    });
  }

  static async recordPerformance(testId: string, variant: 'A' | 'B', score: number) {
    const test = await db.splitTest.findUnique({ where: { id: testId } });
    if (!test) return null;

    const field = variant === 'A' ? 'performanceA' : 'performanceB';
    return await db.splitTest.update({
      where: { id: testId },
      data: { [field]: score }
    });
  }

  static async determineWinner(testId: string) {
    const test = await db.splitTest.findUnique({ where: { id: testId } });
    if (!test) return null;

    const winner = test.performanceA > test.performanceB ? 'A' : 'B';
    return await db.splitTest.update({
      where: { id: testId },
      data: { winner, completedAt: new Date() }
    });
  }
}
```

---

**CONTINUE TO:** `VIRAL_ENGINE_V3_API_ROUTES.md`


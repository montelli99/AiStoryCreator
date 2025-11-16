import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
import type { Character, Content, Analytics, Trend, DirectorControl } from '@prisma/client';

interface GenerationPlan {
  character_id: string;
  content_type: 'image' | 'video';
  aesthetic: 'cinematic' | 'influencer';
  prompt: string;
  priority: number;
  reasoning: string;
  trend_keywords: string[];
  optimal_posting_time: Date;
  estimated_performance: number;
}

interface CharacterPerformance {
  character: Character;
  performance_score: number;
  content_count: number;
  avg_engagement: number;
  best_aesthetic: string;
  trend_alignment: number;
}

interface TrendAnalysis {
  trend: Trend;
  relevance_score: number;
  character_match: string[];
  suggested_prompts: string[];
}

class AIDirector {
  private zai: ZAI;
  private lastAnalysis: Date | null = null;
  private analysisInterval = 2 * 60 * 60 * 1000; // 2 hours

  constructor() {
    this.zai = new ZAI();
  }

  // Main AI Director decision engine
  async generateOptimalPlan(): Promise<GenerationPlan[]> {
    try {
      console.log('🤖 AI Director: Starting analysis...');
      
      // Get current data
      const characters = await this.getTopPerformingCharacters();
      const trends = await this.getRelevantTrends();
      const analytics = await this.getRecentAnalytics();
      
      // Analyze performance patterns
      const performanceAnalysis = await this.analyzePerformancePatterns(characters, analytics);
      
      // Generate trend-based content plans
      const plans = await this.generateTrendBasedPlans(performanceAnalysis, trends);
      
      // Optimize posting schedule
      const optimizedPlans = await this.optimizePostingSchedule(plans);
      
      // Save analysis results
      await this.saveDirectorControl({
        characterRankings: performanceAnalysis.map(p => ({
          character_id: p.character.id,
          score: p.performance_score,
          reasoning: p.trend_alignment > 0.7 ? 'High trend alignment' : 'Steady performer'
        })),
        nextPlan: optimizedPlans,
        lastAnalysis: new Date()
      });

      console.log(`🤖 AI Director: Generated ${optimizedPlans.length} optimized plans`);
      return optimizedPlans;
      
    } catch (error) {
      console.error('🤖 AI Director Error:', error);
      return this.getFallbackPlan();
    }
  }

  // Get top performing characters
  private async getTopPerformingCharacters(): Promise<Character[]> {
    const characters = await db.character.findMany({
      where: { isActive: true },
      orderBy: { performanceScore: 'desc' },
      take: 6 // Focus on top 6 performers
    });

    return characters;
  }

  // Get relevant trends
  private async getRelevantTrends(): Promise<Trend[]> {
    const trends = await db.trend.findMany({
      where: { 
        isActive: true,
        expiresAt: { gte: new Date() }
      },
      orderBy: { popularity: 'desc' },
      take: 10
    });

    return trends;
  }

  // Get recent analytics
  private async getRecentAnalytics(): Promise<Analytics[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const analytics = await db.analytics.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      include: {
        content: {
          include: {
            character: true
          }
        }
      }
    });

    return analytics;
  }

  // Analyze performance patterns using GLM-4.6
  private async analyzePerformancePatterns(
    characters: Character[], 
    analytics: Analytics[]
  ): Promise<CharacterPerformance[]> {
    const performance: CharacterPerformance[] = [];

    for (const character of characters) {
      const characterAnalytics = analytics.filter(
        a => a.content.characterId === character.id
      );

      if (characterAnalytics.length === 0) {
        performance.push({
          character,
          performance_score: character.performanceScore,
          content_count: 0,
          avg_engagement: 0,
          best_aesthetic: 'cinematic',
          trend_alignment: 0.5
        });
        continue;
      }

      const avgEngagement = characterAnalytics.reduce(
        (sum, a) => sum + a.engagementRate, 0
      ) / characterAnalytics.length;

      const aestheticPerformance = this.calculateAestheticPerformance(characterAnalytics);
      
      // Use GLM-4.6 to analyze trend alignment
      const trendAlignment = await this.analyzeTrendAlignment(character, characterAnalytics);

      performance.push({
        character,
        performance_score: character.performanceScore,
        content_count: characterAnalytics.length,
        avg_engagement: avgEngagement,
        best_aesthetic: aestheticPerformance.best,
        trend_alignment: trendAlignment
      });
    }

    return performance.sort((a, b) => b.performance_score - a.performance_score);
  }

  // Calculate aesthetic performance
  private calculateAestheticPerformance(analytics: Analytics[]): { best: string; scores: Record<string, number> } {
    const cinematicScores: number[] = [];
    const influencerScores: number[] = [];

    analytics.forEach(a => {
      if (a.content.aesthetic === 'cinematic') {
        cinematicScores.push(a.engagementRate);
      } else if (a.content.aesthetic === 'influencer') {
        influencerScores.push(a.engagementRate);
      }
    });

    const cinematicAvg = cinematicScores.length > 0 
      ? cinematicScores.reduce((a, b) => a + b, 0) / cinematicScores.length 
      : 0;
    
    const influencerAvg = influencerScores.length > 0 
      ? influencerScores.reduce((a, b) => a + b, 0) / influencerScores.length 
      : 0;

    return {
      best: cinematicAvg > influencerAvg ? 'cinematic' : 'influencer',
      scores: { cinematic: cinematicAvg, influencer: influencerAvg }
    };
  }

  // Analyze trend alignment using GLM-4.6
  private async analyzeTrendAlignment(character: Character, analytics: Analytics[]): Promise<number> {
    try {
      const recentContent = analytics.slice(-5); // Last 5 pieces of content
      
      const prompt = `
        Analyze this character's recent performance and calculate trend alignment (0-1):
        
        Character: ${character.code} (${character.ethnicity}, Age ${character.baseAge}, ${character.aestheticType})
        Recent Performance: ${recentContent.map(a => `${a.engagementRate}% engagement`).join(', ')}
        
        Consider:
        - Engagement trends
        - Content type performance
        - Aesthetic effectiveness
        - Virality potential
        
        Return only a number between 0 and 1 representing trend alignment.
      `;

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an AI performance analyst specializing in social media content optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.3
      });

      const response = completion.choices[0]?.message?.content?.trim();
      const alignment = parseFloat(response) || 0.5;
      
      return Math.max(0, Math.min(1, alignment));
      
    } catch (error) {
      console.error('Trend alignment analysis failed:', error);
      return 0.5; // Default to neutral
    }
  }

  // Generate trend-based content plans
  private async generateTrendBasedPlans(
    performance: CharacterPerformance[], 
    trends: Trend[]
  ): Promise<GenerationPlan[]> {
    const plans: GenerationPlan[] = [];

    // Generate plans for top 3 performers
    for (let i = 0; i < Math.min(3, performance.length); i++) {
      const charPerf = performance[i];
      
      // Find best matching trends
      const matchingTrends = await this.findMatchingTrends(charPerf.character, trends);
      
      // Generate 2-3 plans per character
      const planCount = Math.min(3, matchingTrends.length);
      for (let j = 0; j < planCount; j++) {
        const trend = matchingTrends[j];
        const plan = await this.createContentPlan(charPerf, trend);
        plans.push(plan);
      }
    }

    return plans.sort((a, b) => b.priority - a.priority);
  }

  // Find trends that match character
  private async findMatchingTrends(character: Character, trends: Trend[]): Promise<TrendAnalysis[]> {
    const analyses: TrendAnalysis[] = [];

    for (const trend of trends) {
      const relevance = await this.calculateTrendRelevance(character, trend);
      
      if (relevance > 0.3) { // Only consider relevant trends
        analyses.push({
          trend,
          relevance_score: relevance,
          character_match: [character.id],
          suggested_prompts: await this.generateTrendPrompts(character, trend)
        });
      }
    }

    return analyses.sort((a, b) => b.relevance_score - a.relevance_score);
  }

  // Calculate trend relevance for character
  private async calculateTrendRelevance(character: Character, trend: Trend): Promise<number> {
    try {
      const prompt = `
        Calculate trend relevance (0-1) for this character and trend:
        
        Character: ${character.code} (${character.ethnicity}, Age ${character.baseAge}, ${character.aestheticType})
        Trend: ${trend.title} - ${trend.description}
        Trend Type: ${trend.type}
        Popularity: ${trend.popularity}
        
        Consider:
        - Demographic alignment
        - Aesthetic compatibility
        - Content type suitability
        - Cultural relevance
        
        Return only a number between 0 and 1.
      `;

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an AI trend analyst specializing in content-creator matching.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.3
      });

      const response = completion.choices[0]?.message?.content?.trim();
      const relevance = parseFloat(response) || 0;
      
      return Math.max(0, Math.min(1, relevance));
      
    } catch (error) {
      console.error('Trend relevance calculation failed:', error);
      return 0.3; // Default to low relevance
    }
  }

  // Generate trend-based prompts
  private async generateTrendPrompts(character: Character, trend: Trend): Promise<string[]> {
    try {
      const prompt = `
        Generate 3 specific content prompts for this character based on the trend:
        
        Character: ${character.code} (${character.ethnicity}, Age ${character.baseAge}, ${character.aestheticType})
        Trend: ${trend.title} - ${trend.description}
        
        Generate prompts that:
        - Match the character's aesthetic (${character.aestheticType})
        - Incorporate the trend naturally
        - Are optimized for TikTok/Instagram
        - Drive high engagement
        
        Return as a JSON array of strings.
      `;

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a creative content strategist specializing in viral social media content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      try {
        return JSON.parse(response || '[]');
      } catch {
        // Fallback if JSON parsing fails
        return response?.split('\n').filter(Boolean).slice(0, 3) || [];
      }
      
    } catch (error) {
      console.error('Prompt generation failed:', error);
      return [`Create content featuring ${character.code} with ${trend.title} aesthetic`];
    }
  }

  // Create individual content plan
  private async createContentPlan(
    charPerf: CharacterPerformance, 
    trendAnalysis: TrendAnalysis
  ): Promise<GenerationPlan> {
    const prompt = trendAnalysis.suggested_prompts[0] || `Create ${trendAnalysis.trend.title} content`;
    
    return {
      character_id: charPerf.character.id,
      content_type: Math.random() > 0.3 ? 'video' : 'image', // 70% video, 30% image
      aesthetic: charPerf.best_aesthetic,
      prompt,
      priority: Math.round(trendAnalysis.relevance_score * 100),
      reasoning: `High relevance (${Math.round(trendAnalysis.relevance_score * 100)}%) to ${trendAnalysis.trend.title} trend`,
      trend_keywords: [trendAnalysis.trend.title, trendAnalysis.trend.type],
      optimal_posting_time: this.calculateOptimalPostingTime(charPerf.character),
      estimated_performance: Math.round(charPerf.performance_score * trendAnalysis.relevance_score)
    };
  }

  // Calculate optimal posting time
  private calculateOptimalPostingTime(character: Character): Date {
    const now = new Date();
    const optimalHour = this.getOptimalHourForCharacter(character);
    
    const postingTime = new Date(now);
    postingTime.setHours(optimalHour, 0, 0, 0);
    
    // If optimal time has passed today, schedule for tomorrow
    if (postingTime <= now) {
      postingTime.setDate(postingTime.getDate() + 1);
    }
    
    return postingTime;
  }

  // Get optimal posting hour for character
  private getOptimalHourForCharacter(character: Character): number {
    // Different demographics have different optimal posting times
    const baseHour = character.ethnicity === 'korean' ? 20 : 19; // Korean audience: 8 PM, others: 7 PM
    
    // Adjust based on age
    if (character.baseAge === 18) {
      return baseHour + 1; // Younger audience active later
    } else if (character.baseAge === 35) {
      return baseHour - 1; // Older audience active earlier
    }
    
    return baseHour;
  }

  // Optimize posting schedule
  private async optimizePostingSchedule(plans: GenerationPlan[]): Promise<GenerationPlan[]> {
    // Sort by priority and posting time
    const sorted = plans.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.optimal_posting_time.getTime() - b.optimal_posting_time.getTime();
    });

    // Spread out posts to avoid competition
    const optimized: GenerationPlan[] = [];
    const usedTimes = new Set<number>();

    for (const plan of sorted) {
      let postingTime = new Date(plan.optimal_posting_time);
      const hour = postingTime.getHours();
      
      // If this hour is already used, shift by 2 hours
      if (usedTimes.has(hour)) {
        postingTime.setHours(hour + 2);
      }
      
      usedTimes.add(postingTime.getHours());
      plan.optimal_posting_time = postingTime;
      optimized.push(plan);
    }

    return optimized;
  }

  // Save director control state
  private async saveDirectorControl(data: Partial<DirectorControl>): Promise<void> {
    await db.directorControl.upsert({
      where: { id: 'director-main' },
      update: data,
      create: {
        id: 'director-main',
        ...data
      }
    });
  }

  // Fallback plan if AI analysis fails
  private getFallbackPlan(): GenerationPlan[] {
    return [
      {
        character_id: 'ID_01_A',
        content_type: 'video',
        aesthetic: 'cinematic',
        prompt: 'Create cinematic luxury lifestyle content',
        priority: 80,
        reasoning: 'Fallback plan - top performer',
        trend_keywords: ['luxury', 'lifestyle'],
        optimal_posting_time: this.calculateOptimalPostingTime({ id: 'ID_01_A' } as Character),
        estimated_performance: 75
      }
    ];
  }

  // Check if analysis should run
  shouldRunAnalysis(): boolean {
    if (!this.lastAnalysis) {
      return true;
    }
    
    return Date.now() - this.lastAnalysis.getTime() > this.analysisInterval;
  }

  // Update last analysis time
  updateLastAnalysis(): void {
    this.lastAnalysis = new Date();
  }
}

export { AIDirector, type GenerationPlan, type CharacterPerformance, type TrendAnalysis };
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Define the 18 characters as specified in the handoff
const CHARACTERS = [
  // Korean characters
  { code: 'ID_01_A', ethnicity: 'korean', baseAge: 18, variant: 'A', aestheticType: 'cinematic' },
  { code: 'ID_01_B', ethnicity: 'korean', baseAge: 18, variant: 'B', aestheticType: 'influencer' },
  { code: 'ID_01_C', ethnicity: 'korean', baseAge: 18, variant: 'C', aestheticType: 'cinematic' },
  
  { code: 'ID_02_A', ethnicity: 'korean', baseAge: 25, variant: 'A', aestheticType: 'influencer' },
  { code: 'ID_02_B', ethnicity: 'korean', baseAge: 25, variant: 'B', aestheticType: 'cinematic' },
  { code: 'ID_02_C', ethnicity: 'korean', baseAge: 25, variant: 'C', aestheticType: 'influencer' },
  
  { code: 'ID_03_A', ethnicity: 'korean', baseAge: 35, variant: 'A', aestheticType: 'cinematic' },
  { code: 'ID_03_B', ethnicity: 'korean', baseAge: 35, variant: 'B', aestheticType: 'influencer' },
  { code: 'ID_03_C', ethnicity: 'korean', baseAge: 35, variant: 'C', aestheticType: 'cinematic' },
  
  // Japanese characters
  { code: 'ID_04_A', ethnicity: 'japanese', baseAge: 18, variant: 'A', aestheticType: 'cinematic' },
  { code: 'ID_04_B', ethnicity: 'japanese', baseAge: 18, variant: 'B', aestheticType: 'influencer' },
  { code: 'ID_04_C', ethnicity: 'japanese', baseAge: 18, variant: 'C', aestheticType: 'cinematic' },
  
  { code: 'ID_05_A', ethnicity: 'japanese', baseAge: 25, variant: 'A', aestheticType: 'influencer' },
  { code: 'ID_05_B', ethnicity: 'japanese', baseAge: 25, variant: 'B', aestheticType: 'cinematic' },
  { code: 'ID_05_C', ethnicity: 'japanese', baseAge: 25, variant: 'C', aestheticType: 'influencer' },
  
  // Chinese characters
  { code: 'ID_06_A', ethnicity: 'chinese', baseAge: 18, variant: 'A', aestheticType: 'cinematic' },
  { code: 'ID_06_B', ethnicity: 'chinese', baseAge: 18, variant: 'B', aestheticType: 'influencer' },
  { code: 'ID_06_C', ethnicity: 'chinese', baseAge: 18, variant: 'C', aestheticType: 'cinematic' }
];

export async function POST() {
  try {
    // Check if characters already exist
    const existingCount = await db.character.count();
    
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: 'Characters already initialized',
        count: existingCount 
      });
    }

    // Create all characters
    const createdCharacters = await Promise.all(
      CHARACTERS.map(async (character) => {
        return await db.character.create({
          data: {
            code: character.code,
            ethnicity: character.ethnicity,
            baseAge: character.baseAge,
            variant: character.variant,
            aestheticType: character.aestheticType,
            embedding: {
              description: `${character.ethnicity} male, age ${character.baseAge}, variant ${character.variant}, ${character.aestheticType} aesthetic`,
              traits: {
                age_group: character.baseAge < 21 ? 'young_adult' : character.baseAge < 30 ? 'adult' : 'mature',
                style: character.aestheticType,
                ethnicity: character.ethnicity,
                variant: character.variant
              }
            }
          }
        });
      })
    );

    return NextResponse.json({ 
      message: 'Characters initialized successfully',
      count: createdCharacters.length,
      characters: createdCharacters
    });

  } catch (error) {
    console.error('Error initializing characters:', error);
    return NextResponse.json(
      { error: 'Failed to initialize characters' },
      { status: 500 }
    );
  }
}
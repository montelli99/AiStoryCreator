/**
 * ElevenLabs API Client Wrapper
 * Handles text-to-speech for voiceover generation
 */

export class ElevenLabsClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs API Error: ${response.status} - ${error}`);
    }

    return response;
  }

  /**
   * Get available voices
   */
  async getVoices() {
    return this.makeRequest('/voices');
  }

  /**
   * Generate text-to-speech audio
   */
  async generateSpeech(params: {
    text: string;
    voiceId?: string;
    modelId?: string;
    voiceSettings?: {
      stability?: number;
      similarity_boost?: number;
      style?: number;
      use_speaker_boost?: boolean;
    };
    outputFormat?: 'mp3' | 'pcm';
  }) {
    const endpoint = `/text-to-speech/${params.voiceId || '21m00Tcm4T08D3Piu1'}`;
    
    const requestBody = {
      text: params.text,
      model_id: params.modelId || 'eleven_multilingual_v2',
      voice_settings: {
        stability: params.voiceSettings?.stability || 0.5,
        similarity_boost: params.voiceSettings?.similarity_boost || 0.5,
        style: params.voiceSettings?.style || 0.0,
        use_speaker_boost: params.voiceSettings?.use_speaker_boost || true,
        ...params.voiceSettings,
      },
    };

    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    // Return the audio blob
    return response.blob();
  }

  /**
   * Generate speech with predefined voice profiles for different character types
   */
  async generateCharacterSpeech(params: {
    text: string;
    characterType: 'korean' | 'japanese' | 'chinese';
    age: 'young' | 'adult' | 'mature';
    aesthetic: 'cinematic' | 'influencer';
  }) {
    // Select appropriate voice based on character profile
    const voiceMap = {
      korean: {
        young: '21m00Tcm4T08D3Piu1', // Young male
        adult: '29vD33k1N0K3dG6VkU', // Adult male
        mature: '2EiwWnXGFv4JZG0I7pO' // Mature male
      },
      japanese: {
        young: '21m00Tcm4T08D3Piu1',
        adult: '29vD33k1N0K3dG6VkU',
        mature: '2EiwWnXGFv4JZG0I7pO'
      },
      chinese: {
        young: '21m00Tcm4T08D3Piu1',
        adult: '29vD33k1N0K3dG6VkU',
        mature: '2EiwWnXGFv4JZG0I7pO'
      }
    };

    const voiceId = voiceMap[params.characterType]?.[params.age] || '21m00Tcm4T08D3Piu1';
    
    // Adjust voice settings based on aesthetic
    const voiceSettings = {
      stability: params.aesthetic === 'cinematic' ? 0.7 : 0.3,
      similarity_boost: params.aesthetic === 'cinematic' ? 0.8 : 0.6,
      style: params.aesthetic === 'influencer' ? 0.3 : 0.1,
      use_speaker_boost: true,
    };

    return this.generateSpeech({
      text: params.text,
      voiceId,
      voiceSettings,
    });
  }

  /**
   * Get usage information
   */
  async getUsage() {
    return this.makeRequest('/usage');
  }

  /**
   * Get user information
   */
  async getUserInfo() {
    return this.makeRequest('/user');
  }
}

// Singleton instance for the application
let elevenLabsClient: ElevenLabsClient | null = null;

export function getElevenLabsClient(): ElevenLabsClient {
  if (!elevenLabsClient) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY environment variable is not set');
    }
    elevenLabsClient = new ElevenLabsClient(apiKey);
  }
  return elevenLabsClient;
}
import { db } from "@/lib/db"

// TikTok API client
export class TikTokClient {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.accessToken = null
    this.refreshToken = null
  }

  // Set access token from OAuth callback
  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  getAccessToken() {
    return this.accessToken
  }

  getRefreshToken() {
    return this.refreshToken
  }

  hasValidTokens() {
    return !!(this.accessToken && this.refreshToken)
  }

  // Refresh access token
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch('https://open-api.tiktok.com/v2/oauth/refresh_token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: `grant_type=refresh_token&refresh_token=${this.refreshToken}`
      })

      const data = await response.json()

      if (data.access_token) {
        this.accessToken = data.access_token
        this.refreshToken = data.refresh_token
        return true
      }
    } catch (error) {
      console.error('Failed to refresh access token:', error)
      return false
    }
  }

  // Upload video to TikTok
  async uploadVideo(videoBuffer: Buffer, title: string): Promise<string> {
    if (!this.hasValidTokens()) {
      throw new Error('No valid TikTok tokens available')
    }

    const initUploadResponse = await fetch('https://open-api.tiktok.com/v2/video/upload/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/octet-stream'
      },
      body: videoBuffer
    })

    const initUploadData = await initUploadResponse.json()

    if (initUploadData.data?.upload_url) {
      // Upload video data to the provided URL
      const uploadResponse = await fetch(initUploadData.data.upload_url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream'
        },
        body: videoBuffer
      })

      const uploadData = await uploadResponse.json()

      if (uploadData.data.video_id) {
        return uploadData.data.video_id
      }
    }

    throw new Error('Video upload failed')
  }

  // Create video post with caption
  async createVideoPost(videoId: string, title: string, description: string): Promise<string> {
    if (!this.hasValidTokens()) {
      throw new Error('No valid TikTok tokens available')
    }

    const postData = {
      access_token: this.accessToken,
      video_id: videoId,
      title: title,
      description: description
    }

    const response = await fetch('https://open-api.tiktok.com/v2/video/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })

    const data = await response.json()

    if (data.data?.video_id) {
      return data.data.video_id
    }

    throw new Error('Video post failed')
  }

  // Get video analytics
  async getVideoAnalytics(videoId: string): Promise<any> {
    if (!this.hasValidTokens()) {
      throw new Error('No valid TikTok tokens available')
    }

    const response = await fetch(`https://open-api.tiktok.com/v2/video/insights/?video_id=${videoId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    })

    return response.json()
  }

  // Update schedule status in database
  async updateScheduleStatus(videoId: string, status: string): Promise<void> {
    try {
      await db.schedule.update({
        where: { id: videoId },
        data: { status }
      })

      console.log("Schedule update:", {
        id: videoId,
        status
      })
    } catch (error) {
      console.error("Failed to update schedule status:", error)
    }
  }
}
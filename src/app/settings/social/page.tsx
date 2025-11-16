"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SocialSettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [tiktokStatus, setTikTokStatus] = useState("disconnected")
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [accounts, setAccounts] = useState([])

  // Load TikTok accounts from database
  useEffect(() => {
    // In a real implementation, you would fetch from API
    // For now, use mock data
    setAccounts([
      {
        id: "demo_account",
        email: "demo@tiktok.com",
        username: "Demo User",
        followers: 12500,
        verified: true,
        connected: true,
        accessToken: "mock_access_token",
        expiresAt: new Date().getTime() + 864000000
      },
      {
        id: "test_account",
        email: "test@tiktok.com",
        username: "Test User",
        followers: 500,
        verified: false,
        connected: false,
        accessToken: null,
        expiresAt: null
      }
    ])
    setTikTokStatus("connected")
  }, [])

  const handleConnectAccount = async (accountId: string) => {
    setTikTokStatus("connecting")
    
    // In a real implementation, you would redirect to TikTok OAuth
    console.log(`Connecting to TikTok account: ${accountId}`)
    
    // Mock OAuth flow
    setTimeout(() => {
      setTikTokStatus("connected")
    }, 2000)
  }

  const handleDisconnectAccount = async (accountId: string) => {
    setTikTokStatus("disconnected")
    console.log(`Disconnected from TikTok account: ${accountId}`)

    // Mock disconnection
    setTimeout(() => {
      setTikTokStatus("disconnected")
    }, 1000)
  }

  const handleDeleteAccount = async (accountId: string) => {
    // In a real implementation, you would delete from database
    console.log(`Deleting TikTok account: ${accountId}`)
    setAccounts(prev => prev.filter(acc => acc.id !== accountId))
  }

  const handleOpenAccountModal = () => {
    setShowAccountModal(true)
  }

  const handleCloseAccountModal = () => {
    setShowAccountModal(false)
  }

  const handleAddAccount = async (formData: FormData) => {
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // In a real implementation, you would create the account via TikTok API
    console.log(`Creating TikTok account: ${email}`)
    
    // Mock account creation
    const newAccount = {
      id: `account_${Date.now()}`,
      email,
      username,
      verified: false,
      followers: 0,
      connected: false,
      accessToken: "mock_access_token",
      expiresAt: new Date().getTime() + 864000000
    }

    setAccounts(prev => [...prev, newAccount])
    setShowAccountModal(false)
  }

  return (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>TikTok Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Badge variant={tiktokStatus === "connected" ? "default" : "secondary"}>
              {tiktokStatus === "connected" ? "Connected" : "Disconnected"}
            </Badge>
            <Button onClick={handleOpenAccountModal}>
              Add Account
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Card key={account.id} className="p-4 border rounded-lg hover:bg-muted cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-sm">{account.username}</CardTitle>
                  <div className="flex justify-between items-center">
                    <Badge variant={account.verified ? "default" : "secondary"}>
                      {account.verified ? "Verified" : "Unverified"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnectAccount(account.id)}
                    >
                      {tikTokStatus === "connecting" ? "Connecting..." : "Connect"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectAccount(account.id)}
                    >
                      {tiktokStatus === "disconnecting" ? "Disconnecting..." : "Disconnect"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>Followers: {account.followers.toLocaleString()}</p>
                    <p>Verified: {account.verified ? "Yes" : "No"}</p>
                    <p>Connected: {account.connected ? "Yes" : "No"}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

// Simple Account Modal Component
function AccountModal({ open, onClose, onAddAccount }: any) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add TikTok Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Username" />
          <Input placeholder="Password" type="password" />
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1">
              Add Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
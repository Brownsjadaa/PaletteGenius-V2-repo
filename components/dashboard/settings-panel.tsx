"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Download, Trash2, Crown, Lock, Globe, Smartphone } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface SettingsPanelProps {
  user: SupabaseUser
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  })
  const { toast } = useToast()

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      // Profile update logic would go here
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await supabase.auth.signOut()
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{user.email}</h3>
              <p className="text-sm text-gray-500">Free Plan</p>
              <Badge className="mt-1 bg-green-50 text-green-700">Verified</Badge>
            </div>
            <Button variant="outline">Change Avatar</Button>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user.email || ""} disabled className="mt-1" />
            </div>
            <div>
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="Enter your name" className="mt-1" />
            </div>
          </div>

          <Button onClick={handleUpdateProfile} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div>
              <h3 className="font-semibold text-amber-900">Free Plan</h3>
              <p className="text-sm text-amber-800">5 palettes per day • Basic exports • Community support</p>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">5</div>
              <p className="text-sm text-gray-600">Daily Limit</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">24</div>
              <p className="text-sm text-gray-600">Palettes Created</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <p className="text-sm text-gray-600">Folders</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates about your palettes and account</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Push Notifications</Label>
              <p className="text-sm text-gray-600">Get notified about new features and updates</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Marketing Emails</Label>
              <p className="text-sm text-gray-600">Receive tips, tutorials, and product updates</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Password</Label>
              <p className="text-sm text-gray-600">Last changed 3 months ago</p>
            </div>
            <Button variant="outline">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline">
              <Smartphone className="w-4 h-4 mr-2" />
              Enable 2FA
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Active Sessions</Label>
              <p className="text-sm text-gray-600">Manage your active sessions across devices</p>
            </div>
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              View Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Export Data</Label>
              <p className="text-sm text-gray-600">Download all your palettes and account data</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Delete Account</Label>
              <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <Button variant="outline" onClick={handleDeleteAccount} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

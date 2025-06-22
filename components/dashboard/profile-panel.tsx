"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Crown, Upload, Save, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"
import { DatabaseService, type UserProfile } from "@/lib/database-service"
import { SupabaseStorage } from "@/lib/supabase-storage"

interface ProfilePanelProps {
  user: SupabaseUser
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile>({
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || "",
    avatar_url: user.user_metadata?.avatar_url || "",
    website: user.user_metadata?.website || "",
    bio: user.user_metadata?.bio || "",
    created_at: "",
    updated_at: "",
  })
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    marketing_emails: false,
    public_profile: false,
    show_email: false,
  })
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUserProfile()
  }, [user])

  const fetchUserProfile = async () => {
    setLoading(true)
    try {
      const profile = await DatabaseService.getUserProfile(user.id)
      if (profile) {
        setProfileData(profile)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const getUserInitials = () => {
    const name = profileData.full_name || profileData.email
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      const success = await DatabaseService.updateUserProfile(user.id, {
        full_name: profileData.full_name,
        bio: profileData.bio,
        website: profileData.website,
        location: profileData.location,
      })

      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.new_password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      })

      if (error) throw error

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    setLoading(true)
    try {
      const avatarUrl = await SupabaseStorage.uploadAvatar(user.id, file)

      if (avatarUrl) {
        await DatabaseService.updateUserProfile(user.id, { avatar_url: avatarUrl })
        setProfileData({ ...profileData, avatar_url: avatarUrl })
        toast({
          title: "Avatar updated",
          description: "Your avatar has been updated successfully.",
        })
      } else {
        throw new Error("Failed to upload avatar")
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
  }

  const accountStats = {
    palettes_created: 24,
    folders_created: 6,
    downloads: 89,
    member_since: new Date(user.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile & Account</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={profileData.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-xl font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </Label>
              <Input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <h3 className="font-semibold text-gray-900">{profileData.full_name || "No name set"}</h3>
              <p className="text-sm text-gray-600">{profileData.email}</p>
              <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Pro Member
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Palettes Created</span>
                <span className="font-medium">{accountStats.palettes_created}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Folders</span>
                <span className="font-medium">{accountStats.folders_created}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Downloads</span>
                <span className="font-medium">{accountStats.downloads}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-medium text-sm">{accountStats.member_since}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={profileData.email} disabled className="mt-2 bg-gray-50" />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  className="mt-2"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="City, Country"
                    className="mt-2"
                  />
                </div>
              </div>
              <Button onClick={handleProfileUpdate} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications about your account activity</p>
                  </div>
                  <Switch
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, email_notifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
                  </div>
                  <Switch
                    checked={preferences.marketing_emails}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, marketing_emails: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                  </div>
                  <Switch
                    checked={preferences.public_profile}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, public_profile: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Email</p>
                    <p className="text-sm text-gray-600">Display your email on your public profile</p>
                  </div>
                  <Switch
                    checked={preferences.show_email}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, show_email: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="current_password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="new_password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirm_password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={handlePasswordUpdate}
                disabled={loading || !passwordData.new_password || !passwordData.confirm_password}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

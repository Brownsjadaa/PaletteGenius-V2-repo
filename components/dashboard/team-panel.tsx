"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Mail, MoreHorizontal, Crown, Shield, User, Search, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface TeamPanelProps {
  user: SupabaseUser
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member"
  avatar?: string
  joinedAt: string
  lastActive: string
  status: "active" | "pending" | "inactive"
}

export function TeamPanel({ user }: TeamPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  // Mock team data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "You",
      email: user.email || "",
      role: "owner",
      joinedAt: "2024-01-01",
      lastActive: "Just now",
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "admin",
      joinedAt: "2024-01-15",
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      role: "member",
      joinedAt: "2024-02-01",
      lastActive: "1 day ago",
      status: "active",
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "member",
      joinedAt: "2024-02-10",
      lastActive: "Never",
      status: "pending",
    },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-600" />
      case "admin":
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: "bg-yellow-50 text-yellow-700 border-yellow-200",
      admin: "bg-blue-50 text-blue-700 border-blue-200",
      member: "bg-gray-50 text-gray-700 border-gray-200",
    }
    return colors[role as keyof typeof colors] || colors.member
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "inactive":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleInvite = () => {
    // Handle team member invitation
    console.log("Inviting:", inviteEmail, "as", inviteRole)
    setInviteEmail("")
    setInviteRole("member")
    setIsInviteModalOpen(false)
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-600">Manage your team members and their permissions</p>
        </div>
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsInviteModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleInvite} className="flex-1 bg-teal-600 hover:bg-teal-700">
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600">Owner</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500">Last active: {member.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getRoleBadge(member.role)} border`}>{member.role}</Badge>
                  <Badge className={`${getStatusBadge(member.status)} border`}>{member.status}</Badge>
                  {member.role !== "owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

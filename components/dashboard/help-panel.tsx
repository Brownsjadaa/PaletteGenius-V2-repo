"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Search, MessageCircle, Book, Video, Mail, ExternalLink, ChevronRight, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@supabase/supabase-js"

interface HelpPanelProps {
  user: User
}

export function HelpPanel({ user }: HelpPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const [supportCategory, setSupportCategory] = useState("")

  const faqItems = [
    {
      question: "How do I create a color palette from an image?",
      answer:
        "Upload an image using the 'Upload Image' button in the generator, and our AI will automatically extract the dominant colors to create a beautiful palette.",
    },
    {
      question: "Can I export my palettes in different formats?",
      answer: "Yes! You can export your palettes as CSS, SCSS, JSON, Adobe Swatch Exchange (.ase), and PNG formats.",
    },
    {
      question: "How do I organize my palettes into folders?",
      answer:
        "Go to your dashboard, click 'Create Folder', name your folder, then drag and drop palettes into it or use the 'Move to Folder' option.",
    },
    {
      question: "What's the difference between Free and Pro plans?",
      answer:
        "Pro plans include unlimited palettes, advanced export options, team collaboration, priority support, and access to premium color tools.",
    },
    {
      question: "How do I invite team members?",
      answer:
        "In the Team section of your dashboard, click 'Invite Member', enter their email address, select their role, and send the invitation.",
    },
    {
      question: "Can I use the generated palettes commercially?",
      answer:
        "Yes! All palettes created with PaletteGenius can be used for both personal and commercial projects without restrictions.",
    },
  ]

  const helpResources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of creating and managing color palettes",
      icon: Book,
      type: "guide",
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step tutorials for advanced features",
      icon: Video,
      type: "video",
      link: "#",
    },
    {
      title: "API Documentation",
      description: "Integrate PaletteGenius with your applications",
      icon: Book,
      type: "docs",
      link: "#",
    },
    {
      title: "Community Forum",
      description: "Connect with other users and share tips",
      icon: MessageCircle,
      type: "community",
      link: "#",
    },
  ]

  const recentTickets = [
    {
      id: "T-001",
      subject: "Export issue with large palettes",
      status: "resolved",
      createdAt: "2 days ago",
      priority: "medium",
    },
    {
      id: "T-002",
      subject: "Team invitation not working",
      status: "in-progress",
      createdAt: "1 week ago",
      priority: "high",
    },
  ]

  const filteredFAQ = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSupportSubmit = () => {
    // Handle support ticket submission
    console.log("Support ticket:", { category: supportCategory, message: supportMessage })
    setSupportMessage("")
    setSupportCategory("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
        <p className="text-gray-600">Find answers to common questions or get in touch with our support team</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpResources.map((resource, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <resource.icon className="w-5 h-5 text-teal-600" />
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
              <p className="text-sm text-gray-600">{resource.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                Frequently Asked Questions
              </CardTitle>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFAQ.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFAQ.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No FAQ items found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Support & Contact */}
        <div className="space-y-6">
          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={supportCategory} onValueChange={setSupportCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <Button
                onClick={handleSupportSubmit}
                disabled={!supportCategory || !supportMessage.trim()}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Recent Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                      <Badge
                        className={
                          ticket.status === "resolved"
                            ? "bg-green-50 text-green-700"
                            : ticket.status === "in-progress"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-50 text-gray-700"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.subject}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{ticket.createdAt}</span>
                      <Badge
                        variant="outline"
                        className={
                          ticket.priority === "high" ? "border-red-200 text-red-700" : "border-gray-200 text-gray-700"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Tickets
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

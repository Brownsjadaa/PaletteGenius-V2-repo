"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { CTASection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function LandingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get current user
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Auth state change error:", error)
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader user={user} onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection onGetStarted={handleGetStarted} />
      <CTASection onGetStarted={handleGetStarted} />
      <LandingFooter />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { supabase } from "@/lib/supabase"
import { Palette } from "lucide-react"

export default function AuthPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (mounted) setLoading(false)
          return
        }

        if (session && mounted) {
          router.push("/dashboard")
          return
        }

        if (mounted) setLoading(false)
      } catch (error) {
        console.error("Error in checkAuth:", error)
        if (mounted) setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (!mounted) return

        console.log("Auth state changed:", event, session?.user?.email)

        if (event === "SIGNED_IN" && session) {
          router.push("/dashboard")
        } else if (event === "SIGNED_OUT") {
          setLoading(false)
        }
      } catch (error) {
        console.error("Auth state change error:", error)
        if (mounted) setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">PaletteGenius</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Create Beautiful
              <br />
              Color Palettes
            </h1>
            <p className="text-xl text-teal-100 leading-relaxed">
              Extract colors from images and generate harmonious palettes for your design projects. Join thousands of
              designers and developers.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Smart Color Extraction</h3>
                <p className="text-teal-100">Upload any image and extract dominant colors instantly</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Organize & Export</h3>
                <p className="text-teal-100">Save palettes in folders and export in multiple formats</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Lightning Fast</h3>
                <p className="text-teal-100">Generate 5 different palette types in seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}

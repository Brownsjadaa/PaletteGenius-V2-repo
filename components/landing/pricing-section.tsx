"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap } from "lucide-react"

interface PricingSectionProps {
  onGetStarted: () => void
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal projects and getting started",
      features: [
        "5 palette generations per day",
        "Basic export formats (CSS, JSON)",
        "Image upload up to 5MB",
        "3 saved palettes",
        "Community support",
      ],
      cta: "Get Started Free",
      popular: false,
      color: "border-gray-200",
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For professional designers and developers",
      features: [
        "Unlimited palette generations",
        "All export formats (CSS, SCSS, Tailwind, SVG, PNG)",
        "Image upload up to 50MB",
        "Unlimited saved palettes",
        "Folder organization",
        "Accessibility checker",
        "Priority support",
        "API access",
      ],
      cta: "Start Pro Trial",
      popular: true,
      color: "border-teal-500 ring-2 ring-teal-500",
    },
    {
      name: "Team",
      price: "$29",
      period: "per month",
      description: "For teams and agencies working together",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared palette libraries",
        "Brand color management",
        "Advanced analytics",
        "Custom export templates",
        "SSO integration",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      popular: false,
      color: "border-gray-200",
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? "shadow-xl" : "shadow-sm"}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-teal-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onGetStarted}
                  className={`w-full ${
                    plan.popular
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                  }`}
                >
                  {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">Frequently asked questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">We offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">Yes, Pro plan comes with a 14-day free trial. No credit card required.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for Team plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

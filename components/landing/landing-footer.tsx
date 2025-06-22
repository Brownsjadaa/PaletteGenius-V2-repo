"use client"

import { Palette, Twitter, Github, Linkedin, Mail } from "lucide-react"

export function LandingFooter() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API", href: "/api" },
      { name: "Changelog", href: "/changelog" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Color Theory Guide", href: "/guide" },
      { name: "Templates", href: "/templates" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  }

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/palettegenius" },
    { name: "GitHub", icon: Github, href: "https://github.com/palettegenius" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/palettegenius" },
    { name: "Email", icon: Mail, href: "mailto:hello@palettegenius.com" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">PaletteGenius</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Create beautiful color palettes from any image. Trusted by designers and developers worldwide.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 PaletteGenius. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Made with ❤️ for designers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

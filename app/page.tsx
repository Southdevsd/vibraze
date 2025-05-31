import { Heart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-16">

        {/* Features */}
        <Features />

        {/* Pricing */}
        <Pricing />

        {/* Testimonials */}
        <Testimonials />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

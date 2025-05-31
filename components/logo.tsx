import Image from "next/image"
import { cn } from "../lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/vibraze-logo.png"
        alt="Vibraze Logo"
        width={64}
        height={64}
        className={cn(sizeClasses[size], "object-contain")}
        priority
      />
      {showText && (
        <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Vibraze
        </span>
      )}
    </div>
  )
}

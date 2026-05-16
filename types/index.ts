import { User, Review, Chat, Message } from "@prisma/client"

export type SafeUser = Omit<User, "password"> & {
  plan: "FREE" | "PRO" | "ENTERPRISE"
}

export type ReviewWithUser = Review & {
  user: SafeUser
}

export type ChatWithMessages = Chat & {
  messages: Message[]
}

export type DashboardStats = {
  totalReviews: number
  totalChats: number
  averageScore: number
  issuesFound: number
  recentReviews: Review[]
  weeklyReviews: number[]
}

export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: string | number
}

export interface PricingTier {
  name: string
  price: number | "Custom"
  description: string
  features: string[]
  highlighted: boolean
  cta: string
}

export interface Testimonial {
  name: string
  role: string
  company: string
  avatar: string
  quote: string
  rating: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

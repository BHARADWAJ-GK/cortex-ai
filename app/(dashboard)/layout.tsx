import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export const metadata = { title: { template: "%s | Cortex AI Dashboard" } }

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return <DashboardLayout>{children}</DashboardLayout>
}

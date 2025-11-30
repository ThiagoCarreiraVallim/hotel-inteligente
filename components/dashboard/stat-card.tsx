import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export function StatCard({ title, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <p className={`mt-2 text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "+" : ""}
                {trend.value}% desde o último mês
              </p>
            )}
            {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
            <Icon className="h-6 w-6 text-slate-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

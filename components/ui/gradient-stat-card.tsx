"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from "recharts"

interface GradientStatCardProps {
  title: string
  value: string | number
  change: number
  data: Array<{ name: string; value: number }>
  color: "purple" | "orange" | "green" | "blue" | "amber"
}

export function GradientStatCard({ title, value, change, data, color }: GradientStatCardProps) {
  const getGradientColors = () => {
    switch (color) {
      case "purple":
        return { stroke: "#8b5cf6", fill: "#c4b5fd", gradientStart: "#8b5cf6", gradientEnd: "#c4b5fd30" }
      case "orange":
        return { stroke: "#f97316", fill: "#fed7aa", gradientStart: "#f97316", gradientEnd: "#fed7aa30" }
      case "green":
        return { stroke: "#10b981", fill: "#a7f3d0", gradientStart: "#10b981", gradientEnd: "#a7f3d030" }
      case "blue":
        return { stroke: "#3b82f6", fill: "#bfdbfe", gradientStart: "#3b82f6", gradientEnd: "#bfdbfe30" }
      case "amber":
        return { stroke: "#d97706", fill: "#fde68a", gradientStart: "#d97706", gradientEnd: "#fde68a30" }
      default:
        return { stroke: "#8b5cf6", fill: "#c4b5fd", gradientStart: "#8b5cf6", gradientEnd: "#c4b5fd30" }
    }
  }

  const colors = getGradientColors()
  const isPositive = change >= 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isPositive ? (
            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {Math.abs(change)}%
          </span>
          <span className="ml-1">dibanding minggu lalu</span>
        </div>
        <div className="h-[70px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`gradient-${color}-${title.replace(/\s+/g, '-')}`} x1="0\" y1="0\" x2="0\" y2="1">
                  <stop offset="5%" stopColor={colors.gradientStart} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.gradientEnd} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.stroke}
                strokeWidth={2}
                fill={`url(#gradient-${color}-${title.replace(/\s+/g, '-')})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
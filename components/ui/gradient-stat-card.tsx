"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts"

interface GradientStatCardProps {
  title: string
  value: string | number
  change: number
  data: Array<{ name: string; value: number }>
  color: "purple" | "orange" | "green"
}

export function GradientStatCard({ title, value, change, data, color }: GradientStatCardProps) {
  const getGradientColors = () => {
    switch (color) {
      case "purple":
        return { stroke: "#8b5cf6", fill: "#c4b5fd" }
      case "orange":
        return { stroke: "#f97316", fill: "#fed7aa" }
      case "green":
        return { stroke: "#10b981", fill: "#a7f3d0" }
      default:
        return { stroke: "#8b5cf6", fill: "#c4b5fd" }
    }
  }

  const colors = getGradientColors()
  const isPositive = change >= 0

  return (
    <Card>
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
          <span className="ml-1">compared to last week</span>
        </div>
        <div className="h-[70px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.fill} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.stroke}
                strokeWidth={2}
                fill={`url(#gradient-${color})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

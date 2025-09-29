"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease" | "neutral"
  icon: React.ReactNode
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const getChangeIcon = () => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="h-3 w-3" />
      case "decrease":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600"
      case "decrease":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          </div>
          <div className="text-primary opacity-80">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export { StatCard }

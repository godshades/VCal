"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getSolarToLunar, isSpecialLunarDay } from "@/lib/lunar-utils"

interface LunarCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function LunarCalendar({ selectedDate, onDateSelect }: LunarCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<
    Array<{
      date: Date
      lunarDay: number
      lunarMonth: number
      isLeap: boolean
      isToday: boolean
      isSelected: boolean
      isCurrentMonth: boolean
      hasHoliday: boolean
      holidayName?: string
    }>
  >([])

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const lunarInfo = getSolarToLunar(date)
      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = date.toDateString() === selectedDate.toDateString()

      // Check if it's a special day
      const specialDay = isSpecialLunarDay(lunarInfo.day, lunarInfo.month)
      const hasHoliday = specialDay.isSpecial
      const holidayName = specialDay.name

      days.push({
        date,
        lunarDay: lunarInfo.day,
        lunarMonth: lunarInfo.month,
        isLeap: lunarInfo.leap,
        isToday,
        isSelected,
        isCurrentMonth,
        hasHoliday,
        holidayName,
      })
    }

    setCalendarDays(days)
  }

  useEffect(() => {
    generateCalendarDays()
  }, [currentMonth, selectedDate])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => onDateSelect(day.date)}
              className={cn(
                "p-2 text-center rounded-lg transition-colors relative min-h-[60px] flex flex-col justify-center",
                day.isCurrentMonth ? "hover:bg-muted" : "text-muted-foreground hover:bg-muted/50",
                day.isToday && "bg-blue-100 text-blue-900 font-semibold",
                day.isSelected && "bg-blue-600 text-white",
                day.hasHoliday && !day.isSelected && "bg-red-50 text-red-700",
              )}
            >
              <div className="text-sm font-medium">{day.date.getDate()}</div>
              <div className="text-xs text-muted-foreground">
                {day.lunarDay}/{day.lunarMonth}
              </div>
              {day.hasHoliday && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1 py-0">
                  •
                </Badge>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

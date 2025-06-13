"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Ensure Button is imported
import { Calendar, Moon, Star } from "lucide-react"
import { getSolarToLunar, getLunarYearName, isSpecialLunarDay } from "@/lib/lunar-utils"

interface TodayInfoProps {
  selectedDate: Date
  setSelectedCategory: (category: string) => void
  setActiveTab: (tabId: string) => void // <--- Add this prop
}

export function TodayInfo({ selectedDate, setSelectedCategory, setActiveTab }: TodayInfoProps) {
  const lunarInfo = getSolarToLunar(selectedDate)
  const specialDay = isSpecialLunarDay(lunarInfo.day, lunarInfo.month)
  const isSpecialDay = specialDay.isSpecial
  const specialDayName = specialDay.name
  const dayName = selectedDate.toLocaleDateString("vi-VN", { weekday: "long" })
  const lunarYearName = getLunarYearName(lunarInfo.year)

  const handleSuggestionClick = () => {
    setSelectedCategory("monthly") // Sets the prayer category
    setActiveTab("prayers")       // <--- Switches to the "Văn Khấn" tab
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thông Tin Ngày
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Dương lịch</p>
            <p className="font-semibold">
              {selectedDate.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-muted-foreground capitalize">{dayName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Âm lịch</p>
            <p className="font-semibold">
              {lunarInfo.day}/{lunarInfo.month}
              {lunarInfo.leap ? " (N)" : ""}/{lunarInfo.year}
            </p>
            <p className="text-xs text-muted-foreground">Năm {lunarYearName}</p>
            {isSpecialDay && (
              <Badge variant="secondary" className="mt-1">
                {specialDayName}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Lễ Hội Hôm Nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSpecialDay ? (
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center py-2">
                {lunarInfo.day === 1 ? "Ngày Mồng 1" : "Ngày Rằm"}
              </Badge>
              <p className="text-sm text-muted-foreground text-center">Ngày cúng lễ truyền thống</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">Không có lễ hội đặc biệt</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Gợi Ý Văn Khấn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSpecialDay ? (
            <div className="space-y-2">
              <Button onClick={handleSuggestionClick} className="w-full">
                Xem văn khấn {lunarInfo.day === 1 ? "mồng 1" : "rằm"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Bấm để lọc danh sách bên cạnh</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">Văn khấn hàng ngày</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

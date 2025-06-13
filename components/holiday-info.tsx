"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { getLunarToSolar } from "@/lib/lunar-utils"
import holidayData from "@/data/holidays.json" 

interface Holiday {
  name: string;
  lunarDate: string;
  description: string;
  traditions: string[];
  region: string;
  type: string;
}

export function HolidayInfo() {
  // 3. Use useState to hold the holiday data. Initialize with an empty array.
  const [holidays, setHolidays] = useState<Holiday[]>([])

  // 4. Use useEffect to load the data from the imported JSON file once the component mounts.
  useEffect(() => {
    setHolidays(holidayData)
  }, [])
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Lễ hội lớn":
        return "bg-red-100 text-red-800"
      case "Lễ hội truyền thống":
        return "bg-blue-100 text-blue-800"
      case "Lễ hội tôn giáo":
        return "bg-purple-100 text-purple-800"
      case "Lễ hội địa phương":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getApproximateSolarDate = (lunarDateStr: string, year: number) => {
    const [day, month] = lunarDateStr.split("/").map(Number)
    const solarDate = getLunarToSolar(day, month, year)
    return solarDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Lễ Hội Truyền Thống Việt Nam</h2>
        <p className="text-muted-foreground">Khám phá các lễ hội và ngày lễ quan trọng trong văn hóa Việt Nam</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {holidays.map((holiday, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{holiday.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Ngày {holiday.lunarDate} âm lịch
                    <span className="text-xs text-muted-foreground">
                      (~{getApproximateSolarDate(holiday.lunarDate, new Date().getFullYear())})
                    </span>
                  </CardDescription>
                </div>
                <Badge className={getTypeColor(holiday.type)}>{holiday.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{holiday.description}</p>

              <div>
                <h4 className="font-medium text-sm mb-2">Truyền thống:</h4>
                <div className="flex flex-wrap gap-1">
                  {holiday.traditions.map((tradition, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tradition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {holiday.region}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Gia đình
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

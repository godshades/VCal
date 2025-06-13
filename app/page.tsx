"use client"

import { useState } from "react"
import { Calendar, BookOpen, Star, Moon, Sun } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LunarCalendar } from "@/components/lunar-calendar"
import { HolidayInfo } from "@/components/holiday-info"
import { PrayerLibrary } from "@/components/prayer-library"
import { TodayInfo } from "@/components/today-info"

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("calendar")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Moon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Lịch Âm Việt Nam
                </h1>
                <p className="text-sm text-muted-foreground">Tra cứu lịch âm, lễ hội và văn khấn truyền thống</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sun className="h-3 w-3" />
                Hôm nay
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Today's Information */}
          <div className="lg:col-span-1">
            <TodayInfo
              selectedDate={selectedDate}
              setSelectedCategory={setSelectedCategory}
              setActiveTab={setActiveTab} // <--- Pass setActiveTab here
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Lịch Âm
                </TabsTrigger>
                <TabsTrigger value="holidays" className="gap-2">
                  <Star className="h-4 w-4" />
                  Lễ Hội
                </TabsTrigger>
                <TabsTrigger value="prayers" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Văn Khấn
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-6">
                <LunarCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              </TabsContent>

              <TabsContent value="holidays" className="space-y-6">
                <HolidayInfo />
              </TabsContent>

              <TabsContent value="prayers" className="space-y-6">
                <PrayerLibrary
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Lịch Âm Việt Nam. Bảo tồn và phát huy văn hóa truyền thống.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

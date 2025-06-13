"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Star, Calendar, Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Prayer {
  id: number
  title: string
  category: string
  occasion: string
  description: string
  content: string
  tags: string[]
}

interface PrayerLibraryProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function PrayerLibrary({ selectedCategory, setSelectedCategory }: PrayerLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [prayers, setPrayers] = useState<Prayer[]>([])

  useEffect(() => {
    setIsLoading(true)
    import("@/data/prayers.json")
      .then((module) => {
        setPrayers(module.default || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Failed to load prayers data:", error)
        setPrayers([])
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Thư Viện Văn Khấn</h2>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  const prayerCategories = [
    { id: "all", name: "Tất cả", icon: BookOpen },
    { id: "tet", name: "Tết Nguyên Đán", icon: Star },
    { id: "monthly", name: "Mồng 1 & Rằm", icon: Calendar },
    { id: "special", name: "Lễ đặc biệt", icon: Home },
  ]

  const filteredPrayers = prayers.filter((prayer) => {
    const matchesSearch =
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prayer.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || prayer.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Thư Viện Văn Khấn</h2>
        <p className="text-muted-foreground">Bộ sưu tập văn khấn truyền thống cho các dịp lễ hội và cúng kiến</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm văn khấn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {prayerCategories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                <Icon className="h-3 w-3 mr-1" />
                {category.name}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPrayers.map((prayer) => (
              <Card key={prayer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{prayer.title}</CardTitle>
                      <CardDescription>{prayer.occasion}</CardDescription>
                    </div>
                    <Badge variant="outline">{prayer.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{prayer.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {(prayer.tags || []).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Xem văn khấn
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{prayer.title}</DialogTitle>
                        <DialogDescription>{prayer.description}</DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-96 mt-4">
                        <div className="whitespace-pre-line text-sm leading-relaxed p-4 bg-muted/50 rounded-lg">
                          {prayer.content}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrayers.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không tìm thấy văn khấn phù hợp</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

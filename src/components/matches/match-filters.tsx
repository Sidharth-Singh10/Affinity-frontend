"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, SlidersHorizontal } from "lucide-react"

export function MatchFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="recent">
        <SelectTrigger className="w-32 bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-white/20">
          <SelectItem value="recent">Recent</SelectItem>
          <SelectItem value="compatibility">Compatibility</SelectItem>
          <SelectItem value="distance">Distance</SelectItem>
          <SelectItem value="activity">Activity</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        className="border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-white/20 hover:border-[#FF0059]/50 bg-white/5 hover:bg-white/10"
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Sort
      </Button>
    </div>
  )
}

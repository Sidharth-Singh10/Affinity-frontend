'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRecommendations, type RecommendationFilters } from '@/hooks/use-recommendations'
import { Settings, Filter, X } from 'lucide-react'

interface RecommendationFiltersProps {
  isOpen: boolean
  onClose: () => void
  onFiltersApplied?: () => void // Callback when filters are applied
}

export function RecommendationFiltersComponent({ isOpen, onClose, onFiltersApplied }: RecommendationFiltersProps) {
  const { currentFilters, updateFilters, isLoading } = useRecommendations()
  
  const [localFilters, setLocalFilters] = useState<RecommendationFilters>(currentFilters)

  // Sync local filters with context when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters)
    }
  }, [isOpen, currentFilters])

  const handleApplyFilters = () => {
    updateFilters(localFilters)
    onFiltersApplied?.() // Notify parent component
    onClose()
  }

  const handleResetFilters = () => {
    const defaultFilters: RecommendationFilters = {
      limit: 10
    }
    setLocalFilters(defaultFilters)
    updateFilters(defaultFilters)
    onFiltersApplied?.() // Notify parent component
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-[#FF0059]" />
            <h2 className="text-xl font-semibold text-white">Filter Recommendations</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Gender Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">Looking for</Label>
            <Select
              value={localFilters.gender || 'all'}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ 
                  ...prev, 
                  gender: value === 'all' ? undefined : value as 'M' | 'F' 
                }))
              }
            >
              <SelectTrigger className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="all">Everyone</SelectItem>
                <SelectItem value="M">Men</SelectItem>
                <SelectItem value="F">Women</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-white/80">Age Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-white/60">Minimum Age</Label>
                <Input
                  type="number"
                  min="18"
                  max="100"
                  value={localFilters.age_min || ''}
                  onChange={(e) => 
                    setLocalFilters(prev => ({ 
                      ...prev, 
                      age_min: e.target.value ? parseInt(e.target.value) : undefined 
                    }))
                  }
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
                  placeholder="18"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-white/60">Maximum Age</Label>
                <Input
                  type="number"
                  min="18"
                  max="100"
                  value={localFilters.age_max || ''}
                  onChange={(e) => 
                    setLocalFilters(prev => ({ 
                      ...prev, 
                      age_max: e.target.value ? parseInt(e.target.value) : undefined 
                    }))
                  }
                  className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Results Limit */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">Number of Results</Label>
            <Select
              value={localFilters.limit?.toString() || '10'}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ 
                  ...prev, 
                  limit: parseInt(value) 
                }))
              }
            >
              <SelectTrigger className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="5">5 profiles</SelectItem>
                <SelectItem value="10">10 profiles</SelectItem>
                <SelectItem value="20">20 profiles</SelectItem>
                <SelectItem value="50">50 profiles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Match Score */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">
              Minimum Match Score (Optional)
            </Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={localFilters.min_score !== undefined ? localFilters.min_score : ''}
              onChange={(e) => 
                setLocalFilters(prev => ({ 
                  ...prev, 
                  min_score: e.target.value ? parseFloat(e.target.value) : undefined 
                }))
              }
              className="bg-white/5 border-white/20 focus:border-[#FF0059] rounded-xl"
              placeholder="e.g., 50"
            />
            <p className="text-xs text-white/50">
              Show only profiles with at least this match percentage
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex-1 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-[#FF0059] hover:bg-[#FF0059]/90"
            disabled={isLoading}
          >
            {isLoading ? 'Applying...' : 'Apply Filters'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

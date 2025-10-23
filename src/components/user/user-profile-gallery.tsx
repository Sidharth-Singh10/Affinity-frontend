"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface UserProfileGalleryProps {
  images: string[]
  name: string
}

export function UserProfileGallery({ images, name }: UserProfileGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const safeImages = Array.isArray(images) && images.length > 0 ? images : ['/placeholder.svg']
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
  <h3 className="text-lg font-semibold text-white mb-4">Photos ({images?.length || 0})</h3>

        {/* Main Image */}
        <div className="relative mb-4 group">
          <img
            src={safeImages[currentIndex] || "/placeholder.svg"}
            alt={`${name} photo ${currentIndex + 1}`}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl cursor-pointer"
            onClick={() => setSelectedImage(currentIndex)}
          />

          {/* Navigation Arrows */}
          {safeImages.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
    {safeImages.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden ${
                  index === currentIndex ? "ring-2 ring-[#FF0059]" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
      src={image || "/placeholder.svg"}
                  alt={`${name} thumbnail ${index + 1}`}
                  className="w-full h-16 object-cover hover:opacity-80 transition-opacity"
                />
                {index === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Full Screen Image Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={safeImages[selectedImage] || "/placeholder.svg"}
              alt={`${name} photo ${selectedImage + 1}`}
              className="w-full h-full object-contain rounded-2xl"
            />

            {/* Close Button */}
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 p-0"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Navigation in Modal */}
    {safeImages.length > 1 && (
              <>
                <Button
      onClick={() => setSelectedImage((prev) => (prev! - 1 + safeImages.length) % safeImages.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 p-0"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
      onClick={() => setSelectedImage((prev) => (prev! + 1) % safeImages.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 p-0"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image Counter in Modal */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-medium">
                {selectedImage + 1} of {safeImages.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

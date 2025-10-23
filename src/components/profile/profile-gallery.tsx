"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, X, Camera, ImageIcon, Star } from "lucide-react"
import { useState, useRef } from "react"
import { api } from "@/lib/api"
import { useUserData } from "@/hooks/use-user-data"

export function ProfileGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get images from context
  const { images, isLoading, refreshImages, removeImage: removeImageFromContext, updateImage } = useUserData()
  const safeImages = Array.isArray(images) ? images : []

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('images', file)
      })

      const response = await api.uploadImages(formData)
      
      if (response.error) {
        setError(response.error)
      } else {
        // Refresh the image list from context
        await refreshImages()
      }
    } catch (err) {
      setError("Failed to upload images")
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSetPrimary = async (imageId: number) => {
    try {
      const response = await api.setPrimaryImage(imageId)
      if (response.error) {
        setError(response.error)
      } else {
        // Refresh the image list from context
        await refreshImages()
      }
    } catch (err) {
      setError("Failed to set primary image")
      console.error("Set primary error:", err)
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await api.deleteUserImage(imageId)
      if (response.error) {
        setError(response.error)
      } else {
        // Remove from context immediately for better UX
        removeImageFromContext(imageId)
        // Also refresh to ensure sync
        await refreshImages()
      }
    } catch (err) {
      setError("Failed to delete image")
      console.error("Delete error:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Photo Gallery</h2>
          <p className="text-white/60">Manage your profile photos and showcase your personality</p>
        </div>
        <Button
          onClick={handleImageUpload}
          disabled={isUploading}
          className="bg-[#FF0059] hover:bg-[#FF0059]/90 px-6 py-3 rounded-xl font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          {isUploading ? "Uploading..." : "Add Photo"}
        </Button>
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0059]"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {/* Upload Slot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full sm:w-48 h-48 bg-white/5 border-2 border-dashed border-white/20 hover:border-[#FF0059]/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/10 group"
              onClick={handleImageUpload}
            >
              <div className="w-12 h-12 bg-[#FF0059]/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#FF0059]/30 transition-colors">
                <Camera className="h-6 w-6 text-[#FF0059]" />
              </div>
              <span className="text-white/70 font-medium text-sm">Add New Photo</span>
              <span className="text-white/50 text-xs mt-1">JPG, PNG up to 5MB</span>
            </motion.div>

            {/* Existing Images */}
            {safeImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative w-full sm:w-48 h-48 group"
              >
                <img
                  src={image.image_url || "/default.jpg"}
                  alt={`Profile photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl border border-white/10 group-hover:border-[#FF0059]/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedImage(image.id)}
                />

                {/* Primary Badge */}
                {image?.is_primary && (
                  <div className="absolute top-3 left-3 bg-[#FF0059] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" fill="currentColor" />
                    Primary
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <div className="flex gap-2">
                    {!image.is_primary && (
                      <Button 
                        size="sm" 
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetPrimary(image.id)
                        }}
                        title="Set as primary"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteImage(image.id)
                      }}
                      title="Delete image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty State */}
            {safeImages.length === 0 && (
              <div className="w-full text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-white/30" />
                </div>
                <p className="text-white/60">No images yet</p>
                <p className="text-white/40 text-sm mt-1">Upload your first photo to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-[#FF0059]/10 border border-[#FF0059]/20 rounded-xl">
          <h4 className="font-semibold text-white mb-2">Photo Tips</h4>
          <ul className="text-sm text-white/70 space-y-1">
            <li>• Use high-quality, well-lit photos</li>
            <li>• Show your face clearly in your primary photo</li>
            <li>• Include photos that showcase your interests and lifestyle</li>
            <li>• Avoid group photos where you're hard to identify</li>
          </ul>
        </div>
      </motion.div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-2xl max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images.find((img) => img.id === selectedImage)?.image_url || "/default.jpg"}
              alt="Selected photo"
              className="w-full h-full object-contain rounded-2xl"
            />
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

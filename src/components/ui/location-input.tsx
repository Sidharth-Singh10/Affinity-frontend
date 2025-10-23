"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "./input"
import { MapPin } from "lucide-react"

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

// Common cities database (you can expand this)
const popularCities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "San Francisco, CA",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "Nashville, TN",
  "Portland, OR",
  "Las Vegas, NV",
  "Detroit, MI",
  "Memphis, TN",
  "Louisville, KY",
  "Baltimore, MD",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Sacramento, CA",
  "Atlanta, GA",
  "Miami, FL",
  "Orlando, FL",
  "Tampa, FL",
  "Minneapolis, MN",
  "Cleveland, OH",
  "New Orleans, LA",
  "Raleigh, NC",
  "Charlotte, NC",
  "Indianapolis, IN",
  "Columbus, OH",
  // Add more cities as needed
  "Mumbai, India",
  "Delhi, India",
  "Bangalore, India",
  "Hyderabad, India",
  "Chennai, India",
  "Kolkata, India",
  "Pune, India",
  "Ahmedabad, India",
  "Jaipur, India",
  "Lucknow, India",
  "London, UK",
  "Manchester, UK",
  "Birmingham, UK",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada",
  "Sydney, Australia",
  "Melbourne, Australia",
  "Brisbane, Australia",
  "Singapore",
  "Dubai, UAE",
  "Paris, France",
  "Berlin, Germany",
  "Amsterdam, Netherlands",
  "Tokyo, Japan",
  "Seoul, South Korea",
  "Hong Kong",
]

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your city",
  className,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)

    if (inputValue.length > 0) {
      const filtered = popularCities.filter((city) =>
        city.toLowerCase().includes(inputValue.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 10)) // Limit to 10 suggestions
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (city: string) => {
    onChange(city)
    setShowSuggestions(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.length > 0 && suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          className={`pl-12 ${className}`}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(city)}
              className="w-full text-left px-4 py-3 hover:bg-[#FF0059]/10 hover:border-l-2 hover:border-[#FF0059] transition-all duration-200 text-white/90 hover:text-white font-medium first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-[#FF0059]" />
                {city}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

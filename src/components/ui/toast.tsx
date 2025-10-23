"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/90 group-[.toaster]:border-white/20 group-[.toaster]:text-white group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-white/70",
          actionButton:
            "group-[.toast]:bg-[#FF0059] group-[.toast]:text-white group-[.toast]:hover:bg-[#FF0059]/80",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:hover:bg-white/20",
          error:
            "group-[.toaster]:bg-red-500/10 group-[.toaster]:border-red-500/20 group-[.toaster]:text-red-400",
          success:
            "group-[.toaster]:bg-green-500/10 group-[.toaster]:border-green-500/20 group-[.toaster]:text-green-400",
          warning:
            "group-[.toaster]:bg-yellow-500/10 group-[.toaster]:border-yellow-500/20 group-[.toaster]:text-yellow-400",
          info:
            "group-[.toaster]:bg-blue-500/10 group-[.toaster]:border-blue-500/20 group-[.toaster]:text-blue-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

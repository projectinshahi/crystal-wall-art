import { cn } from "@/lib/utils"
import React from "react"

interface HomeContentWrapperProps {
  children: React.ReactNode
  wrapperClassName?: string
  containerClassName?: string
}

const HomeContentWrapper = ({
  children,
  wrapperClassName,
  containerClassName,
}: HomeContentWrapperProps) => {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12",
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default HomeContentWrapper
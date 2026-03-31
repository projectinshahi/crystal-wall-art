"use client"

import React, { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image, { StaticImageData } from "next/image"

interface CarouselProps {
  slides: StaticImageData[];
  showButtons?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  loop?: boolean
  slidesPerView?: number
  responsive?: {
    breakpoint: number
    slidesPerView: number
  }[]
  className?: string
  viewPortClassName?: string
}

export default function Carousel({
  slides,
  showButtons = true,
  showDots = true,
  autoplay = false,
  autoplayDelay = 4000,
  loop = true,
  slidesPerView = 1,
  responsive = [],
  className = "",
  viewPortClassName = ""
}: CarouselProps) {

  const hasMultipleSlides = slides.length > 1

  const [currentSlidesPerView, setCurrentSlidesPerView] =
    useState(slidesPerView)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: hasMultipleSlides && loop,
    align: "start",
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index)
  }, [emblaApi])

  /* Slide change listener */
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    onSelect()

  }, [emblaApi])

  /* Autoplay */
  useEffect(() => {
    if (!autoplay || !hasMultipleSlides) return

    const timer = setInterval(() => {
      emblaApi?.scrollNext()
    }, autoplayDelay)

    return () => clearInterval(timer)

  }, [emblaApi, autoplay, autoplayDelay, hasMultipleSlides])

  /* Responsive slides */
  useEffect(() => {

    const updateSlides = () => {
      const width = window.innerWidth

      let spv = slidesPerView

      responsive.forEach(r => {
        if (width <= r.breakpoint) {
          spv = r.slidesPerView
        }
      })

      setCurrentSlidesPerView(spv)
    }

    updateSlides()
    window.addEventListener("resize", updateSlides)

    return () => window.removeEventListener("resize", updateSlides)

  }, [responsive, slidesPerView])

  return (
    <div className={`relative w-full ${className}`}>

      {/* Viewport */}
      <div className={`overflow-hidden ${viewPortClassName}`} ref={emblaRef}>
        <div className="flex">

          {slides.map((slide, index) => (
            <div
              key={index}
              style={{
                flex: `0 0 ${100 / currentSlidesPerView}%`,
              }}
              className="min-w-0 h-full relative"
            >
              <Image
                src={slide}
                alt={`slide-${index}`}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

        </div>
      </div>

      {/* Navigation Buttons */}
      {showButtons && hasMultipleSlides && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow p-2"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && hasMultipleSlides && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${selectedIndex === index
                  ? "w-6 bg-lightBackground"
                  : "w-2 bg-white"
                }`}
            />
          ))}
        </div>
      )}

    </div>
  )
}
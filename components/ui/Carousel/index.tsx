"use client"

import "./embla.css";
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import Image from 'next/image'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isVideoUrl, videoPosterUrl } from '@/lib/utils/media'

export type SlideData = {
  id?: number
  image_url: string;
  content?: React.ReactNode,
}

type DotPosition =
  | 'inside-bottom-center'
  | 'inside-bottom-left'
  | 'inside-bottom-right'
  | 'inside-top-center'
  | 'inside-top-left'
  | 'inside-top-right'
  | 'outside-bottom-center'
  | 'outside-bottom-left'
  | 'outside-bottom-right'

type PropType = {
  slides: SlideData[]
  options?: EmblaOptionsType
  showArrow?: boolean
  showDots?: boolean
  autoplayDelay?: number
  autoplay?: boolean
  contentClassName?: string
  dotPosition?: DotPosition        // ← new
  dotClassName?: string            // ← optional extra styles on each dot
  thumbnails?: boolean             // small clickable images beside the slider (below it on mobile)
}

// Maps dotPosition value → Tailwind classes for the dots wrapper
const dotPositionStyles: Record<DotPosition, string> = {
  // Inside variants — absolute inside .embla__viewport
  'inside-bottom-center': 'absolute bottom-3 left-1/2 -translate-x-1/2 z-10',
  'inside-bottom-left':   'absolute bottom-3 left-3 z-10',
  'inside-bottom-right':  'absolute bottom-3 right-3 z-10',
  'inside-top-center':    'absolute top-3 left-1/2 -translate-x-1/2 z-10',
  'inside-top-left':      'absolute top-3 left-3 z-10',
  'inside-top-right':     'absolute top-3 right-3 z-10',
  // Outside variants — rendered below the viewport in normal flow
  'outside-bottom-center': 'flex justify-center mt-3',
  'outside-bottom-left':   'flex justify-start mt-3',
  'outside-bottom-right':  'flex justify-end mt-3',
}

const isInsidePosition = (pos: DotPosition) => pos.startsWith('inside')

// Plays only while its slide is selected, so off-screen videos don't download or play
const SlideVideo = ({ src, active }: { src: string; active: boolean }) => {
  const ref = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active) video.play().catch(() => { /* autoplay blocked: the controls still work */ })
    else video.pause()
  }, [active])

  return (
    <video
      ref={ref}
      src={src}
      poster={videoPosterUrl(src)}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      controls
      preload="metadata"
    />
  )
}

const ImageSlider = ({
  slides,
  options,
  showArrow = true,
  showDots = true,
  autoplayDelay = 4000,
  autoplay: autoplayEnabled = true,
  contentClassName,
  dotPosition = 'outside-bottom-center',  // sensible default
  dotClassName,
  thumbnails = false,
}: PropType) => {

  const autoplay = Autoplay({
    delay: autoplayDelay,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  })

  const [emblaRef, emblaApi] = useEmblaCarousel(options, autoplayEnabled ? [autoplay] : [])
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  const inside = isInsidePosition(dotPosition)

  // Thumbnail strip scrolls horizontally on mobile and vertically on sm+; track which ends have hidden thumbnails
  const thumbsRef = React.useRef<HTMLDivElement>(null)
  const [thumbsMore, setThumbsMore] = React.useState({ start: false, end: false })

  const updateThumbsMore = React.useCallback(() => {
    const el = thumbsRef.current
    if (!el) return
    const vertical = el.scrollHeight > el.clientHeight + 1
    const pos = vertical ? el.scrollTop : el.scrollLeft
    const max = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth
    setThumbsMore({ start: pos > 1, end: pos < max - 1 })
  }, [])

  React.useEffect(() => {
    const el = thumbsRef.current
    if (!el) return
    updateThumbsMore()
    const observer = new ResizeObserver(updateThumbsMore)
    observer.observe(el)
    return () => observer.disconnect()
  }, [updateThumbsMore, slides.length])

  const scrollThumbs = (dir: 1 | -1) => {
    const el = thumbsRef.current
    if (!el) return
    if (el.scrollHeight > el.clientHeight + 1) el.scrollBy({ top: dir * el.clientHeight * 0.8, behavior: 'smooth' })
    else el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  // Keep the selected thumbnail in view (scrolls the strip only, never the page)
  React.useEffect(() => {
    const el = thumbsRef.current
    const thumb = el?.children[selectedIndex] as HTMLElement | undefined
    if (!el || !thumb) return
    if (el.scrollHeight > el.clientHeight + 1) {
      if (thumb.offsetTop < el.scrollTop || thumb.offsetTop + thumb.offsetHeight > el.scrollTop + el.clientHeight)
        el.scrollTo({ top: thumb.offsetTop - (el.clientHeight - thumb.offsetHeight) / 2, behavior: 'smooth' })
    } else if (thumb.offsetLeft < el.scrollLeft || thumb.offsetLeft + thumb.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: thumb.offsetLeft - (el.clientWidth - thumb.offsetWidth) / 2, behavior: 'smooth' })
    }
  }, [selectedIndex])

  const thumbArrowClass = 'absolute z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black shadow-md cursor-pointer'

  // Don't auto-advance away from a video the customer is watching. Autoplay restarts itself after hover
  // and taps, so it is stopped whenever it arms its timer on a video slide, and resumed on leaving one.
  React.useEffect(() => {
    const plugin = emblaApi?.plugins()?.autoplay
    if (!emblaApi || !plugin || !autoplayEnabled) return
    if (!slides.some(slide => isVideoUrl(slide.image_url))) return

    const onVideo = () => isVideoUrl(slides[emblaApi.selectedScrollSnap()]?.image_url)
    const holdOnVideo = () => { if (onVideo()) plugin.stop() }
    const onSelect = () => {
      if (onVideo()) plugin.stop()
      else if (!plugin.isPlaying()) plugin.play()
    }

    holdOnVideo()
    emblaApi.on('autoplay:timerset', holdOnVideo).on('select', onSelect)
    return () => { emblaApi.off('autoplay:timerset', holdOnVideo).off('select', onSelect) }
  }, [emblaApi, slides, autoplayEnabled])

  const DotsNode = showDots ? (
    <div className={cn('flex gap-1.5', dotPositionStyles[dotPosition])}>
      {scrollSnaps.map((_, index) => (
        <DotButton
          key={index}
          onClick={() => onDotButtonClick(index)}
          className={cn(
            'embla__dot',
            index === selectedIndex && 'embla__dot--selected',
            dotClassName
          )}
        />
      ))}
    </div>
  ) : null

  const ThumbnailsNode = thumbnails && slides.length > 1 ? (
    // On sm+ the column stretches to the slider's height and scrolls inside it
    <div className="relative shrink-0 sm:w-16 lg:w-20">
      <div ref={thumbsRef} onScroll={updateThumbsMore} className="relative flex gap-2 overflow-x-auto sm:absolute sm:inset-0 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id ?? index}
            onClick={() => onDotButtonClick(index)}
            aria-label={`Show image ${index + 1}`}
            className={cn(
              'relative aspect-square w-16 lg:w-20 shrink-0 overflow-hidden rounded-md border-2 bg-[#f1f5f9] cursor-pointer transition-all',
              index === selectedIndex ? 'border-black/60' : 'border-transparent opacity-70 hover:opacity-100'
            )}
          >
            {isVideoUrl(slide.image_url) ? (
              <>
                {videoPosterUrl(slide.image_url)
                  ? <Image src={videoPosterUrl(slide.image_url)!} alt="" fill sizes="80px" className="object-cover" />
                  : <video src={slide.image_url} className="absolute inset-0 h-full w-full object-cover" muted playsInline preload="metadata" />}
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-5 w-5 fill-white text-white drop-shadow" />
                </span>
              </>
            ) : (
              <Image src={slide.image_url} alt="" fill sizes="80px" className="object-cover" />
            )}
          </button>
        ))}
      </div>
      {thumbsMore.start && (
        <>
          <button type="button" aria-label="Previous thumbnails" onClick={() => scrollThumbs(-1)} className={cn(thumbArrowClass, 'left-1 top-1/2 -translate-y-1/2 sm:hidden')}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Previous thumbnails" onClick={() => scrollThumbs(-1)} className={cn(thumbArrowClass, 'hidden sm:flex top-1 left-1/2 -translate-x-1/2')}>
            <ChevronUp className="h-4 w-4" />
          </button>
        </>
      )}
      {thumbsMore.end && (
        <>
          <button type="button" aria-label="More thumbnails" onClick={() => scrollThumbs(1)} className={cn(thumbArrowClass, 'right-1 top-1/2 -translate-y-1/2 sm:hidden')}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" aria-label="More thumbnails" onClick={() => scrollThumbs(1)} className={cn(thumbArrowClass, 'hidden sm:flex bottom-1 left-1/2 -translate-x-1/2')}>
            <ChevronDown className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  ) : null

  return (
    <div className={cn(ThumbnailsNode && 'flex flex-col-reverse gap-3 sm:flex-row')}>
    {ThumbnailsNode}
    <div className="embla min-w-0 flex-1">

      {/* Viewport — position:relative so inside dots can anchor to it */}
      <div className="embla__viewport relative" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={slide.id}>
              <div className={cn('embla__slide__content', contentClassName)}>
                {isVideoUrl(slide.image_url) ? (
                  <SlideVideo src={slide.image_url} active={index === selectedIndex} />
                ) : (
                  <Image
                    src={slide.image_url}
                    alt="Slide Image"
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="embla__slide__img"
                    priority={slide.id === slides[0].id}
                  />
                )}
                {slide.content && (
                  <div className="embla__slide__overlay">
                    <div className="embla__slide__dynamic-node">
                      {slide.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overlay arrows on the image so it's clear there are more photos */}
        {thumbnails && slides.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={onPrevButtonClick} disabled={prevBtnDisabled}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow-md backdrop-blur-sm transition hover:bg-white disabled:opacity-0 cursor-pointer">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next image" onClick={onNextButtonClick} disabled={nextBtnDisabled}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow-md backdrop-blur-sm transition hover:bg-white disabled:opacity-0 cursor-pointer">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots rendered INSIDE the viewport */}
        {inside && DotsNode}
      </div>

      {/* Dots rendered OUTSIDE the viewport */}
      {!inside && DotsNode}

      {/* Arrow buttons */}
      {showArrow && (
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      )}

    </div>
    </div>
  )
}

export default ImageSlider
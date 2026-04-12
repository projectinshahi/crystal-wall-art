"use client"

import "./embla.css";
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export type SlideData = {
  id: number
  image: string
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
  contentClassName?: string
  dotPosition?: DotPosition        // ← new
  dotClassName?: string            // ← optional extra styles on each dot
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

const ImageSlider = ({
  slides,
  options,
  showArrow = true,
  showDots = true,
  autoplayDelay = 4000,
  contentClassName,
  dotPosition = 'outside-bottom-center',  // sensible default
  dotClassName,
}: PropType) => {

  const autoplay = Autoplay({
    delay: autoplayDelay,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  })

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay])
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  const inside = isInsidePosition(dotPosition)

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

  return (
    <div className="embla">

      {/* Viewport — position:relative so inside dots can anchor to it */}
      <div className="embla__viewport relative" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div className="embla__slide" key={slide.id}>
              <div className={cn('embla__slide__content', contentClassName)}>
                <Image
                  src={slide.image}
                  alt="Slide Image"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="embla__slide__img"
                  priority={slide.id === slides[0].id}
                />
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
  )
}

export default ImageSlider
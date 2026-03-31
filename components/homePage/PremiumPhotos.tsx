import React from 'react'
import HomeContentWrapper from './HomeContentWrapper'
import { Typography } from '../ui/Typography'
import Carousel from '../ui/carousel'
import img1 from '@/public/images/arcylic1.jpg'
import img2 from '@/public/images/arcylic2.jpg'
import img3 from '@/public/images/arcylic3.jpg'
import img4 from '@/public/images/arcylic4.jpg'

const PremiumPhotos = () => {

    const slides = [img1, img2, img3, img4]

    return (
        <HomeContentWrapper>
            <div className='space-y-5'>

                <Typography className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-center">
                    Find art for your space
                </Typography>

                <Carousel
                    viewPortClassName='rounded-[20px] h-[236px] sm:h-[400px]'
                    slides={slides}
                    autoplay
                    autoplayDelay={5000}
                    showDots
                    showButtons={false}
                    slidesPerView={1}
                />

                <Typography className="text-sm sm:text-base lg:text-lg font-display font-medium text-center">
                    Premium acrilic photos
                </Typography>

            </div>
        </HomeContentWrapper>
    )
}

export default PremiumPhotos
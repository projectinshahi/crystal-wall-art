import React from 'react'
import HomeContentWrapper from './HomeContentWrapper'
import { Typography } from '../ui/Typography'
import Carousel from '../ui/carousel'
import img1 from '@/public/images/arcylic1.jpg'
import img2 from '@/public/images/arcylic2.jpg'
import img3 from '@/public/images/arcylic3.jpg'
import img4 from '@/public/images/arcylic4.jpg'

const Frames3DSlider = () => {

    const slides = [img1, img2, img3, img4]

    return (
        <HomeContentWrapper>
            <div className='space-y-5'>

                <Typography className="text-xs sm:text-sm lg:text-base font-display font-medium text-center">
                    Crystal Wall Art- Wings To Your Imagination. Best Quality Acrylic Printing At Affordable Rate
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
                    3D Frames
                </Typography>

            </div>
        </HomeContentWrapper>
    )
}

export default Frames3DSlider
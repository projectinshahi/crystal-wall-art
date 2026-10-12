"use server"

import Carousel from '../ui/carousel'
import HomeContentWrapper from './HomeContentWrapper'
import { getHomeBanners } from './getHomeBanners'

const HeroSection = async () => {

    // Admin → Content → "Hero Section (Top Slider)"; each slide is an image or a video
    const items = await getHomeBanners('hero_section');

    if (!items.length) return null;

    const slides = items.map((item) => item.url);
    const mobileSlides = items.map((item) => item.mobileUrl);

    return (
        <HomeContentWrapper containerClassName='px-4 sm:px-6 lg:px-8 py-4 sm:py-14 lg:py-20'>
            <Carousel
                viewPortClassName='rounded-[20px] h-[240px] sm:h-[360px] lg:h-[400px]'
                slides={slides}
                mobileSlides={mobileSlides}
                autoplay
                autoplayDelay={5000}
                showDots
                showButtons={false}
                slidesPerView={1}
            />
        </HomeContentWrapper>
    )
}

export default HeroSection

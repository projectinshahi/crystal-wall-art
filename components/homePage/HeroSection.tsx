import Carousel from '../ui/carousel'
import HomeContentWrapper from './HomeContentWrapper'
import img1 from '@/public/hero/hero1.webp'
import img2 from '@/public/hero/hero2.png'
import img3 from '@/public/hero/hero3.webp'
import img4 from '@/public/hero/hero1.webp'

const HeroSection = () => {

    const slides = [img1, img2, img3, img4]

    return (
        <HomeContentWrapper containerClassName='px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20'>
            <Carousel
                viewPortClassName='rounded-[20px] h-[236px] sm:h-[400px]'
                slides={slides}
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
import Carousel from '../ui/carousel'
import HomeContentWrapper from './HomeContentWrapper'

const HeroSection = () => {

    const slides = [
        <img src="/hero/hero1.webp" className="w-full object-cover" />,
        <img src="/hero/hero2.png" className="w-full object-cover" />,
        <img src="/hero/hero3.webp" className="w-full object-cover" />,
    ]

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
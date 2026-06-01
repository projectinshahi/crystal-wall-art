"use server"

import Carousel from '../ui/carousel'
import HomeContentWrapper from './HomeContentWrapper'

const HeroSection = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/content?type=hero_section&&active=true`);

    const slidesRes = await res.json();

    if (!slidesRes?.success || !slidesRes.data) return null;

    const slidesData = slidesRes?.data?.data || [];

    const slides =
        slidesData
            ?.sort((a: any, b: any) => a.priority - b.priority) // ✅ sort by priority ASC
            .map((item: any) => {
                try {
                    const img = JSON.parse(item.image);
                    return img.url;
                } catch {
                    return null;
                }
            })
            .filter(Boolean) || [];

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
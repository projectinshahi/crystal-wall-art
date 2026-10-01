"use server"

import Carousel from '../ui/carousel'
import HomeContentWrapper from './HomeContentWrapper'

const HeroSection = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/content?type=hero_section&&active=true`);

    const slidesRes = await res.json();

    if (!slidesRes?.success || !slidesRes.data) return null;

    const slidesData = slidesRes?.data?.data || [];

    const parseUrl = (raw: string | null) => {
        try {
            return raw ? JSON.parse(raw).url : null;
        } catch {
            return null;
        }
    };

    const items =
        slidesData
            ?.sort((a: any, b: any) => a.priority - b.priority) // ✅ sort by priority ASC
            .map((item: any) => ({ desktop: parseUrl(item.image), mobile: parseUrl(item.mobile_image) }))
            .filter((item: any) => item.desktop) || [];

    const slides = items.map((item: any) => item.desktop);
    const mobileSlides = items.map((item: any) => item.mobile);
    // With mobile banners, height follows the image below lg (no crop); desktop unchanged
    const hasMobile = mobileSlides.some(Boolean);

    return (
        <HomeContentWrapper containerClassName='px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20'>
            <Carousel
                viewPortClassName={`rounded-[20px] ${hasMobile ? 'lg:h-[400px]' : 'h-[236px] sm:h-[400px]'}`}
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
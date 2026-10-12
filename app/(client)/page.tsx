export const dynamic = 'force-dynamic';

import AboutSection from "@/components/homePage/AboutSection";
import CategoriesSection from "@/components/homePage/CategoriesSection";
import FrameSelection from "@/components/homePage/FrameSelection";
import HeroSection from "@/components/homePage/HeroSection";
import PremiumPhotos from "@/components/homePage/PremiumPhotos";
import ShopLookSection from "@/components/homePage/ShopLookSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <FrameSelection /> */}
      <CategoriesSection />
      <PremiumPhotos />
      <ShopLookSection image="/images/arcylic2.jpg"/>
      <AboutSection />
    </>
  );
}

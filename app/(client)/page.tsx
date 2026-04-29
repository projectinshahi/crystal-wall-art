import AboutSection from "@/components/homePage/AboutSection";
import CategoriesSection from "@/components/homePage/CategoriesSection";
import Frames3DSlider from "@/components/homePage/Frames3DSlider";
import FrameSelection from "@/components/homePage/FrameSelection";
import HeroSection from "@/components/homePage/HeroSection";
import PremiumPhotos from "@/components/homePage/PremiumPhotos";
import ShopLookSection from "@/components/homePage/ShopLookSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      {/* <FrameSelection /> */}
      <CategoriesSection />
      <PremiumPhotos />
      <ShopLookSection image="/images/arcylic2.jpg"/>
      <Frames3DSlider />
      <ShopLookSection image="/images/arcylic4.jpg"/>
    </>
  );
}

import AboutSection from "@/components/homePage/AboutSection";
import CategoriesSection from "@/components/homePage/CategoriesSection";
import FrameSelection from "@/components/homePage/FrameSelection";
import HeroSection from "@/components/homePage/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FrameSelection />
      <CategoriesSection />
    </>
  );
}

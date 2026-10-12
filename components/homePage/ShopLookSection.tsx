import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import HomeContentWrapper from "./HomeContentWrapper"
import { getHomeBanners } from "./getHomeBanners"
import { isVideoUrl } from "@/lib/utils/media"

// `image` is the fallback shown until a "Shop Now Banner" is added in Admin → Content
export default async function ShopLookSection({ image }: { image: string }) {
    const [banner] = await getHomeBanners("shop_now_banner")
    const media = banner?.url ?? image
    const link = banner?.link || "/products"

    return (
        <HomeContentWrapper containerClassName="py-0 sm:py-0">

            <div className="relative overflow-hidden rounded-[20px] shadow-md">

                {/* Image or video */}
                {isVideoUrl(media) ? (
                    <video
                        src={media}
                        className="w-full h-[260px] lg:h-[460px] object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <Image
                        src={media}
                        alt="Shop the look"
                        width={1200}
                        height={600}
                        className="w-full h-[260px] lg:h-[460px] object-cover"
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <Button asChild className="rounded-full px-6 bg-grayBorder/41 text-black hover:bg-grayBorder/60 cursor-pointer">
                        <Link href={link}>Shop Now</Link>
                    </Button>

                </div>
            </div>

        </HomeContentWrapper>
    )
}

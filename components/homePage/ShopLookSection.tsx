"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import HomeContentWrapper from "./HomeContentWrapper"

export default function ShopLookSection({ image }: { image: string }) {
    return (
        <HomeContentWrapper containerClassName="py-0 sm:py-0">

            <div className="relative overflow-hidden shadow-md">

                {/* Image */}
                <Image
                    src={image}
                    alt="Shop the look"
                    width={1200}
                    height={600}
                    className="w-full h-[260px] lg:h-[460px] object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <Button className="rounded-full px-6 bg-grayBorder/41 text-black hover:bg-grayBorder/60 cursor-pointer">
                        Shop Now
                    </Button>

                </div>
            </div>

        </HomeContentWrapper>
    )
}
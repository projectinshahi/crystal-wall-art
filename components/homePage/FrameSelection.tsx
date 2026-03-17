"use client"

import HomeContentWrapper from "./HomeContentWrapper"
import { Typography } from "../ui/Typography"
import Image from "next/image"
import { cn } from "@/lib/utils"

const FRAME_TYPES = [
    {
        key: "portrait",
        label: "Portrait",
        image: "/frames/portrait.png",
        ratio: "aspect-[3/4]",
    },
    {
        key: "landscape",
        label: "Landscape",
        image: "/frames/landscape.png",
        ratio: "aspect-[4/3]",
    },
    {
        key: "square",
        label: "Square",
        image: "/samples/abstract-canvas.jpg",
        ratio: "aspect-square",
    },
]

const FrameSelection = () => {
    const handleFrameClick = (key: string) => {
        console.log(key)
    }

    return (
        <HomeContentWrapper wrapperClassName="bg-lightGray mt-5">

            <Typography className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-center mb-5">
                Select your frame
            </Typography>

            <div className="flex justify-center gap-4 sm:gap-10 flex-wrap">

                {FRAME_TYPES.map((item) => (
                    <div
                        key={item.key}
                        className="flex flex-col items-center w-[140px] sm:w-[170px] lg:w-[200px]"
                    >

                        <button
                            onClick={() => handleFrameClick(item.key)}
                            className="group w-full rounded-[28px] bg-grayBorder border-2 border-lightBackground p-4 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer"
                        >

                            <div className="flex items-center justify-center h-[150px] sm:h-[180px] lg:h-[210px] overflow-hidden">

                                <div
                                    className={cn(
                                        "relative w-full overflow-hidden bg-muted",
                                        item.ratio
                                    )}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                            </div>

                        </button>

                        <span className="mt-3 text-sm sm:text-base font-medium text-foreground text-center">
                            {item.label}
                        </span>

                    </div>
                ))}

            </div>

        </HomeContentWrapper>
    )
}

export default FrameSelection
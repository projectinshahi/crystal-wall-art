"use client"

import React from 'react'
import HomeContentWrapper from './HomeContentWrapper'
import { Typography } from '../ui/Typography'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const CATEGORIES = [
    {
        key: "Premium acrylic photos",
        label: "Premium acrylic photos",
        image: "/categories/img1.jpg"
    },
    {
        key: "Spiritual wall art",
        label: "Spiritual wall art",
        image: "/categories/img2.jpg"
    },
    {
        key: "Personalized Wall Clock",
        label: "Personalized Wall Clock",
        image: "/categories/img3.jpg"
    },
    {
        key: "Wall art",
        label: "Wall art",
        image: "/categories/img4.jpg"
    },
    {
        key: "Frame set",
        label: "Frame set",
        image: "/categories/img5.jpg"
    },
    {
        key: "Special Gift",
        label: "Special Gift",
        image: "/categories/img6.jpg"
    },
    {
        key: "Personalized Shapes",
        label: "Personalized Shapes",
        image: "/categories/img7.jpg"
    },
    {
        key: "3D Frames",
        label: "3D Frames",
        image: "/categories/img8.jpg"
    },
    {
        key: "Canvas Print",
        label: "Canvas Print",
        image: "/categories/img9.jpg"
    },
]

const CategoriesSection = () => {

    const handleCategoryClick = (key: any) => { }

    return (
        <HomeContentWrapper wrapperClassName="bg-lightGray mt-5">

            <Typography className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-center mb-5">
                Categories
            </Typography>

            <div className="flex justify-center gap-4 sm:gap-10 flex-wrap">
                {CATEGORIES.map((item) => (
                    <div
                        key={item.key}
                        className="flex flex-col items-center w-[140px] sm:w-[170px] lg:w-[200px]"
                    >

                        <button
                            onClick={() => handleCategoryClick(item.key)}
                            className="group w-full rounded-[28px] border-2 border-lightBackground hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                        >

                            <div className="flex items-center justify-center">

                                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-muted">

                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        fill
                                        sizes="(max-width:640px) 140px, (max-width:1024px) 170px, 200px"
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

export default CategoriesSection
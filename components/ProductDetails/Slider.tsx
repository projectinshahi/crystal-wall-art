import React from 'react'
import ImageSlider from '../ui/Carousel/index'
import { ProductImage } from '@/types/Admin/products.types'

const Slider = ({ images }: { images?: ProductImage[] }) => {
    return <ImageSlider slides={images as any} showArrow={false} options={{ loop: true, align: 'start' }} autoplayDelay={2000} dotPosition="inside-bottom-center" dotClassName='bg-[#D9D9D9]' />
}

export default Slider
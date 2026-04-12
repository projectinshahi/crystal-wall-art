import React from 'react'
import ImageSlider from '../ui/Carousel/index'

const slides = [
    {
        id: 1,
        image: '/products/prd13.png'
    },
    {
        id: 2,
        image: '/products/prd14.jpg'
    }]

const Slider = () => {
    return <ImageSlider slides={slides} showArrow={false} options={{ loop: true, align: 'start' }} autoplayDelay={2000} dotPosition="inside-bottom-center" dotClassName='bg-[#D9D9D9]' />
}

export default Slider
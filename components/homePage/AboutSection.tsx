import React from 'react'
import HomeContentWrapper from './HomeContentWrapper'
import { Typography } from '../ui/Typography'

const AboutSection = () => {
    return (
        <HomeContentWrapper wrapperClassName='bg-secondary'>
            <div className='flex flex-col space-y-3'>
                <Typography className='text-center text-base lg:text-xl font-bold text-white leading-5 tracking-wide'>Crystal Wall Art- Wings To Your Imagination. Best Quality Acrylic Printing At Affordable Rate</Typography>
                <Typography className='text-center text-sm lg:text-base text-white leading-auto'>Because Acrylic prints are personalized products, we understand there are a lot of expectations that our
                    clients have and we have a fantastic consumer carrier group that is reachable round the clock simply to assist you
                    get the precise product that you have in mind. The substances we use for our prints are higher than or at least up
                    to the enterprise requirements and we can guarantee you that our purchaser pleasant fees have now not come at the
                    cost of quality
                </Typography>
            </div>
        </HomeContentWrapper>
    )
}

export default AboutSection
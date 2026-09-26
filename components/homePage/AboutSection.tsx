import React from 'react'
import HomeContentWrapper from './HomeContentWrapper'
import { Typography } from '../ui/Typography'
import { HOME_INTRO_CONTENT_TYPE, HOME_INTRO_DEFAULTS } from '@/lib/constants/content.constants'

// Admin-managed heading/description (Admin → Content → Homepage Intro Section); falls back to the original copy
const getHomeIntro = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/content?type=${HOME_INTRO_CONTENT_TYPE}`);
        const json = await res.json();
        const item = json?.success ? json.data?.data?.[0] : null;

        return {
            title: item?.title || HOME_INTRO_DEFAULTS.title,
            description: item?.description || HOME_INTRO_DEFAULTS.description,
        };
    } catch {
        return HOME_INTRO_DEFAULTS;
    }
}

const AboutSection = async () => {
    const { title, description } = await getHomeIntro();

    return (
        <HomeContentWrapper wrapperClassName='bg-secondary'>
            <div className='flex flex-col space-y-3'>
                <Typography className='text-center text-base lg:text-xl font-bold text-white leading-5 tracking-wide'>{title}</Typography>
                <Typography className='text-center text-sm lg:text-base text-white leading-auto'>{description}</Typography>
            </div>
        </HomeContentWrapper>
    )
}

export default AboutSection

import { Typography } from '@/components/ui/Typography'
import React from 'react'

const ProductInfo = () => {
    return (
        <>
            <Typography variant='body-lg' className='!font-normal'>Premium acrylic photos</Typography>
            <div className='flex items-center gap-2'>
                <Typography variant='h3_5' className='text-black !font-medium'>999</Typography>
                <Typography variant='h5' className='text-darkGray/37 !font-medium line-through'>1099</Typography>
            </div>
        </>
    )
}

export default ProductInfo
import { Typography } from '@/components/ui/Typography'
import React from 'react'

const ProductInfo = ({ title, price, finalPrice }: { title: string, price: string, finalPrice: string | 0 | null }) => {
    return (
        <>
            <Typography variant='body-lg' className='!font-bold capitalize'>{title}</Typography>
            <div className='flex items-center gap-2'>
                <Typography variant='h3_5' className='text-black !font-medium'>{price}</Typography>
                {finalPrice && (<Typography variant='h5' className='text-darkGray/37 !font-medium line-through'>{finalPrice}</Typography>)}
            </div>
        </>
    )
}

export default ProductInfo
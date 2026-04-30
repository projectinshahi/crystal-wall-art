"use client"

import React, { useState } from 'react'
import { Typography } from '../ui/Typography'
import Rating from '../inputs/Rating'

const ProductDescription = ({desc}:{desc:string}) => {

    const [rating, setRating] = useState<number>(3.5);

    return (
        <>
            <Typography variant='label' className='!font-normal mt-4 mb-2 text-justify'>{desc}</Typography>
            <Rating value={rating} onChange={setRating} />
        </>
    )
}

export default ProductDescription
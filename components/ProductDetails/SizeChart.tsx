import React from 'react'
import { Typography } from '../ui/Typography'

const SizeChart = () => {
    return (
        <div className='mt-4 gap-0.5'>
            <Typography variant='label' className='!font-bold'>{`Size chart`}</Typography>
            <ul>
                <li className='w-full flex gap-3 justify-between'>
                    <Typography variant="label" className="flex items-center !font-medium">Acrylic size (Inch)</Typography>
                    <Typography variant="label" className="flex items-center !font-medium">12x15</Typography>
                </li>
                <li className='w-full flex gap-3 justify-between'>
                    <Typography variant="label" className="flex items-center !font-medium">Thickness</Typography>
                    <Typography variant="label" className="flex items-center !font-medium">5mm</Typography>
                </li>
                <li className='w-full flex gap-3 justify-between'>
                    <Typography variant="label" className="flex items-center !font-medium">Mounting</Typography>
                    <Typography variant="label" className="flex items-center !font-medium">Studs</Typography>
                </li>
            </ul>
        </div>
    )
}

export default SizeChart
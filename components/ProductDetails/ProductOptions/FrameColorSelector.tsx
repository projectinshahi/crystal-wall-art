"use client"

import ColorSelector from '@/components/inputs/ColorSelector'
import { Typography } from '@/components/ui/Typography'
import React, { useState } from 'react'

const FrameColorSelector = () => {

    const [selectedColor, setSelectedColor] = useState<string>("#000000");

    return (
        <div className="flex flex-col mt-3 gap-0.5">
            <Typography variant='label' className='!font-bold'>{`Selected Frame`}</Typography>
            <ColorSelector
                colors={[
                    { value: "#000000" },
                    { value: "#ffffff" },
                    { value: "#ff0000" },
                    { value: "#00ff00" },
                    { value: "#0000ff" },
                ]}
                value={selectedColor}
                onChange={setSelectedColor}
            />
        </div>
    )
}

export default FrameColorSelector
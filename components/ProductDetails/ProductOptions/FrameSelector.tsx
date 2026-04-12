import CustomRadioGroup from '@/components/inputs/CustomRadioGroup'
import { Typography } from '@/components/ui/Typography'
import React from 'react'

const FrameSelector = () => {
    return (
        <div className="flex flex-col mt-3 gap-0.5">
            <Typography variant='label' className='!font-bold'>{`Frame`}</Typography>
            <CustomRadioGroup
                defaultValue="frame"
                options={[
                    { label: "Frame print on canvas", value: "frame" },
                    { label: "Gallery wrap canvas", value: "canvas" },
                ]}
                onChange={(val) => console.log(val)}
            />
        </div>
    )
}

export default FrameSelector
import ChipSelector, { ChipOption } from '@/components/inputs/ChipSelector'
import { Typography } from '@/components/ui/Typography'
import React from 'react'

const MountingSelector = () => {

    const mountingOptions: ChipOption[] = [
            { label: "Studs", value: "Studs" },
            { label: "Sticker", value: "Sticker" },
        ];

    return (
        <div className="flex flex-col mt-3 gap-0.5">
            <Typography variant='label' className='!font-bold'>{`Mounting method`}</Typography>
            <div className='flex flex-row gap-2 flex-wrap'>
                <ChipSelector
                    options={mountingOptions}
                    defaultValue='Studs'
                    onChange={(val) => console.log(val)}
                />
            </div>
        </div>
    )
}

export default MountingSelector
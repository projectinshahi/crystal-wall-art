import ChipSelector, { ChipOption } from '@/components/inputs/ChipSelector'
import { Typography } from '@/components/ui/Typography'
import React from 'react'

const ThicknessSelector = () => {

    const thicknessOptions: ChipOption[] = [
        { label: "5mm", value: "5mm" },
        { label: "10mm", value: "10mm" },
        { label: "15mm", value: "15mm" },
        { label: "20mm", value: "20mm" },
        { label: "25mm", value: "25mm" },
        { label: "30mm", value: "30mm", disabled: true },
    ];

    return (
        <div className="flex flex-col mt-3 gap-0.5">
            <Typography variant='label' className='!font-bold'>{`Thickness`}</Typography>
            <div className='flex flex-row gap-2 flex-wrap'>
                <ChipSelector
                    options={thicknessOptions}
                    onChange={(val) => console.log(val)}
                />
            </div>
        </div>
    )
}

export default ThicknessSelector
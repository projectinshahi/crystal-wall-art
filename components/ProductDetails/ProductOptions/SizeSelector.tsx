import { Typography } from '@/components/ui/Typography'
import React from 'react'
import Chip from '../../inputs/ChipSelector/Chip';
import ChipSelector, { ChipOption } from '@/components/inputs/ChipSelector';

const SizeSelector = () => {

    const sizeOptions: ChipOption[] = [
        { label: "8×6", value: "8x6" },
        { label: "12×8", value: "12x8" },
        { label: "12×15", value: "12x15" },
        { label: "12×18", value: "12x18" },
        { label: "18×24", value: "18x24" },
        { label: "24×36", value: "24x36" },

        // disabled ones
        { label: "18×24", value: "18x24", disabled: true },
        { label: "24×36", value: "24x36", disabled: true },
    ];

    return (
        <div className="flex flex-col mt-3 gap-0.5">
            <Typography variant='label' className='!font-bold'>{`Acrylic size (Inch)`}</Typography>
            <div className="flex flex-wrap gap-2 mt-2">
                <ChipSelector
                    options={sizeOptions}
                    defaultValue="12x15"
                    onChange={(val) => console.log(val)}
                />
            </div>
        </div>
    )
}

export default SizeSelector
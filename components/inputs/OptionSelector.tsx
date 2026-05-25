"use client";

import { Typography } from "@/components/ui/Typography";
import ChipSelector, { ChipOption } from "@/components/inputs/ChipSelector";

interface OptionSelectorProps {
    label: string;
    options: ChipOption[];
    selected: string;
    onSelect: (value: string) => void;
}

const OptionSelector = ({
    label,
    options,
    selected,
    onSelect,
}: OptionSelectorProps) => {
    if (!options || options.length === 0) return null;

    return (
        <div className="flex flex-col mt-3 gap-0.5">
            <Typography variant="label" className="!font-bold">
                {label}
            </Typography>

            <div className="flex flex-wrap gap-2 mt-2">
                <ChipSelector
                    options={options}
                    value={selected}
                    defaultValue={options[0]?.value}
                    onChange={onSelect}
                />
            </div>
        </div>
    );
};

export default OptionSelector;
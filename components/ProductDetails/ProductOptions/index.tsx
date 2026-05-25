import React from 'react'
import SizeSelector from './SizeSelector'
import ThicknessSelector from './ThicknessSelector'
import MountingSelector from './MountingSelector'
import FrameSelector from './FrameSelector'
import FrameColorSelector from './FrameColorSelector'
import OptionSelector from '@/components/inputs/OptionSelector'
import { ChipOption } from '@/components/inputs/ChipSelector'

export type ChipsOptionsSelector = {
  options: ChipOption[];
  selected: string;
}

type Props = {
  size?: ChipsOptionsSelector;
  thickness?: ChipsOptionsSelector;
  mounting?: ChipsOptionsSelector;
  orientations?: ChipsOptionsSelector;

  onChange?: (type: string, value: string) => void;
};

const ProductOptions = ({
  size,
  thickness,
  mounting,
  orientations,
  onChange
}: Props) => {

  const config = [
    { key: "size", label: "Size (Inch)", data: size },
    { key: "thickness", label: "Thickness", data: thickness },
    { key: "mounting", label: "Mounting Method", data: mounting },
    { key: "orientation", label: "Orientation", data: orientations },
  ];

  return (
    <>
      {config.map(({ key, label, data }) =>
        data ? (
          <OptionSelector
            key={key}
            label={label}
            options={data.options}
            selected={data.selected}
            onSelect={(val) => onChange?.(key, val)}
          />
        ) : null
      )}
      {/* <FrameSelector /> */}
      {/* <FrameColorSelector /> */}
    </>
  )
}

export default ProductOptions
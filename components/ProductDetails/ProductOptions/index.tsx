import React from 'react'
import SizeSelector from './SizeSelector'
import ThicknessSelector from './ThicknessSelector'
import MountingSelector from './MountingSelector'
import FrameSelector from './FrameSelector'
import FrameColorSelector from './FrameColorSelector'

const ProductOptions = () => {
  return (
    <>
      <SizeSelector />
      <ThicknessSelector />
      <MountingSelector />
      <FrameSelector />
      <FrameColorSelector />
    </>
  )
}

export default ProductOptions
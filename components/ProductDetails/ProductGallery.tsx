
import { ProductImage } from '@/types/Admin/products.types'
import Slider from './Slider'
import { Heart } from 'lucide-react'

const ProductGallery = ({ images }: { images?: ProductImage[] }) => {
    return (
        <>
            <div className='w-full relative'>
                <Slider images={images} />
                <button className='bg-primary hover:bg-primary/80 transition-colors rounded-full p-2 absolute top-4 right-4 z-10 cursor-pointer'>
                    <Heart className='text-white w-4 h-4 lg:w-6 lg:h-6' />
                </button>
            </div>
        </>
    )
}

export default ProductGallery
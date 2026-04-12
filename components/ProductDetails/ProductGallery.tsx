
import Slider from './Slider'
import { Heart } from 'lucide-react'

const ProductGallery = () => {
    return (
        <>
            <div className='w-full relative'>
                <Slider />
                <button className='bg-primary hover:bg-primary/80 transition-colors rounded-full p-2 absolute top-4 right-4 z-10 cursor-pointer'>
                    <Heart className='text-white w-4 h-4 lg:w-6 lg:h-6' />
                </button>
            </div>
        </>
    )
}

export default ProductGallery
import React from 'react'
import ProductStepperForm from './ProductStepperForm'

interface Props {
    productId?: string;
}

const AddProductsPage = ({ productId }: Props) => {
    return (
        <ProductStepperForm productId={productId} />
    )
}

export default AddProductsPage
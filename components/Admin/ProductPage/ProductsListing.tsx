import React from 'react'
import Filters from './Filters'
import Spinner from '../Loader/Spinner'
import NoProducts from './NoProducts'
import TableData from './TableData'

const ProductsListing = () => {
    return (
        <>
            <Filters />
            <Spinner />
            <NoProducts />
            <TableData />
        </>
    )
}

export default ProductsListing
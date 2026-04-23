import AdminPageHeader from '../Common/PageHeader'
import AddProductButton from './AddProductButton'
import ProductsListing from './ProductsListing'

const ProductPage = () => {

    const products = [{}, {}, {}]
    return (
        <>
            <AdminPageHeader title="Products" subTitle={`Manage your wall art catalog (${products.length} products)`} children={<AddProductButton />} />
            <ProductsListing />
        </>
    )
}

export default ProductPage
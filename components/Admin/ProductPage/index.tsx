import { headers } from 'next/headers';
import AdminPageHeader from '../Common/PageHeader';
import AddProductButton from './AddProductButton';
import ProductsListing from './ProductsListing';

const ProductPage = async () => {
    
    return (
        <>
            <AdminPageHeader
                title="Products"
                subTitle="Manage your wall art products"
                children={<AddProductButton />}
            />
            <ProductsListing />
        </>
    );
};

export default ProductPage;
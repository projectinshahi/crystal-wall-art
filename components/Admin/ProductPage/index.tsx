import { headers } from 'next/headers';
import AdminPageHeader from '../Common/PageHeader';
import AddProductButton from './AddProductButton';
import ProductsListing from './ProductsListing';

const ProductPage = async () => {
    const headerList = await headers(); // 👈 FIX

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/product?page=1&limit=10`,
        {
            headers: {
                cookie: headerList.get('cookie') || '',
            },
            cache: 'no-store',
        }
    );

    const products = await res.json()

    if(!products || !products.success) return null
    
    return (
        <>
            <AdminPageHeader
                title="Products"
                subTitle="Manage your wall art products"
                children={<AddProductButton />}
            />
            <ProductsListing products={products.data} metaData={products.meta} />
        </>
    );
};

export default ProductPage;